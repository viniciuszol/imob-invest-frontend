import api from "./api";

export async function getMe() {
  try {
    const res = await api.get("/usuarios/me");
    return res.data;
  } catch (err) {
    const msg =
      err.response?.data?.detail ||
      err.response?.data ||
      "Erro ao buscar usuário";

    throw new Error(msg);
  }
}

export async function updateMe(data) {
  try {
    const res = await api.put("/usuarios/me", data);
    return res.data;
  } catch (err) {
    const msg =
      err.response?.data?.detail ||
      err.response?.data ||
      "Erro ao atualizar usuário";

    throw new Error(msg);
  }
}
