import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  // JWT
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Empresa ativa (opcional)
  const rawEmpresa = localStorage.getItem("empresa_ativa");
  if (rawEmpresa) {
    try {
      const empresa = JSON.parse(rawEmpresa);
      if (empresa?.id) {
        config.headers["X-Empresa-Id"] = empresa.id;
      }
    } catch {
      // ignora JSON inválido
    }
  }

  return config;
});

export default api;
