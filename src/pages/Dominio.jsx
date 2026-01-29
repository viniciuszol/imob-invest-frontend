import { useState, useMemo } from "react";
import {
  Plus,
  Trash,
  Edit,
  Layers,
  Pause,
  Play,
  ChevronDown,
  Search,
  ArrowUp,
  ArrowDown,
  X
} from "lucide-react";

import Navbar from "../components/Navbar";
import DominioForm from "../components/DominioForm";
import { useDominio } from "../contexts/DominioContext";

const TIPOS_DOMINIO = [
  { value: "status-ativo", label: "Status" },
  { value: "tipos-ativo", label: "Tipos" },
  { value: "finalidades-ativo", label: "Finalidades" },
  { value: "potenciais-ativo", label: "Potenciais" },
  { value: "graus-desmobilizacao", label: "Graus de Desmobilização" }
];

export default function Dominio() {
  const {
    dominios,
    tipoSelecionado,
    setTipoSelecionado,
    adicionarDominio,
    editarDominio,
    removerDominio
  } = useDominio();

  const [openForm, setOpenForm] = useState(false);
  const [editDominio, setEditDominio] = useState(null);

  // filtros
  const [filtro, setFiltro] = useState("ativos"); // ativos | inativos | todos
  const [search, setSearch] = useState("");

  // ordenação
  const [ordemNome, setOrdemNome] = useState(null); // null | asc | desc

  const toggleOrdenacaoNome = () => {
    setOrdemNome(prev => {
      if (prev === null) return "asc";
      if (prev === "asc") return "desc";
      return null;
    });
  };

  const listaAtual = dominios[tipoSelecionado] ?? [];

  const dominiosFiltrados = useMemo(() => {
    return [...listaAtual]
      .filter(d => {
        if (filtro === "ativos") return d.ativo === true;
        if (filtro === "inativos") return d.ativo === false;
        return true;
      })
      .filter(d =>
        d.nome.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (!ordemNome) return 0;
        return ordemNome === "asc"
          ? a.nome.localeCompare(b.nome, "pt-BR")
          : b.nome.localeCompare(a.nome, "pt-BR");
      });
  }, [listaAtual, filtro, search, ordemNome]);

  const actionBtn =
    "w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 transition hover:bg-gray-800";

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      {/* GRADIENTE FIXO NA TELA */}
      <div className="fixed inset-0 bg-gradient-to-b from-gray-900 to-black -z-10" />

      <div className="flex flex-col items-center">
        <main className="px-8 py-10 w-full max-w-6xl">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-semibold flex items-center gap-3">
              <Layers size={28} className="text-blue-400" /> Domínios
            </h2>

            <div className="flex gap-3 items-center">

              {/* TIPO DOMÍNIO */}
              <div className="relative">
                <select
                  value={tipoSelecionado}
                  onChange={(e) => setTipoSelecionado(e.target.value)}
                  className="appearance-none bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 pr-10 text-sm"
                >
                  {TIPOS_DOMINIO.map(t => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>

              {/* FILTRO ATIVO */}
              <div className="relative">
                <select
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="appearance-none bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 pr-10 text-sm"
                >
                  <option value="ativos">Somente ativos</option>
                  <option value="todos">Ativos e inativos</option>
                  <option value="inativos">Somente inativos</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>

              {/* SEARCH */}
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-4 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* TABELA */}
          <div className="overflow-x-auto bg-gray-900/50 p-4 rounded-2xl shadow-lg border border-gray-800 mb-10">
            <table className="min-w-full text-left text-gray-300">
              <thead>
                <tr className="border-b border-gray-700">
                  <th
                    onClick={toggleOrdenacaoNome}
                    className="py-2 px-2 cursor-pointer select-none hover:text-white"
                  >
                    <div className="flex items-center gap-1">
                      Nome
                      {ordemNome === "asc" && <ArrowUp size={14} />}
                      {ordemNome === "desc" && <ArrowDown size={14} />}
                    </div>
                  </th>
                  <th className="py-2 px-2 text-center">Ações</th>
                </tr>
              </thead>

              <tbody>
                {dominiosFiltrados.map(d => (
                  <tr
                    key={d.id}
                    className={`border-b border-gray-800 transition hover:bg-gray-800/30 ${!d.ativo ? "opacity-50" : ""
                      }`}
                  >
                    <td className="py-2 px-2">{d.nome}</td>

                    <td className="py-2 px-2">
                      <div className="flex justify-center gap-1">

                        {d.ativo && (
                          <button
                            onClick={() => {
                              setEditDominio(d);
                              setOpenForm(true);
                            }}
                            className={`${actionBtn} hover:text-yellow-400`}
                          >
                            <Edit size={16} />
                          </button>
                        )}

                        {d.ativo ? (
                          <button
                            onClick={() =>
                              editarDominio(tipoSelecionado, d.id, { ativo: false })
                            }
                            className={`${actionBtn} hover:text-yellow-400`}
                          >
                            <Pause size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              editarDominio(tipoSelecionado, d.id, { ativo: true })
                            }
                            className={`${actionBtn} hover:text-green-400`}
                          >
                            <Play size={16} />
                          </button>
                        )}

                        {!d.ativo && (
                          <button
                            onClick={() =>
                              removerDominio(tipoSelecionado, d.id)
                            }
                            className={`${actionBtn} hover:text-red-400`}
                          >
                            <Trash size={16} />
                          </button>
                        )}

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* BOTÃO */}
          <div className="flex justify-center mb-10">
            <button
              onClick={() => {
                setEditDominio(null);
                setOpenForm(true);
              }}
              className="flex items-center gap-2 bg-green-600/70 px-6 py-3 rounded-xl hover:bg-green-700 transition shadow-lg text-white font-semibold"
            >
              <Plus size={20} /> Adicionar
            </button>
          </div>
        </main>
      </div>
      {openForm && (
        <Modal
          title={editDominio ? "Editar domínio" : "Novo domínio"}
          onClose={() => setOpenForm(false)}
        >
          <DominioForm
            dominio={editDominio}
            tipoPadrao={tipoSelecionado}
            onSubmit={async ({ tipo, nome }) => {
              if (editDominio) {
                await editarDominio(tipoSelecionado, editDominio.id, { nome });
              } else {
                await adicionarDominio(tipo, { nome });
              }
              setOpenForm(false);
            }}
          />
        </Modal>
      )}
    </div>

  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="
        bg-gray-900
        p-6
        rounded-2xl
        w-full
        max-w-lg
        max-h-[75vh]
        overflow-y-auto
        shadow-xl 
        border 
        border-gray-700
      ">
        <div className="flex justify-between mb-2 sticky bg-gray-900 z-10">
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
