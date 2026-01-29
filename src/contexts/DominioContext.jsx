import { createContext, useContext, useState, useEffect } from "react";
import {
  getTodosDominios,
  criarDominio,
  atualizarDominio,
  inativarDominio
} from "../api/dominio";

const DominioContext = createContext();

export const DominioProvider = ({ children }) => {
  const [dominios, setDominios] = useState({});
  const [tipoSelecionado, setTipoSelecionado] = useState("status-ativo");

  const carregarDominios = async () => {
    const data = await getTodosDominios();
    setDominios(data);
  };

  const adicionarDominio = async (tipo, data) => {
    await criarDominio(tipo, data);
    await carregarDominios();
  };

  const editarDominio = async (tipo, id, data) => {
    await atualizarDominio(tipo, id, data);
    await carregarDominios();
  };

  const removerDominio = async (tipo, id) => {
    await inativarDominio(tipo, id);
    await carregarDominios();
  };

  

  useEffect(() => {
    carregarDominios();
  }, []);

  return (
    <DominioContext.Provider value={{
      dominios,
      tipoSelecionado,
      setTipoSelecionado,
      adicionarDominio,
      editarDominio,
      removerDominio
    }}>
      {children}
    </DominioContext.Provider>
  );
};

export const useDominio = () => useContext(DominioContext);
