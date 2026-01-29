import { useState, useEffect } from "react";
import {
  Home,
  Plus,
  Eye,
  X,
  Trash,
  ArrowUp,
  ArrowDown,
  Calendar,
  Layers
} from "lucide-react";

import { useMovimentacao } from "../contexts/MovimentacaoContext";
import MovimentacaoFicha from "../components/MovimentacaoFicha";
import { useEmpresa } from "../contexts/EmpresaContext";
import Navbar from "../components/Navbar";
import { useAtivo } from "../contexts/AtivoContext";
import { formatDateBR } from "../utils/date.js";

export default function Movimentacoes() {
  const {
    movimentacoes,
    removerMovimentacao,
    carregarMovimentacoes,
    adicionarMovimentacao,
    editarMovimentacao
  } = useMovimentacao();

  const { empresaAtiva, empresas, setEmpresaAtiva } = useEmpresa();

  const { ativos, carregarAtivos } = useAtivo();

  useEffect(() => {
    setAtivoSelecionado(null);
  }, [empresaAtiva]);

  const [ativoSelecionado, setAtivoSelecionado] = useState(null);
  const [viewMov, setViewMov] = useState(null);
  const [editMov, setEditMov] = useState(null);

  const [ativosDaEmpresa, setAtivosDaEmpresa] = useState([]);

  /* =======================
     MODAL / SCROLL (IGUAL ATIVOS)
  ======================= */
  const modalOpen = Boolean(viewMov || editMov);

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

  /* =======================
     FILTROS / ORDENAÇÃO
  ======================= */
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState(null);

  const [ordenacao, setOrdenacao] = useState({
    campo: null,
    direcao: "asc"
  });

  const toggleOrdenacao = (campo) => {
    setOrdenacao(prev => ({
      campo,
      direcao:
        prev.campo === campo && prev.direcao === "asc"
          ? "desc"
          : "asc"
    }));
  };

  useEffect(() => {
    if (!empresaAtiva) {
      setAtivosDaEmpresa([]);
      return;
    }

    setAtivosDaEmpresa(ativos);
  }, [empresaAtiva, ativos]);

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

  /* =======================
     HELPERS
  ======================= */
  const inferirTipo = (valor) => (valor >= 0 ? "entrada" : "saida");

  const formatBRL = (v) => {
    const n = Number(v);
    if (isNaN(n)) return "—";

    return `R$ ${Math.abs(n).toLocaleString("pt-BR", {
      minimumFractionDigits: 2
    })}`;
  };

  /* =======================
     FILTRAR + ORDENAR
  ======================= */
  const movimentacoesFiltradas = [...movimentacoes]
    .filter(m => {
      if (ativoSelecionado && m.ativo_id !== ativoSelecionado) return false;

      const dataMov = new Date(m.data_movimentacao);

      if (dataInicio) {
        const inicio = new Date(`${dataInicio}T00:00:00`);
        if (dataMov < inicio) return false;
      }

      if (dataFim) {
        const fim = new Date(`${dataFim}T23:59:59.999`);
        if (dataMov > fim) return false;
      }

      return true;
    })
.sort((a, b) => {
  if (!ordenacao.campo) return 0;

  // ==========================
  // ORDENAÇÃO ESPECIAL POR VALOR
  // ==========================
if (ordenacao.campo === "valor") {
  const tipoA = a.valor >= 0 ? "entrada" : "saida";
  const tipoB = b.valor >= 0 ? "entrada" : "saida";

  const absA = Math.abs(a.valor);
  const absB = Math.abs(b.valor);

  // 1️⃣ Entradas sempre antes de saídas
  if (tipoA !== tipoB) {
    return tipoA === "entrada" ? -1 : 1;
  }

  // ==========================
  // DESC → impacto maior primeiro
  // ==========================
  if (ordenacao.direcao === "desc") {
    if (tipoA === "entrada") {
      return absB - absA; // entradas: maior → menor
    }
    return absA - absB;   // saídas: menor → maior
  }

  // ==========================
  // ASC → impacto menor primeiro
  // ==========================
  if (tipoA === "entrada") {
    return absA - absB;   // entradas: menor → maior
  }
  return absB - absA;     // saídas: maior → menor
}


  // ==========================
  // OUTROS CAMPOS (inalterado)
  // ==========================
  const valA = a[ordenacao.campo];
  const valB = b[ordenacao.campo];

  if (ordenacao.campo === "data_movimentacao") {
    return ordenacao.direcao === "asc"
      ? new Date(valA) - new Date(valB)
      : new Date(valB) - new Date(valA);
  }

  if (typeof valA === "string") {
    return ordenacao.direcao === "asc"
      ? valA.localeCompare(valB, "pt-BR")
      : valB.localeCompare(valA, "pt-BR");
  }

  return ordenacao.direcao === "asc"
    ? valA - valB
    : valB - valA;
});


  const actionBtn =
    "w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 transition hover:bg-gray-800";

  return (
    <div className="min-h-screen text-white">
      {/* GRADIENTE FIXO NA TELA */}
      <div className="fixed inset-0 bg-gradient-to-b from-gray-900 to-black -z-10" />

      <Navbar />

      <div className="flex flex-col items-center">
        <main className="px-8 py-10 w-full max-w-7xl">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-semibold flex items-center gap-3">
              <Home size={28} className="text-blue-500" /> Suas Movimentações
            </h2>

            {/* FILTROS */}
            <div className="flex gap-3 items-center">
              <select
                className="appearance-none
    bg-gray-800 border border-gray-700 rounded-xl
    px-4 py-2
    max-w-[220px]
    truncate overflow-hidden whitespace-nowrap
    text-sm
  "
                value={empresaAtiva?.id ?? ""}
                onChange={(e) => {
                  const emp = empresas.find(x => x.id === Number(e.target.value));
                  setEmpresaAtiva(emp ?? null);
                  setAtivoSelecionado(null);
                }}

              >
                <option value="">Selecionar empresa</option>
                {empresas.map(e => (
                  <option key={e.id} value={e.id}>
                    {e.nome}
                  </option>
                ))}
              </select>

              <select
                className="appearance-none
    bg-gray-800 border border-gray-700 rounded-xl
    px-4 py-2
    w-[220px]
    truncate overflow-hidden whitespace-nowrap
    text-sm
  "
                value={ativoSelecionado ?? ""}
                onChange={(e) =>
                  setAtivoSelecionado(Number(e.target.value) || null)
                }
                disabled={!empresaAtiva}
              >
                <option value="">Todos os ativos</option>

                {ativosDaEmpresa.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.nome}
                  </option>
                ))}
              </select>


              {[{
                value: dataInicio,
                set: setDataInicio,
                label: "Início"
              }, {
                value: dataFim,
                set: setDataFim,
                label: "Fim"
              }].map((f, i) => (
                <div key={i} className="relative">
                  <Calendar
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                  />
                  <input
                    type="date"
                    value={f.value}
                    onChange={(e) => f.set(e.target.value)}
                    className={`bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-4 py-2 text-sm ${!f.value ? "text-transparent" : "text-white"
                      }`}
                  />
                  {!f.value && (
                    <span className="absolute left-9 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      {f.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {(!empresaAtiva || !ativoSelecionado) && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
              <Layers size={48} />
              <p className="text-lg">
                Selecione uma empresa e um ativo para visualizar as movimentações
              </p>
            </div>
          )}

          {/* TABELA */}
          {empresaAtiva && ativoSelecionado && (
            <div className="overflow-x-auto bg-gray-900/50 p-4 rounded-2xl shadow-lg border border-gray-800 mb-10">
              <table className="min-w-full text-left text-gray-300">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th
                      onClick={() => toggleOrdenacao("descricao")}
                      className="py-2 px-2 cursor-pointer w-[35%]"
                    >
                      <div className="inline-flex items-center gap-1">
                        Descrição <Arrow campo="descricao" />
                      </div>
                    </th>

                    <th className="py-2 px-2">Tipo</th>

                    <th
                      onClick={() => toggleOrdenacao("valor")}
                      className="py-2 px-2 text-right cursor-pointer w-[15%]"
                    >
                      <div className="inline-flex items-center gap-1 justify-end">
                        Valor <Arrow campo="valor" />
                      </div>
                    </th>

                    <th
                      onClick={() => toggleOrdenacao("data_movimentacao")}
                      className="py-2 px-2 text-right cursor-pointer"
                    >
                      <div className="inline-flex items-center gap-1 justify-end">
                        Data <Arrow campo="data_movimentacao" />
                      </div>
                    </th>

                    <th className="py-2 px-2 text-center">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {movimentacoesFiltradas.map(m => (
                    <tr key={m.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                      <td className="py-2 px-2 truncate max-w-[420px]">
                        {m.descricao}
                      </td>

                      <td className="py-2 px-2 font-semibold">
                        {inferirTipo(m.valor) === "entrada"
                          ? <span className="text-green-500">Entrada</span>
                          : <span className="text-red-500">Saída</span>}
                      </td>

                      <td className="py-2 px-2 text-right">
                        {formatBRL(m.valor)}
                      </td>

                      <td className="py-2 px-2 text-right">
                        {formatDateBR(m.data_movimentacao)}
                      </td>

                      <td className="py-2 px-2">
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={() => setViewMov(m)}
                            className={`${actionBtn} hover:text-blue-500`}
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            onClick={() => removerMovimentacao(m.id)}
                            className={`${actionBtn} hover:text-red-500`}
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* NOVA */}
          <div className="flex justify-center mb-10">
            <button
              onClick={() => setEditMov({ ativo_id: ativoSelecionado})}
              className="flex items-center gap-2 bg-green-600/70 px-6 py-3 rounded-xl hover:bg-green-700 font-semibold"
            >
              <Plus size={20} /> Nova Movimentação
            </button>
          </div>
        </main>
      </div>

      {/* MODAIS */}
      {viewMov && (
        <Modal title={`MOVIMENTAÇÃO: ${viewMov.descricao ?? ""}`} onClose={() => setViewMov(null)}>
          <MovimentacaoFicha
            movimentacao={viewMov}
            readOnly
            onEdit={(m) => {
              setViewMov(null);
              setEditMov(m);
            }}
          />
        </Modal>
      )}

      {editMov && (
        <Modal
          title={
            editMov.id
              ? `MOVIMNETAÇÃO: ${editMov.descricao ?? ""}`
              : "Nova Movimentação"
          }
          onClose={() => setEditMov(null)}
        >

          <MovimentacaoFicha
            movimentacao={editMov}
            readOnly={false}
            onSubmit={async (data) => {
              if (editMov?.id) {
                await editarMovimentacao(editMov.id, data);
              } else {
                await adicionarMovimentacao(data);
              }

              await carregarMovimentacoes();
              setEditMov(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
}

/* =======================
   MODAL (IGUAL ATIVOS)
======================= */
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="
  bg-gray-900
  p-6
  rounded-2xl
  w-full
  max-w-2xl
  max-h-[75vh]
  overflow-y-auto
  shadow-xl 
  border 
  border-gray-700
">
        <div className="flex justify-between mb-2 sticky margin-bottom-10 bg-gray-900 z-10">
          <h3 className="text-xl truncate">{title}</h3>
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
