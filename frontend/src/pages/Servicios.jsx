import React, { useState, useEffect } from 'react';
import { 
  obtenerServicios, 
  crearServicio, 
  actualizarServicio, 
  eliminarServicio,
  obtenerClientes,
  obtenerTecnicos 
} from '../services/api';

export default function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);

  // Estado del formulario
  const [formData, setFormData] = useState({
    cliente_id: '',
    tecnico_id: '',
    descripcion: '',
    estado: 'Pendiente',
    fecha: ''
  });

  const [editId, setEditId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  // 1. Cargar servicios y catálogos al montar el componente
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [resServ, resCli, resTec] = await Promise.all([
        obtenerServicios(),
        obtenerClientes(),
        obtenerTecnicos()
      ]);

      if (resServ.ok) {
        setServicios(Array.isArray(resServ.datos) ? resServ.datos : resServ.datos?.servicios || []);
      }
      if (resCli.ok) {
        setClientes(Array.isArray(resCli.datos) ? resCli.datos : resCli.datos?.clientes || []);
      }
      if (resTec.ok) {
        setTecnicos(Array.isArray(resTec.datos) ? resTec.datos : resTec.datos?.tecnicos || []);
      }
    } catch (err) {
      setMensaje('Error de conexión al cargar catálogos y servicios.');
    }
  };

  // Manejador de inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Crear o Actualizar (POST / PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.cliente_id || !formData.tecnico_id || !formData.descripcion.trim() || !formData.estado || !formData.fecha) {
      setMensaje('Completa todos los campos obligatorios.');
      return;
    }

    setCargando(true);
    setMensaje('');

    try {
      const r = editId 
        ? await actualizarServicio(editId, formData)
        : await crearServicio(formData);

      if (r.ok) {
        setMensaje(r.datos?.message || (editId ? 'Servicio actualizado correctamente' : 'Servicio registrado correctamente'));
        limpiarFormulario();
        await cargarDatos();
      } else {
        setMensaje(r.datos?.message || 'Error al procesar el servicio');
      }
    } catch (err) {
      setMensaje('Error de conexión al guardar el servicio.');
    } finally {
      setCargando(false);
    }
  };

  // 3. Eliminar (DELETE)
  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este servicio?')) return;

    try {
      const r = await eliminarServicio(id);
      if (r.ok) {
        setMensaje(r.datos?.message || 'Servicio eliminado correctamente');
        await cargarDatos();
      } else {
        setMensaje('Error al eliminar el servicio.');
      }
    } catch (err) {
      setMensaje('Error de conexión al eliminar.');
    }
  };

  // Cargar datos en el formulario para editar
  const handleEdit = (servicio) => {
    setEditId(servicio.id);
    setFormData({
      cliente_id: servicio.cliente_id || '',
      tecnico_id: servicio.tecnico_id || '',
      descripcion: servicio.descripcion || '',
      estado: servicio.estado || 'Pendiente',
      fecha: servicio.fecha ? servicio.fecha.split('T')[0] : ''
    });
    setMensaje('');
  };

  const limpiarFormulario = () => {
    setEditId(null);
    setFormData({ cliente_id: '', tecnico_id: '', descripcion: '', estado: 'Pendiente', fecha: '' });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2>Gestión de Servicios</h2>

      {mensaje && (
        <p style={{ padding: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          {mensaje}
        </p>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <select name="cliente_id" value={formData.cliente_id} onChange={handleChange} disabled={cargando} required style={{ padding: '8px' }}>
          <option value="">-- Seleccionar Cliente --</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>

        <select name="tecnico_id" value={formData.tecnico_id} onChange={handleChange} disabled={cargando} required style={{ padding: '8px' }}>
          <option value="">-- Seleccionar Técnico --</option>
          {tecnicos.map((t) => (
            <option key={t.id} value={t.id}>{t.nombre}</option>
          ))}
        </select>

        <input
          type="text"
          name="descripcion"
          placeholder="Descripción del servicio"
          value={formData.descripcion}
          onChange={handleChange}
          disabled={cargando}
          required
          style={{ padding: '8px', flex: '1' }}
        />

        <select name="estado" value={formData.estado} onChange={handleChange} disabled={cargando} style={{ padding: '8px' }}>
          <option value="Pendiente">Pendiente</option>
          <option value="En Proceso">En Proceso</option>
          <option value="Completado">Completado</option>
        </select>

        <input
          type="date"
          name="fecha"
          value={formData.fecha}
          onChange={handleChange}
          disabled={cargando}
          required
          style={{ padding: '8px' }}
        />

        <button type="submit" disabled={cargando} style={{ padding: '8px 16px' }}>
          {cargando ? 'Guardando...' : editId ? 'Actualizar' : 'Guardar'}
        </button>
        {editId && (
          <button type="button" onClick={limpiarFormulario} disabled={cargando} style={{ padding: '8px 16px' }}>
            Cancelar
          </button>
        )}
      </form>

      {/* Tabla de Resultados */}
      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Técnico</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {!servicios || servicios.length === 0 ? (
            <tr><td colSpan="7" style={{ textAlign: 'center' }}>No hay servicios registrados.</td></tr>
          ) : (
            servicios.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.cliente_nombre || s.cliente_id}</td>
                <td>{s.tecnico_nombre || s.tecnico_id}</td>
                <td>{s.descripcion}</td>
                <td>{s.estado}</td>
                <td>{s.fecha}</td>
                <td>
                  <button onClick={() => handleEdit(s)} style={{ marginRight: '5px' }}>Editar</button>
                  <button onClick={() => handleDelete(s.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}