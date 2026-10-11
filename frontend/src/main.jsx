import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import './App.css';
import Login from './pages/Login.jsx';
import RutaProtegida from './auth/RutaProtegida.jsx';
import Layout from './components/Layout.jsx';
import Panel from './pages/Panel.jsx';
import PorRevisar from './pages/PorRevisar.jsx';
import Reportes from './pages/Reportes.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Pública */}
        <Route path="/login" element={<Login />} />

        {/* Privadas: primero RutaProtegida (¿hay sesión?), luego Layout (sidebar) */}
        <Route element={<RutaProtegida />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Panel />} />
            <Route path="/por-revisar" element={<PorRevisar />} />
            <Route path="/reportes" element={<Reportes />} />
          </Route>
        </Route>

        {/* Cualquier otra URL -> al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);