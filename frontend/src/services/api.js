const API_URL = "http://127.0.0.1:5000";

export async function login(username, password) {
  const respuesta = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const datos = await respuesta.json();

  return {
    ok: respuesta.ok,
    status: respuesta.status,
    datos,
  };
}

export async function obtenerClientes() {
  const respuesta = await fetch("http://127.0.0.1:5000/api/clientes");
  const datos = await respuesta.json();
  return { ok: respuesta.ok, status: respuesta.status, datos };
}