import React, { useState, useEffect } from "react";
import { 
  obtenerClientes, 
  crearCliente, 
  actualizarCliente, 
  eliminarCliente 
} from "../services/api";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false); // 1. Estado de carga agregado

  // Cargar clientes al montar el componente
  const cargarClientes = async () => {
    try {
      const r = await obtenerClientes();
      if (r.ok) {
        setClientes(r.datos);
      } else {
        setClientes([]);
        setMensaje("Error al obtener la lista de clientes.");
      }
    } catch (error) {
      setClientes([]);
      setMensaje("Error de conexión con el servidor.");
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  // Guardar (Crear o Editar)
  const guardar = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setMensaje("El nombre es obligatorio");
      return;
    }

    setCargando(true); // Desactiva botón
    setMensaje("");

    try {
      const r = editandoId
        ? await actualizarCliente(editandoId, { nombre })
        : await crearCliente({ nombre });

      if (r.ok) {
        setMensaje(r.datos?.message || "Solicitud procesada");
        setNombre("");
        setEditandoId(null);
        await cargarClientes();
      } else {
        setMensaje(r.datos?.message || "No se pudo guardar el cliente");
      }
    } catch (error) {
      setMensaje("Error de conexión al guardar.");
    } finally {
      setCargando(false); // Reactiva botón
    }
  };

  // Preparar formulario para edición
  const prepararEdicion = (cliente) => {
    setEditandoId(cliente.id);
    setNombre(cliente.nombre);
    setMensaje("");
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setEditandoId(null);
    setNombre("");
    setMensaje("");
  };

  // Eliminar cliente
  const borrar = async (id) => {
    if (!window.confirm("¿Eliminar este cliente de prueba?")) return;
    
    try {
      const r = await eliminarCliente(id);
      if (r.ok) {
        setMensaje(r.datos?.message || "Cliente eliminado");
        await cargarClientes();
      } else {
        setMensaje("Error al eliminar el cliente.");
      }
    } catch (error) {
      setMensaje("Error de conexión al eliminar.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>CRUD de Clientes</h2>

      {mensaje && (
        <p style={{ padding: "8px", backgroundColor: "#f0f0f0", borderRadius: "4px" }}>
          {mensaje}
        </p>
      )}

      {/* Formulario de Registro/Edición */}
      <form onSubmit={guardar} style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Nombre del cliente"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          disabled={cargando}
          style={{ flex: "1", padding: "8px" }}
        />
        <button type="submit" disabled={cargando} style={{ padding: "8px 16px" }}>
          {cargando ? "Guardando..." : editandoId ? "Actualizar" : "Agregar"}
        </button>
        {editandoId && (
          <button type="button" onClick={cancelarEdicion} disabled={cargando} style={{ padding: "8px 16px" }}>
            Cancelar
          </button>
        )}
      </form>

      {/* Lista de Clientes */}
      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(clientes) && clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.id}</td>
              <td>{cliente.nombre}</td>
              <td>
                <button onClick={() => prepararEdicion(cliente)} style={{ marginRight: "5px" }}>
                  Editar
                </button>
                <button onClick={() => borrar(cliente.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {(!clientes || clientes.length === 0) && (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>No hay clientes registrados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}