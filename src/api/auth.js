import api from "./api";

export async function loginRequest(email, password) {
  try {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    return res.data;
  } catch (err) {
    const msg =
      err.response?.data?.detail ||
      err.response?.data ||
      "Erro durante login";

    throw new Error(msg);
  }
}

export async function registerRequest(nome, email, password) {
  try {
    const res = await api.post("/auth/register", {
      nome,
      email,
      password,
    });

    return res.data;
  } catch (err) {
    const msg =
      err.response?.data?.detail ||
      err.response?.data ||
      "Erro ao registrar";

    throw new Error(msg);
  }
}
