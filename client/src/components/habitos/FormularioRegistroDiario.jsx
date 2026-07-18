import { useEffect, useState } from 'react';
import { AlertCircle, Flame } from 'lucide-react';
import useAvatarStore, { CATEGORIAS } from '../../state/useAvatarStore';
import { enviarScoreDiario } from '../../services/api';

const iconeDe = (chave) => CATEGORIAS.find((categoria) => categoria.chave === chave).Icone;

const IconeAlimentacao = iconeDe('alimentacao');

const USER_ID_MOCK = 'user-teste-01';

const CAMPOS_SLIDER = [
  { chave: 'sono', label: 'Horas dormidas', Icone: iconeDe('sono'), min: 0, max: 12, step: 1, formatar: (v) => `${v}h` },
  { chave: 'agua', label: 'Copos de água', Icone: iconeDe('agua'), min: 0, max: 10, step: 1, formatar: (v) => `${v} copos` },
  { chave: 'treino', label: 'Minutos de treino', Icone: iconeDe('treino'), min: 0, max: 90, step: 5, formatar: (v) => `${v} min` },
];

const MISSOES_DIARIAS_ALIMENTACAO = [
  'Comeu vegetais ou frutas',
  'Evitou frituras/ultraprocessados',
  'Bebeu água antes das refeições',
  'Fez as refeições em horários regulares',
  'Evitou beliscar entre as refeições',
];

const MISSOES_SEMANAIS_ALIMENTACAO = [
  'Preparou ao menos 1 refeição em casa esta semana',
  'Evitou refrigerante/doces em excesso na semana',
  'Planejou o cardápio da semana',
];

const PONTOS_MISSAO_DIARIA = 5;
const PONTOS_MISSAO_SEMANAL = 15;
const PONTOS_MAXIMOS_ALIMENTACAO =
  MISSOES_DIARIAS_ALIMENTACAO.length * PONTOS_MISSAO_DIARIA + MISSOES_SEMANAIS_ALIMENTACAO.length * PONTOS_MISSAO_SEMANAL;

const VALOR_INICIAL = { sono: 0, agua: 0, treino: 0 };
const CHECKLIST_DIARIO_INICIAL = MISSOES_DIARIAS_ALIMENTACAO.map(() => false);
const CHECKLIST_SEMANAL_INICIAL = MISSOES_SEMANAIS_ALIMENTACAO.map(() => false);

// Cada campo/categoria tem sua própria unidade (horas, copos, minutos, pontos de missão);
// esta função normaliza cada uma para uma nota 0-10 só para alimentar o score enviado ao backend.
const normalizarParaScore = (valor, maximo) => Math.round((valor / maximo) * 10);

