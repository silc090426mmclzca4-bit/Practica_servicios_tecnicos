const API_URL = "http://127.0.0.1:5000/api/clientes";

// 0. Función de Login (para que Login.jsx no marque error)
export async function login(username, password) {
  const r = await fetch("http://127.0.0.1:5000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({username, password })
  });
  return { ok: r.ok, datos: await r.json() };
}

// 1. Obtener todos los clientes (GET)
export async function obtenerClientes() {
  const r = await fetch(API_URL);
  if (!r.ok) return [];
  return await r.json();
}

// 2. Crear cliente (POST)
export async function crearCliente(cliente) {
  const r = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cliente)
  });
  return { ok: r.ok, datos: await r.json() };
}

// 3. Actualizar cliente (PUT)
export async function actualizarCliente(id, cliente) {
  const r = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cliente)
  });
  return { ok: r.ok, datos: await r.json() };
}

// 4. Eliminar cliente (DELETE)
export async function eliminarCliente(id) {
  const r = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  return { ok: r.ok, datos: await r.json() };
}