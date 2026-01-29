import { createContext, useContext, useState } from "react";
import investimentosAPI from "../api/investimentos";

const InvestimentosContext = createContext();

export function InvestimentosProvider({ children }) {
  const [overview, setOverview] = useState(null);
  const [ativos, setAtivos] = useState([]);

  const carregarAtivos = async () => {
    const res = await investimentosAPI.ativos();
    setAtivos(res.data);
  };

  const carregarOverview = async (filters) => {
    const res = await investimentosAPI.overview(filters);
    setOverview(res.data);
  };

  return (
    <InvestimentosContext.Provider
      value={{
        overview,
        ativos,
        carregarOverview,
        carregarAtivos
      }}
    >
      {children}
    </InvestimentosContext.Provider>
  );
}

export const useInvestimentos = () => useContext(InvestimentosContext);
