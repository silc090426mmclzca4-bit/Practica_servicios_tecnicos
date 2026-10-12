import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RutaProtegida from "./components/RutaProtegida";
import Clientes from "./pages/Clientes"; 
import Tecnicos from "./pages/Tecnicos";
import Servicios from "./pages/Servicios"; // <--- 1. Importar Servicios
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      
      <Route
        path="/dashboard"
        element={
          <RutaProtegida>
            <Dashboard />
          </RutaProtegida>
        }
      />
      
      <Route
        path="/clientes"
        element={
          <RutaProtegida>
            <Clientes />
          </RutaProtegida>
        }
      />
      
      {/* 2. Envolver Técnicos dentro de RutaProtegida */}
      <Route
        path="/tecnicos"
        element={
          <RutaProtegida>
            <Tecnicos />
          </RutaProtegida>
        }
      />

      {/* 3. Agregar la ruta protegida de Servicios */}
      <Route
        path="/servicios"
        element={
          <RutaProtegida>
            <Servicios />
          </RutaProtegida>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;