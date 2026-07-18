import useAvatarStore, { selecionarItensDesbloqueados } from '../../state/useAvatarStore';

export default function InventarioItens() {
  const itensDesbloqueados = useAvatarStore(selecionarItensDesbloqueados);

  if (itensDesbloqueados.length === 0) {
    return <p className="empty-state">Continue registrando hábitos para desbloquear itens!</p>;
  }

  return (
    <div className="item-grid">
      {itensDesbloqueados.map((item) => (
        <div key={`${item.categoria}-${item.nivel}`} className="item-card">
          <span className="item-icon">{item.icone}</span>
          <span className="item-name">{item.nome}</span>
          <span className="item-dot" style={{ backgroundColor: item.cor }} />
        </div>
      ))}
    </div>
  );
}
