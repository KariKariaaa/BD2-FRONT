import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';

import InicioLayout from './InicioLayout';
import Login from './Login'
import InicioEstudiantes from './InicioEstudiantes';
import InicioUsuarios from './InicioUsuarios';
import InicioReportes from './Reportes';
import InicioRecuperar from './RecuperarContra';

function App() {
  return (
    <Routes>    
      <Route path="/" element={<Login />} />

      <Route path="/contra" element={<InicioRecuperar />} />

      <Route path="/inicio/*" element={<InicioLayout />}>
        <Route path="estudiantes" element={<InicioEstudiantes />} />
        <Route path="usuarios" element={<InicioUsuarios />} />
        <Route path="reportes" element={<InicioReportes />} />
      </Route>
    </Routes>
  )
}

export default App
