import api from "./api";

export const getTodosDominios = async () => {
  const res = await api.get("/dominios/");
  return res.data;
};

export const criarDominio = async (tipo, data) => {
  const res = await api.post(`/dominio/${tipo}`, data);
  return res.data;
};

export const atualizarDominio = async (tipo, id, data) => {
  const res = await api.put(`/dominio/${tipo}/${id}`, data);
  return res.data;
};

export const inativarDominio = async (tipo, id) => {
  const res = await api.delete(`/dominio/${tipo}/${id}`);
  return res.data;
};
