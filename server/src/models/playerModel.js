const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: './src/db/.env' });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

class PlayerModel {
    constructor() {
        this.state = {
            currentJourneyDay: 1,
            currentStreak: 0,
            usedVeteransProtectionToday: false,
            userXp: 0,
            userCoins: 0
        };
    }

    getState() {
        return {
            ...this.state,
            avatar: this.getAvatarState(this.state.currentJourneyDay),
            progressPercentage: ((this.state.currentJourneyDay - 1) / 100) * 100
        };
    }

    getAvatarState(day) {
        if (day < 50) return { status: "Sobrepeso / Maus Hábitos", asset: "avatar_inicial.png" };
        if (day >= 50 && day < 100) return { status: "Em Transição / Novos Hábitos", asset: "avatar_transicao.png" };
        return { status: "Modelo Saudável e Ativo / Lendário", asset: "avatar_saudavel.png" };
    }

    async processDailyScore(userId, score) {
        try {
            // 1. Busca o último registro do usuário no banco
            const { data: lastRecord, error: selectLastError } = await supabase
                .from('daily_records')
                .select('day, streak')
                .eq('user_id', userId)
                .order('day', { ascending: false })
                .limit(1);

            if (selectLastError) throw selectLastError;

            // Se houver registro anterior, lê os dados. Se não, inicia do zero.
            const hasHistory = lastRecord && lastRecord.length > 0;
            const currentDay = hasHistory ? lastRecord[0].day + 1 : 1;
            let lastStreak = hasHistory ? parseInt(lastRecord[0].streak) : 0;
            
            // Garante que se o streak anterior for NaN ou nulo por algum motivo, ele comece em 0
            if (isNaN(lastStreak)) lastStreak = 0;

            let currentStreak = 0;
            let streakMessage = "";

            // Regra da Ofensiva (Streak)
            if (score >= 7.0) {
                currentStreak = lastStreak + 1;
                streakMessage = "Ofensiva mantida!";
            } else {
                if (currentDay >= 50) {
                    currentStreak = lastStreak; // Proteção de Veterano mantém o streak anterior
                    streakMessage = "Proteção de Veterano ativada! Ofensiva salva.";
                } else {
                    currentStreak = 0; // Reseta a ofensiva se for menor que o dia 50
                    streakMessage = "Ofensiva resetada.";
                }
            }

            // 2. PERSISTÊNCIA NO BANCO
            const { error: insertError } = await supabase
                .from('daily_records')
                .insert([
                    { 
                        user_id: parseInt(userId), 
                        day: currentDay, 
                        score: parseFloat(score), 
                        streak: currentStreak // Agora com garantia total de valor numérico válido
                    }
                ]);

            if (insertError) throw insertError;

            // 3. RELATÓRIO SEMANAL
            let weeklyReport = null;
            if (currentDay % 7 === 0) {
                const startDay = currentDay - 6;
                
                const { data: records, error: selectError } = await supabase
                    .from('daily_records')
                    .select('score')
                    .eq('user_id', userId)
                    .gte('day', startDay)
                    .lte('day', currentDay);

                if (selectError) throw selectError;

                if (records && records.length > 0) {
                    const totalScoreSum = records.reduce((sum, rec) => sum + parseFloat(rec.score), 0);
                    const weeklyAverage = totalScoreSum / records.length;

                    weeklyReport = {
                        weekNumber: currentDay / 7,
                        averageScore: weeklyAverage.toFixed(2),
                        status: weeklyAverage >= 7.0 ? "Aprovado!" : "Abaixo da Média"
                    };
                }
            }

            return {
                userId,
                streakStatus: streakMessage,
                avatar: this.getAvatarState(currentDay),
                nextDay: currentDay + 1,
                weeklyReport
            };

        } catch (dbError) {
            console.error("❌ ERRO INTERNO DO SUPABASE:", dbError);
            throw new Error(`Falha no processamento: ${dbError.message || JSON.stringify(dbError)}`);
        }
    }
}
module.exports = new PlayerModel();