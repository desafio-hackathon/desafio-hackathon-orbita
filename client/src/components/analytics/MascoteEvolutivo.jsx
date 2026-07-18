import { useEffect } from 'react';
import { PartyPopper } from 'lucide-react';
import useAvatarStore, { selecionarNivelGeral } from '../../state/useAvatarStore';
import MascotePersonagem from '../avatar/MascotePersonagem';

export default function MascoteEvolutivo() {
  const nivelGeral = useAvatarStore(selecionarNivelGeral);
  const mascoteEvoluiu = useAvatarStore((state) => state.mascoteEvoluiu);
  const limparNotificacaoMascote = useAvatarStore((state) => state.limparNotificacaoMascote);

  useEffect(() => {
    if (!mascoteEvoluiu) return undefined;
    const timer = setTimeout(limparNotificacaoMascote, 800);
    return () => clearTimeout(timer);
  }, [mascoteEvoluiu, limparNotificacaoMascote]);

  const classesMascote = ['mascote-wrap'];
  if (mascoteEvoluiu) classesMascote.push('mascote-powerup');
  if (nivelGeral.indiceEstagio >= 4) classesMascote.push('mascote-glow');

  return (
    <>
      {mascoteEvoluiu && (
        <div className="toast-pill">
          <PartyPopper size={18} /> Evoluiu para {nivelGeral.estagioAtual.nome}!
        </div>
      )}

      <div className={classesMascote.join(' ')}>
        <MascotePersonagem estagio={nivelGeral.estagioAtual.estagio} size={180} />
      </div>

      <p className="mascote-stage-label">
        Estágio {nivelGeral.estagioAtual.estagio} — <strong>{nivelGeral.estagioAtual.nome}</strong>
      </p>

      <div className="stats-track mascote-progress-track">
        <span className="stats-fill" style={{ width: `${nivelGeral.percentualProximo}%` }} />
      </div>
      <p className="mascote-progress-label">
        {nivelGeral.limiteProximo
          ? `${nivelGeral.pontosTotais} / ${nivelGeral.limiteProximo} pontos para o próximo estágio`
          : 'Estágio máximo alcançado!'}
      </p>
    </>
  );
}
