import api from "./api";

const investimentosAPI = {
  overview: (filters) =>
    api.get("/investimentos/overview", { params: filters }),

  ativos: () => api.get("/investimentos/ativos"),

  comparativo: (ativoId) =>
    api.get(`/investimentos/comparativo/${ativoId}`),

  evolucaoCDI: () => api.get("/investimentos/evolucao-cdi"),

  realDoAtivo: (ativoId) =>
    api.get(`/investimentos/real/${ativoId}`),

  investimentoPorAtivo: (ativoId) =>
    api.get(`/investimentos/ativo/${ativoId}`),
};

export default investimentosAPI;
