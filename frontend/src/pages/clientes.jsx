import { useEffect, useState } from "react";
import { obtenerClientes } from "../services/api";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const resultado = await obtenerClientes();
      if (resultado.ok && resultado.datos.success) {
        setClientes(resultado.datos.clientes);
      } else {
        setMensaje("No se pudieron obtener los clientes");
      }
    } catch (error) {
      setMensaje("Error al conectar con el servidor");
    }
  };

  return (
    <div className="dashboard">
      <h1>Clientes</h1>
      {mensaje && <p className="error">{mensaje}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.id}</td>
              <td>{cliente.nombre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Clientes;