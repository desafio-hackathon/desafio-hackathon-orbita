import MascoteEvolutivo from '../components/analytics/MascoteEvolutivo';
import useAvatarStore, { CATEGORIAS, selecionarNivelGeral } from '../state/useAvatarStore';

export default function PaginaHistorico() {
  const nivelGeral = useAvatarStore(selecionarNivelGeral);
  const sono = useAvatarStore((state) => state.sono);
  const agua = useAvatarStore((state) => state.agua);
  const alimentacao = useAvatarStore((state) => state.alimentacao);
  const treino = useAvatarStore((state) => state.treino);

  const dados = { sono, agua, alimentacao, treino };

  return (
    <div className="page">
      <div className="hero-banner">
        <span className="eyebrow">Sua evolução</span>
        <h1 className="hero-headline">
          Estágio {nivelGeral.estagioAtual.estagio} — {nivelGeral.estagioAtual.nome}
        </h1>
      </div>

      <MascoteEvolutivo />

      <div className="stats-panel mascote-resumo">
        {CATEGORIAS.map(({ chave, Icone }) => (
          <span key={chave} className="mascote-resumo-item">
            <Icone size={16} />
            {dados[chave].nivel}
          </span>
        ))}
      </div>
    </div>
  );
}
