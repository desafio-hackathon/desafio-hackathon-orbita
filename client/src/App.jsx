import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PaginaAvatar from './pages/PaginaAvatar';
import PaginaHabitos from './pages/PaginaHabitos';
import PaginaInventario from './pages/PaginaInventario';
import PaginaHistorico from './pages/PaginaHistorico';
import BottomNav from './components/ui/BottomNav';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/avatar" replace />} />
        <Route path="/avatar" element={<PaginaAvatar />} />
        <Route path="/habitos" element={<PaginaHabitos />} />
        <Route path="/inventario" element={<PaginaInventario />} />
        <Route path="/historico" element={<PaginaHistorico />} />
      </Routes>
      <BottomNav />
    </BrowserRouter>
  );
}
