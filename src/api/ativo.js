import api from "./api";

export const getAtivos = async () => {
  const res = await api.get("/ativos/");
  return res.data;
};

export const createAtivo = async (ativo) => {
  const res = await api.post("/ativos/", ativo);
  return res.data;
};

export const updateAtivo = async (id, ativo) => {
  const res = await api.put(`/ativos/${id}`, ativo);
  return res.data;
};

export const deleteAtivo = async (id) => {
  const res = await api.delete(`/ativos/${id}`);
  return res.data;
};
