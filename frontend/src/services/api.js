const BASE_URL = "http://127.0.0.1:5000/api";

// --- LOGIN ---
export async function login(username, password) {
  const r = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  return { ok: r.ok, datos: await r.json() };
}

// --- CLIENTES ---
export async function obtenerClientes() {
  const r = await fetch(`${BASE_URL}/clientes`);
  return { ok: r.ok, datos: await r.json() };
}

export async function crearCliente(cliente) {
  const r = await fetch(`${BASE_URL}/clientes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cliente)
  });
  return { ok: r.ok, datos: await r.json() };
}

export async function actualizarCliente(id, cliente) {
  const r = await fetch(`${BASE_URL}/clientes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cliente)
  });
  return { ok: r.ok, datos: await r.json() };
}

export async function eliminarCliente(id) {
  const r = await fetch(`${BASE_URL}/clientes/${id}`, { method: "DELETE" });
  return { ok: r.ok, datos: await r.json() };
}

// --- TÉCNICOS ---
export async function obtenerTecnicos() {
  const r = await fetch(`${BASE_URL}/tecnicos`);
  return { ok: r.ok, datos: await r.json() };
}

export async function crearTecnico(tecnico) {
  const r = await fetch(`${BASE_URL}/tecnicos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tecnico)
  });
  return { ok: r.ok, datos: await r.json() };
}

export async function actualizarTecnico(id, tecnico) {
  const r = await fetch(`${BASE_URL}/tecnicos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tecnico)
  });
  return { ok: r.ok, datos: await r.json() };
}

export async function eliminarTecnico(id) {
  const r = await fetch(`${BASE_URL}/tecnicos/${id}`, { method: "DELETE" });
  return { ok: r.ok, datos: await r.json() };
}

// --- SERVICIOS ---
export async function obtenerServicios() {
  const r = await fetch(`${BASE_URL}/servicios`);
  return { ok: r.ok, datos: await r.json() };
}

export async function crearServicio(servicio) {
  const r = await fetch(`${BASE_URL}/servicios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(servicio)
  });
  return { ok: r.ok, datos: await r.json() };
}

export async function actualizarServicio(id, servicio) {
  const r = await fetch(`${BASE_URL}/servicios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(servicio)
  });
  return { ok: r.ok, datos: await r.json() };
}

export async function eliminarServicio(id) {
  const r = await fetch(`${BASE_URL}/servicios/${id}`, { method: "DELETE" });
  return { ok: r.ok, datos: await r.json() };
}