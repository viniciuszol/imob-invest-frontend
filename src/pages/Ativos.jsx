import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Plus,
  X,
  Eye,
  Pause,
  Play,
  ChevronDown,
  Search,
  ArrowUp,
  ArrowDown,
  Layers
} from "lucide-react";

import { useAtivo } from "../contexts/AtivoContext";
import { useEmpresa } from "../contexts/EmpresaContext";
import AtivoFicha from "../components/AtivoFicha";
import Navbar from "../components/Navbar";
import api from "../api/api";

export default function Ativos() {
  const navigate = useNavigate();

  const { empresaAtiva, setEmpresaAtiva, empresas } = useEmpresa();

  const {
    ativos,
    removerAtivo,
    carregarAtivos,
    adicionarAtivo,
    editarAtivo
  } = useAtivo();

  const [viewAtivo, setViewAtivo] = useState(null);
  const [editAtivo, setEditAtivo] = useState(null);

  const [filtroAtivo, setFiltroAtivo] = useState("ativos");
  const [search, setSearch] = useState("");

  const [ordenacao, setOrdenacao] = useState({
    campo: null,
    direcao: "asc"
  });

  const [statusList, setStatusList] = useState([]);
  const [tipoList, setTipoList] = useState([]);

  const modalOpen = Boolean(viewAtivo || editAtivo);
  useEffect(() => {
    if (!modalOpen) return;

    const scrollY = window.scrollY;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.paddingRight = "";

      window.scrollTo(0, scrollY);
    };
  }, [modalOpen]);

  const carregarDominios = async () => {
    const [statusRes, tipoRes] = await Promise.all([
      api.get("/dominio/status-ativo"),
      api.get("/dominio/tipos-ativo")
    ]);
    setStatusList(statusRes.data);
    setTipoList(tipoRes.data);
  };

  useEffect(() => {
    if (!empresaAtiva) return;
    carregarDominios();
  }, [empresaAtiva]);


  const statusMap = useMemo(() => {
    const map = {};
    statusList.forEach(s => (map[s.id] = s.nome));
    return map;
  }, [statusList]);

  const tipoMap = useMemo(() => {
    const map = {};
    tipoList.forEach(t => (map[t.id] = t.nome));
    return map;
  }, [tipoList]);

  const toggleOrdenacao = (campo) => {
    setOrdenacao(prev => ({
      campo,
      direcao:
        prev.campo === campo && prev.direcao === "asc"
          ? "desc"
          : "asc"
    }));
  };

  const Arrow = ({ campo }) => (
    <span className="w-4 flex justify-center">
      {ordenacao.campo === campo ? (
        ordenacao.direcao === "asc" ? (
          <ArrowUp size={14} />
        ) : (
          <ArrowDown size={14} />
        )
      ) : (
        <span className="opacity-0">
          <ArrowUp size={14} />
        </span>
      )}
    </span>
  );

  const formatBRL = (value) =>
    typeof value === "number"
      ? `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
      : "—";

  const ativosDaEmpresa = useMemo(() => {
    return ativos;
  }, [ativos]);


  const ativosFiltrados = [...ativosDaEmpresa]
    .filter(a => {
      if (filtroAtivo === "ativos") return a.ativo === true;
      if (filtroAtivo === "inativos") return a.ativo === false;
      return true;
    })
    .filter(a =>
      a.nome?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (!ordenacao.campo) return 0;

      const valA = a[ordenacao.campo];
      const valB = b[ordenacao.campo];

      if (typeof valA === "string" && typeof valB === "string") {
        return ordenacao.direcao === "asc"
          ? valA.localeCompare(valB, "pt-BR", { sensitivity: "base" })
          : valB.localeCompare(valA, "pt-BR", { sensitivity: "base" });
      }

      return ordenacao.direcao === "asc"
        ? (valA ?? 0) - (valB ?? 0)
        : (valB ?? 0) - (valA ?? 0);
    });

  const actionBtn =
    "w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 transition hover:bg-gray-800";

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      {/* GRADIENTE FIXO NA TELA */}
      <div className="fixed inset-0 bg-gradient-to-b from-gray-900 to-black -z-10" />

      <div className="flex flex-col items-center">

        <main className="px-8 py-10 w-full max-w-7xl">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-semibold flex items-center gap-3">
              <Home size={28} className="text-blue-500" /> Seus Ativos
            </h2>

            {/* FILTROS + DOMÍNIOS */}
            <div className="flex items-center gap-3">

              {/* BOTÃO DOMÍNIOS */}
              <button
                onClick={() => navigate("/dominio/status-ativo")}
                className="flex items-center gap-2 bg-gray-800 border border-gray-700 px-4 py-2 rounded-xl text-sm hover:bg-gray-700 transition"
                title="Gerenciar domínios"
              >
                <Layers size={16} />
                Domínios
              </button>

              {/* SELECT EMPRESA */}
              <div className="relative w-48">
                <select
                  value={empresaAtiva?.id ?? ""}
                  onChange={(e) => {
                    const empresa = empresas.find(emp => emp.id === Number(e.target.value));
                    setEmpresaAtiva(empresa ?? null);
                  }}
                  className="appearance-none bg-gray-800 border border-gray-700 rounded-xl
               px-3 py-2 pr-9 text-sm max-w-full truncate"
                  title={empresaAtiva?.nome ?? "Selecionar empresa"}
                >

                  <option value="">Selecionar empresa</option>

                  {empresas.map((e) => (
                    <option key={e.id} value={e.id} title={e.nome}>
                      {e.nome.length > 40 ? `${e.nome.slice(0, 40)}...` : e.nome}
                    </option>

                  ))}
                </select>

                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              {/* FILTRO ATIVOS */}
              <div className="relative">
                <select
                  value={filtroAtivo}
                  onChange={(e) => setFiltroAtivo(e.target.value)}
                  className="appearance-none bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 pr-10 text-sm"
                >
                  <option value="ativos">Somente ativos</option>
                  <option value="inativos">Somente inativos</option>
                  <option value="todos">Ativos e inativos</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              {/* SEARCH */}
              <div className="relative w-64">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Pesquisar ativo..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-4 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* TABELA */}
          {!empresaAtiva && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
              <Layers size={48} />
              <p className="text-lg">
                Selecione uma empresa para visualizar os ativos
              </p>
            </div>
          )}

          {empresaAtiva && (
            <div className="overflow-x-auto bg-gray-900/50 p-4 rounded-2xl shadow-lg border border-gray-800 mb-10">
              <table className="min-w-full text-left text-gray-300">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th onClick={() => toggleOrdenacao("nome")} className="py-2 px-2 cursor-pointer w-[30%]">
                      <div className="inline-flex items-center gap-1">
                        Nome <Arrow campo="nome" />
                      </div>
                    </th>
                    <th className="py-2 px-2">Status</th>
                    <th className="py-2 px-2">Tipo</th>
                    <th onClick={() => toggleOrdenacao("valor_compra")} className="py-2 px-2 text-right cursor-pointer w-[12%]">
                      <div className="inline-flex items-center gap-1 justify-end">
                        Compra <Arrow campo="valor_compra" />
                      </div>
                    </th>
                    <th onClick={() => toggleOrdenacao("receitas")} className="py-2 px-2 text-right cursor-pointer">
                      <div className="inline-flex items-center gap-1 justify-end">
                        Receitas <Arrow campo="receitas" />
                      </div>
                    </th>
                    <th onClick={() => toggleOrdenacao("despesas")} className="py-2 px-2 text-right cursor-pointer">
                      <div className="inline-flex items-center gap-1 justify-end">
                        Despesas <Arrow campo="despesas" />
                      </div>
                    </th>
                    <th onClick={() => toggleOrdenacao("total")} className="py-2 px-2 text-right cursor-pointer">
                      <div className="inline-flex items-center gap-1 justify-end">
                        Total <Arrow campo="total" />
                      </div>
                    </th>
                    <th className="py-2 px-2 text-center">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {ativosFiltrados.map(a => (
                    <tr key={a.id} className={`border-b border-gray-800 ${a.ativo === false ? "opacity-50" : ""}`}>
                      <td className="py-2 px-2 truncate max-w-[260px]">{a.nome}</td>
                      <td className="py-2 px-2 truncate max-w-[260px]">{statusMap[a.status_id] ?? "—"}</td>
                      <td className="py-2 px-2 truncate max-w-[260px]">{tipoMap[a.tipo_id] ?? "—"}</td>
                      <td className="py-2 px-2 text-right truncate max-w-[260px]">{formatBRL(a.valor_compra)}</td>
                      <td className="py-2 px-2 text-right truncate max-w-[260px]">{formatBRL(a.receitas)}</td>
                      <td className="py-2 px-2 text-right truncate max-w-[260px]">{formatBRL(a.despesas)}</td>
                      <td className="py-2 px-2 text-right truncate max-w-[260px]">{formatBRL(a.total)}</td>
                      <td className="py-2 px-2">
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={() => setViewAtivo(a)}
                            className={`${actionBtn} hover:text-blue-500`}
                          >
                            <Eye size={16} />
                          </button>

                          {a.ativo !== false ? (
                            <button
                              onClick={() => removerAtivo(a.id)}
                              className={`${actionBtn} hover:text-yellow-500`}
                            >
                              <Pause size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => editarAtivo(a.id, { ativo: true })}
                              className={`${actionBtn} hover:text-green-500`}
                            >
                              <Play size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </main>
      </div>


      {viewAtivo && (
        <Modal title={`ATIVO: ${viewAtivo.nome}`} onClose={() => setViewAtivo(null)}>
          <AtivoFicha
            ativo={viewAtivo}
            readOnly
            onEdit={(ativo) => {
              setViewAtivo(null);
              setEditAtivo(ativo);
            }}
            empresas={empresas}
          />
        </Modal>
      )}

      {editAtivo && (
        <Modal
          title={editAtivo.id ? `ATIVO: ${editAtivo.nome}` : "Novo Ativo"}
          onClose={() => setEditAtivo(null)}
        >
          <AtivoFicha
            ativo={editAtivo}
            readOnly={false}
            onSubmit={async (data) => {
              if (data.id) await editarAtivo(data.id, data);
              else await adicionarAtivo(data);

              await carregarAtivos();
              setEditAtivo(null);
            }}
            empresas={empresas}
          />
        </Modal>
      )}

    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className="bg-gray-900 p-6 rounded-2xl w-full max-w-4xl
                   max-h-[90vh] overflow-y-auto shadow-xl border border-gray-700"
      >
        <div className="flex justify-between mb-4 sticky top-0 bg-gray-900 z-10">
          <h3 className="text-xl">{title}</h3>
          <button
            onClick={onClose}
            className="absolute right-4 text-gray-400 hover:text-white transition"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
