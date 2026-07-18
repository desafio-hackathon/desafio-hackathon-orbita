import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Flame, Star } from 'lucide-react';
import useAvatarStore, { CATEGORIAS, selecionarNivelGeral } from '../../state/useAvatarStore';
import MascotePersonagem from './MascotePersonagem';

const NIVEL_MAXIMO = 5;
const STREAK_AQUECIDA = 7;

export default function AvatarPreview() {
  const sono = useAvatarStore((state) => state.sono);
  const agua = useAvatarStore((state) => state.agua);
  const alimentacao = useAvatarStore((state) => state.alimentacao);
  const treino = useAvatarStore((state) => state.treino);
  const streak = useAvatarStore((state) => state.streak);
  const streakAcabouDeSubir = useAvatarStore((state) => state.streakAcabouDeSubir);
  const limparNotificacaoStreak = useAvatarStore((state) => state.limparNotificacaoStreak);
  const diaAtual = useAvatarStore((state) => state.diaAtual);
  const diaTotal = useAvatarStore((state) => state.diaTotal);
  const pontosSemana = useAvatarStore((state) => state.pontosSemana);
  const nivelGeral = useAvatarStore(selecionarNivelGeral);

  useEffect(() => {
    if (!streakAcabouDeSubir) return undefined;
    const timer = setTimeout(limparNotificacaoStreak, 450);
    return () => clearTimeout(timer);
  }, [streakAcabouDeSubir, limparNotificacaoStreak]);

  const classesChama = ['top-stat-icon'];
  if (streakAcabouDeSubir) classesChama.push('flame-pulse');
  if (streak.diasConsecutivos >= STREAK_AQUECIDA) classesChama.push('flame-warm');

  const dados = { sono, agua, alimentacao, treino };

  const somaNiveis = CATEGORIAS.reduce((soma, { chave }) => soma + dados[chave].nivel, 0);
  const progresso = Math.round((somaNiveis / (CATEGORIAS.length * NIVEL_MAXIMO)) * 100);
  const pontosTotais = CATEGORIAS.reduce((soma, { chave }) => soma + dados[chave].pontosAcumulados, 0);

  return (
    <>
      <div className="top-stat-bar">
        <span className="top-stat">
          <Flame size={18} className={classesChama.join(' ')} /> {streak.diasConsecutivos}
        </span>
        <span className="top-stat">
          <Star size={18} className="top-stat-icon" /> {pontosTotais}
        </span>
        <span className="pill-badge">
          {diaAtual}/{diaTotal}
        </span>
      </div>

      <div className="hero-banner">
        <span className="eyebrow">Jornada de {diaTotal} dias</span>
        <h1 className="hero-headline">Dia {diaAtual} — continue evoluindo o Avatar</h1>
      </div>

      <div className="avatar-section">
        <div className="avatar-ring" style={{ '--progresso': progresso }}>
          <div className="avatar-ring-inner">
            <MascotePersonagem estagio={nivelGeral.estagioAtual.estagio} size={104} />
          </div>
        </div>
        <p className="avatar-stage-label">
          Estágio {nivelGeral.estagioAtual.estagio} — <strong>{nivelGeral.estagioAtual.nome}</strong>
        </p>
      </div>

      <div className="score-badges">
        <div className="score-badge">
          <span className="score-badge-value">{pontosSemana}</span>
          <span className="score-badge-label">Semana</span>
        </div>
        <div className="score-connector" />
        <div className="score-badge">
          <span className="score-badge-value">{pontosTotais}</span>
          <span className="score-badge-label">Total</span>
        </div>
      </div>

      <div className="cta-wrap">
        <Link to="/habitos" className="cta-button">
          <CheckCircle2 size={26} className="cta-icon" />
          Check-in
        </Link>
      </div>

      <div className="stats-panel">
        {CATEGORIAS.map(({ chave, label, Icone }) => {
          const categoria = dados[chave];
          const percentual = (categoria.nivel / NIVEL_MAXIMO) * 100;

          return (
            <div key={chave} className="stats-row">
              <span className="stats-icon">
                <Icone size={18} />
              </span>
              <span className="stats-label">{label}</span>
              <span className="stats-track">
                <span className="stats-fill" style={{ width: `${percentual}%` }} />
              </span>
              <span className="stats-value">
                {categoria.nivel}/{NIVEL_MAXIMO}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}
