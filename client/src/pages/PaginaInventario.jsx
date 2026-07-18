import InventarioItens from '../components/gamificacao/InventarioItens';

export default function PaginaInventario() {
  return (
    <div className="page">
      <div className="hero-banner">
        <span className="eyebrow">Conquistas</span>
        <h1 className="hero-headline">Seus itens desbloqueados</h1>
      </div>
      <InventarioItens />
    </div>
  );
}
