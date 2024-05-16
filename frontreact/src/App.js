import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InicioSesion from './inicio-sesion';
import Inicio from './inicio';
import Registro from './registro';
import GestionUsuarios from './GestionUsuarios';
import GestionEntradasAdmin from './GestionEntradasAdmin';
import GestionEntradasUsuario from './GestionEntradasUsuario';
import RecuperarContrasena from './RecuperarContrasena';
import RestablecerContrasena from './RestablecerContrasena';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route exact path="/inicio-sesion" element={<InicioSesion />} />
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/registro" element={<Registro />} /> {/* Ruta para el registro */}
            <Route path="/gestion-usuarios" element={<GestionUsuarios />} /> {/* Ruta para el GestionUsuarios */}
            <Route path="/gestion-entradas-admin" element={<GestionEntradasAdmin />} /> {/* Ruta para el GestionEntradasAdmin */}
            <Route path="/gestionar-entradas" element={<GestionEntradasUsuario />} /> {/* Ruta para el GestionEntradasUsuario */}
            <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} /> {/* Ruta para el RecuperarContrasena */}
            <Route path="/restablecer-contrasena" element={<RestablecerContrasena />} /> {/* Ruta para el RestablecerContrasena */}
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
