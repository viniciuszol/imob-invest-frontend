import { createContext, useContext, useState, useEffect } from "react";
import {
  getEmpresas,
  createEmpresa,
  updateEmpresa,
  deleteEmpresa,
  importarEmpresa as importarEmpresaApi,
  refreshEmpresa,
  refreshEmpresas,
  importarDadosEmpresa,
} from "../api/empresa";
import { useAuth } from "./AuthContext";

const EmpresaContext = createContext();

export const EmpresaProvider = ({ children }) => {
  const { token, user } = useAuth();

  const storageKey = user ? `empresa_ativa_id_${user.id}` : null;

  const [empresas, setEmpresas] = useState([]);

  const [empresaAtiva, setEmpresaAtiva] = useState(null);
  useEffect(() => {
    if (!user || empresas.length === 0) return;

    // 🔒 se já existe empresa ativa em memória, NÃO reidrata
    if (empresaAtiva) return;

    const savedId = localStorage.getItem(`empresa_ativa_id_${user.id}`);
    if (!savedId) return;

    const empresa = empresas.find(e => e.id === Number(savedId));
    if (empresa) {
      setEmpresaAtiva(empresa);
    }
  }, [user, empresas, empresaAtiva]);

  // -----------------------
  // PERSISTÊNCIA DA EMPRESA ATIVA
  // -----------------------
  useEffect(() => {
    if (!storageKey || !user) return;

    if (empresaAtiva) {
      // 🔒 escopo por usuário
      localStorage.setItem(storageKey, String(empresaAtiva.id));

      localStorage.setItem(
        "empresa_ativa",
        JSON.stringify({
          id: empresaAtiva.id,
          nome: empresaAtiva.nome,
          userId: user.id, // 🔥 ISSO resolve o problema
        })
      );
    } else {
      localStorage.removeItem(storageKey);
      localStorage.removeItem("empresa_ativa");
    }
  }, [empresaAtiva, storageKey, user]);



  useEffect(() => {
    if (!user || empresas.length === 0) return;

    const savedId = localStorage.getItem(`empresa_ativa_id_${user.id}`);
    if (!savedId) return;

    const empresa = empresas.find(e => e.id === Number(savedId));
    if (empresa) setEmpresaAtiva(empresa);
  }, [user, empresas]);


  // -----------------------
  // CARREGAR EMPRESAS (ADMIN)
  // -----------------------
  const carregarEmpresas = async () => {
    try {
      const data = await getEmpresas();
      setEmpresas(data);
    } catch (err) {
      console.error("Erro ao carregar empresas:", err);
    }
  };

  useEffect(() => {
    if (token) carregarEmpresas();
  }, [token]);

  // -----------------------
  // CRUD ADMINISTRATIVO
  // -----------------------
  const criar = async (empresa) => {
    const nova = await createEmpresa(empresa);
    setEmpresas((prev) => [...prev, nova]);
  };

  const editar = async (id, empresa) => {
    const atualizada = await updateEmpresa(id, empresa);
    setEmpresas((prev) =>
      prev.map((e) => (e.id === id ? atualizada : e))
    );

    if (empresaAtiva?.id === id) {
      setEmpresaAtiva(atualizada);
    }
  };

  const remover = async (id) => {
    await deleteEmpresa(id);
    setEmpresas((prev) => prev.filter((e) => e.id !== id));

    if (empresaAtiva?.id === id) {
      setEmpresaAtiva(null);
    }
  };

  // -----------------------
  // IMPORTAÇÃO VIA NIBO (CRIAR EMPRESA)
  // -----------------------
  const importarViaNibo = async (tokenNibo) => {
    const data = await importarEmpresaApi(tokenNibo);
    const empresa = data.empresa ?? data;

    setEmpresas((prev) => {
      const exists = prev.find((e) => e.id === empresa.id);
      if (exists) {
        return prev.map((p) => (p.id === empresa.id ? empresa : p));
      }
      return [...prev, empresa];
    });

    return data;
  };

  const refreshTodas = async () => {
    const data = await refreshEmpresas();

    setEmpresas((prev) =>
      prev.map((empresa) => {
        const atualizada = data.find((e) => e.id === empresa.id);
        return atualizada
          ? { ...empresa, ...atualizada }
          : empresa;
      })
    );

    return data;
  };

  const refreshPorEmpresa = async (empresaId) => {
    const empresaAtualizada = await refreshEmpresa(empresaId);

    setEmpresas((prev) =>
      prev.map((e) =>
        e.id === empresaId
          ? { ...e, ...empresaAtualizada } // 👈 MERGE, NÃO overwrite
          : e
      )
    );

    if (empresaAtiva?.id === empresaId) {
      setEmpresaAtiva((prev) => ({
        ...prev,
        ...empresaAtualizada,
      }));
    }

    return empresaAtualizada;
  };

  const importarDados = async (empresaId, niboToken) => {
    await importarDadosEmpresa(empresaId, niboToken);
    await carregarEmpresas();
  };


  return (
    <EmpresaContext.Provider
      value={{
        // admin
        empresas,
        carregarEmpresas,
        criar,
        editar,
        remover,
        importarViaNibo,
        refreshTodas,
        refreshPorEmpresa,
        importarDados,

        // operacional
        empresaAtiva,
        setEmpresaAtiva,
      }}
    >
      {children}
    </EmpresaContext.Provider>
  );
};

export const useEmpresa = () => useContext(EmpresaContext);
