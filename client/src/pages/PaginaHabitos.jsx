import FormularioRegistroDiario from '../components/habitos/FormularioRegistroDiario';

export default function PaginaHabitos() {
  return (
    <div className="page">
      <div className="hero-banner">
        <span className="eyebrow">Registro diário</span>
        <h1 className="hero-headline">Como foi o seu dia hoje?</h1>
      </div>
      <FormularioRegistroDiario />
    </div>
  );
}
