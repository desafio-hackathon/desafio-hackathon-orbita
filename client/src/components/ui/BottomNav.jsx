import { NavLink } from 'react-router-dom';
import { Home, LineChart, Trophy, User } from 'lucide-react';

const ITENS = [
  { chave: 'inicio', label: 'Início', Icone: Home, rota: '/avatar' },
  { chave: 'progresso', label: 'Progresso', Icone: LineChart, rota: '/historico' },
  { chave: 'conquistas', label: 'Conquistas', Icone: Trophy, rota: '/inventario' },
  { chave: 'perfil', label: 'Perfil', Icone: User },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {ITENS.map(({ chave, label, Icone, rota }) =>
        rota ? (
          <NavLink
            key={chave}
            to={rota}
            className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}
          >
            <Icone size={20} className="bottom-nav-icon" />
            <span>{label}</span>
          </NavLink>
        ) : (
          <span key={chave} className="bottom-nav-item disabled">
            <Icone size={20} className="bottom-nav-icon" />
            <span>{label}</span>
          </span>
        ),
      )}
    </nav>
  );
}