export default function FormularioRegistroDiario() {
  const registrarHabito = useAvatarStore((state) => state.registrarHabito);
  const streak = useAvatarStore((state) => state.streak);
  const [valores, setValores] = useState(VALOR_INICIAL);
  const [checklistDiario, setChecklistDiario] = useState(CHECKLIST_DIARIO_INICIAL);
  const [checklistSemanal, setChecklistSemanal] = useState(CHECKLIST_SEMANAL_INICIAL);
  const [confirmado, setConfirmado] = useState(false);
  const [mostrarStreakToast, setMostrarStreakToast] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState(false);

  useEffect(() => {
    if (!mostrarStreakToast) return undefined;
    const timer = setTimeout(() => setMostrarStreakToast(false), 3000);
    return () => clearTimeout(timer);
  }, [mostrarStreakToast]);

  const handleChange = (categoria, valor) => {
    setValores((prev) => ({ ...prev, [categoria]: Number(valor) }));
    setConfirmado(false);
  };

  const handleToggleDiario = (indice) => {
    setChecklistDiario((prev) => prev.map((marcado, i) => (i === indice ? !marcado : marcado)));
    setConfirmado(false);
  };

  const handleToggleSemanal = (indice) => {
    setChecklistSemanal((prev) => prev.map((marcado, i) => (i === indice ? !marcado : marcado)));
    setConfirmado(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    CAMPOS_SLIDER.forEach(({ chave }) => {
      if (valores[chave] > 0) {
        registrarHabito(chave, valores[chave]);
      }
    });

    const pontosAlimentacao =
      checklistDiario.filter(Boolean).length * PONTOS_MISSAO_DIARIA +
      checklistSemanal.filter(Boolean).length * PONTOS_MISSAO_SEMANAL;
    if (pontosAlimentacao > 0) {
      registrarHabito('alimentacao', pontosAlimentacao);
    }

    setConfirmado(true);
    setMostrarStreakToast(true);

    // cada campo "retorna" seu próprio score 0-10, mas só entram na média os
    // campos que a pessoa de fato respondeu — um campo em branco não conta
    // como 0 e não puxa a nota final para baixo
    const scoresRespondidos = [];
    if (valores.sono > 0) scoresRespondidos.push(normalizarParaScore(valores.sono, 12));
    if (valores.agua > 0) scoresRespondidos.push(normalizarParaScore(valores.agua, 10));
    if (valores.treino > 0) scoresRespondidos.push(normalizarParaScore(valores.treino, 90));
    if (pontosAlimentacao > 0) scoresRespondidos.push(normalizarParaScore(pontosAlimentacao, PONTOS_MAXIMOS_ALIMENTACAO));

    if (scoresRespondidos.length > 0) {
      const scoreFinal = Math.round(
        scoresRespondidos.reduce((soma, valor) => soma + valor, 0) / scoresRespondidos.length,
      );

      setEnviando(true);
      setErroEnvio(false);
      try {
        await enviarScoreDiario(USER_ID_MOCK, scoreFinal);
      } catch (erro) {
        setErroEnvio(true);
      } finally {
        setEnviando(false);
      }
    }

    setValores(VALOR_INICIAL);
    setChecklistDiario(CHECKLIST_DIARIO_INICIAL);
    setChecklistSemanal(CHECKLIST_SEMANAL_INICIAL);
  };

  return (
    <form onSubmit={handleSubmit} className="form-panel">
      {mostrarStreakToast && (
        <div className="toast-pill">
          <Flame size={16} /> {streak.diasConsecutivos} dias seguidos!
        </div>
      )}

      {CAMPOS_SLIDER.map(({ chave, label, Icone, min, max, step, formatar }) => {
        const percentual = ((valores[chave] - min) / (max - min)) * 100;

        return (
          <div key={chave} className="form-field">
            <label htmlFor={chave} className="field-label-icon">
              <Icone size={16} /> {label}: <span className="stat-value">{formatar(valores[chave])}</span>
            </label>
            <input
              id={chave}
              type="range"
              min={min}
              max={max}
              step={step}
              value={valores[chave]}
              onChange={(event) => handleChange(chave, event.target.value)}
              style={{
                background: `linear-gradient(to right, var(--accent-coral) ${percentual}%, rgba(245, 245, 240, 0.12) ${percentual}%)`,
              }}
            />
          </div>
        );
      })}

      <div className="form-field">
        <label className="field-label-icon">
          <IconeAlimentacao size={16} /> Alimentação
        </label>

        <span className="eyebrow checklist-subheading">Hoje</span>
        <div className="checklist">
          {MISSOES_DIARIAS_ALIMENTACAO.map((item, indice) => (
            <label key={item} className="checklist-item">
              <input
                type="checkbox"
                checked={checklistDiario[indice]}
                onChange={() => handleToggleDiario(indice)}
              />
              {item}
            </label>
          ))}
        </div>

        <span className="eyebrow checklist-subheading">Esta semana</span>
        <div className="checklist">
          {MISSOES_SEMANAIS_ALIMENTACAO.map((item, indice) => (
            <label key={item} className="checklist-item">
              <input
                type="checkbox"
                checked={checklistSemanal[indice]}
                onChange={() => handleToggleSemanal(indice)}
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      <button type="submit" className="btn btn-block" disabled={enviando}>
        {enviando ? 'Enviando...' : 'Registrar'}
      </button>

      {confirmado && <p className="confirm-message">Hábitos registrados!</p>}
      {erroEnvio && (
        <p className="status-message status-message--erro">
          <AlertCircle size={14} /> Não foi possível salvar agora, tente novamente.
        </p>
      )}
    </form>
  );
}
