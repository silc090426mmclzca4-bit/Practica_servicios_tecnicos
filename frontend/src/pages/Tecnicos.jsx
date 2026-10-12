import { useEffect, useState } from "react";
import {
  obtenerTecnicos, 
  crearTecnico,
  actualizarTecnico, 
  eliminarTecnico
} from "../services/api";

function Tecnicos() {
  const [tecnicos, setTecnicos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  // Cargar técnicos con try/catch
  const cargarTecnicos = async () => {
    try {
      const r = await obtenerTecnicos();
      if (r.ok) {
        const lista = Array.isArray(r.datos) ? r.datos : (r.datos?.tecnicos || []);
        setTecnicos(lista);
      } else {
        setTecnicos([]);
        setMensaje(r.datos?.message || "Error al cargar técnicos");
      }
    } catch (error) {
      setTecnicos([]);
      setMensaje("Error de conexión al cargar técnicos.");
    }
  };

  useEffect(() => { 
    cargarTecnicos(); 
  }, []);

  // Guardar (Crear o Editar)
  const guardar = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !especialidad.trim()) {
      setMensaje("Todos los campos son obligatorios");
      return;
    }

    setCargando(true);
    setMensaje("");

    try {
      const datos = { nombre, especialidad };
      const r = editandoId
        ? await actualizarTecnico(editandoId, datos)
        : await crearTecnico(datos);
      
      setMensaje(r.datos?.message || "Operación realizada correctamente");
      if (r.ok) {
        setNombre(""); 
        setEspecialidad(""); 
        setEditandoId(null);
        await cargarTecnicos();
      }
    } catch (error) {
      setMensaje("Error de conexión al guardar el técnico.");
    } finally {
      setCargando(false);
    }
  };

  const editar = (tecnico) => {
    setEditandoId(tecnico.id);
    setNombre(tecnico.nombre);
    setEspecialidad(tecnico.especialidad);
    setMensaje("");
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setNombre("");
    setEspecialidad("");
    setMensaje("");
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Deseas eliminar este técnico?")) return;

    try {
      const r = await eliminarTecnico(id);
      setMensaje(r.datos?.message || "Técnico eliminado");
      if (r.ok) await cargarTecnicos();
    } catch (error) {
      setMensaje("Error de conexión al eliminar el técnico.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
      <h2>Módulo de Técnicos</h2>

      {mensaje && (
        <p style={{ padding: "8px", backgroundColor: "#f0f0f0", borderRadius: "4px" }}>
          {mensaje}
        </p>
      )}

      {/* Formulario */}
      <form onSubmit={guardar} style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input 
          value={nombre} 
          onChange={e => setNombre(e.target.value)} 
          placeholder="Nombre del técnico" 
          disabled={cargando}
          style={{ flex: "1", padding: "8px" }}
        />
        <input 
          value={especialidad} 
          onChange={e => setEspecialidad(e.target.value)} 
          placeholder="Especialidad" 
          disabled={cargando}
          style={{ flex: "1", padding: "8px" }}
        />
        <button type="submit" disabled={cargando} style={{ padding: "8px 16px" }}>
          {cargando ? "Guardando..." : editandoId ? "Actualizar" : "Registrar"}
        </button>
        {editandoId && (
          <button type="button" onClick={cancelarEdicion} disabled={cargando} style={{ padding: "8px 16px" }}>
            Cancelar
          </button>
        )}
      </form>

      {/* Tabla */}
      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Especialidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(tecnicos) && tecnicos.map(tecnico => (
            <tr key={tecnico.id}>
              <td>{tecnico.id}</td>
              <td>{tecnico.nombre}</td>
              <td>{tecnico.especialidad}</td>
              <td>
                <button onClick={() => editar(tecnico)} style={{ marginRight: "5px" }}>
                  Editar
                </button>
                <button onClick={() => eliminar(tecnico.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {(!tecnicos || tecnicos.length === 0) && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>No hay técnicos registrados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Tecnicos;