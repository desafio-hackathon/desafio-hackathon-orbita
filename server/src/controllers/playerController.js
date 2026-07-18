const playerModel = require('../models/playerModel');

function getFeedbackMessage(score) {
    if (score >= 9.0) return "👑 Excelente! Você agiu como um verdadeiro herói da saúde hoje!";
    if (score >= 7.0) return "⚔️ Muito bom! Meta batida e hábitos defendidos com sucesso!";
    if (score >= 5.0) return "⚠️ Atenção! Você ficou na média. Seu avatar precisa de mais esforço.";
    return "💀 Dia crítico. Seus hábitos vacilaram e o avatar sofreu as consequências.";
}

exports.getPlayerData = (req, res) => {
    try {
        const playerData = playerModel.getState();
        res.status(200).json(playerData);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar os dados do jogador." });
    }
};

exports.submitDailyScore = async (req, res) => {
    try {
        const { userId, score } = req.body; // Recebe o id do usuário vindo do app/Postman

        if (!userId) {
            return res.status(400).json({ error: "O campo userId é obrigatório." });
        }

        if (score === undefined || score < 0 || score > 10) {
            return res.status(400).json({ error: "Envie uma nota de score válida entre 0 e 10." });
        }

        // Passa o userId e o score para a regra de negócio do Model
        const gameResult = await playerModel.processDailyScore(userId, score);
        const feedback = getFeedbackMessage(score);

        res.status(200).json({
            message: feedback,
            ...gameResult
        });
    } catch (error) {
        res.status(500).json({ error: error.message || "Erro ao processar o score diário." });
    }
};