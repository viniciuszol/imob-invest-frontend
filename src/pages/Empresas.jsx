// Empresas.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LogOut,
  Building2,
  User2,
  Home,
  LineChart,
  Plus,
  X,
  Edit,
  Trash,
  RefreshCw
} from "lucide-react";
import EmpresaDetails from "../components/EmpresaDetails";

import { useAuth } from "../contexts/AuthContext";
import { useEmpresa } from "../contexts/EmpresaContext";

import ImportarEmpresaForm from "../components/ImportarEmpresaForm";
import ImportarDadosForm from "../components/ImportarDadosForm";
import EmpresaForm from "../components/EmpresaForm";
import Navbar from "../components/Navbar";

const actionBtn =
  "p-2 rounded-lg text-white hover:text-blue-500 hover:bg-gray-700/80 transition";

export default function Empresas() {
  const { user, logout } = useAuth();
  const {
    empresas,
    criar,
    editar,
    remover,
    importarViaNibo,
    refreshTodas,
    refreshPorEmpresa,
    importarDados,
  } = useEmpresa();

  const navigate = useNavigate();

  // Estados dos Modais
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(null); // ID da empresa
  const [detailsOpen, setDetailsOpen] = useState(null);
  const [importEmpresaOpen, setImportEmpresaOpen] = useState(false);
  const [importDadosOpen, setImportDadosOpen] = useState(null); // empresa
  const [refreshing, setRefreshing] = useState(false);

  return (
  <div className="min-h-screen text-white">
       <Navbar />
       {/* GRADIENTE FIXO NA TELA */}
       <div className="fixed inset-0 bg-gradient-to-b from-gray-900 to-black -z-10" />
 
       <div className="flex flex-col items-center">
        {/* MAIN */}
        <main className="px-4 py-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-semibold flex items-center gap-3">
                <Building2 size={28} className="text-blue-500" />
                Suas Empresas
              </h2>

              <button
                onClick={async () => {
                  if (refreshing) return;
                  setRefreshing(true);
                  try {
                    await refreshTodas();
                  } finally {
                    setRefreshing(false);
                  }
                }}
                disabled={refreshing}
                className={`${actionBtn} ${refreshing
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:text-white-400"
                  }`}
                title="Atualizar todas as empresas"
              >
                <RefreshCw
                  size={18}
                  className={refreshing ? "animate-spin" : ""}
                />
              </button>
            </div>

            {/* LISTA DE EMPRESAS */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {empresas.map((e) => (
                <div
                  key={e.id}
                  className="bg-gray-900/50 backdrop-blur-xl p-6 rounded-2xl shadow-lg 
             border border-gray-800 hover:border-blue-500 transition group
             flex flex-col justify-between min-h-[200px]"
                >

                  <p
                    className="text-lg font-bold group-hover:text-blue-400 transition
             line-clamp-2 break-words"
                    title={e.nome}
                  >
                    {e.nome}
                  </p>
                  <p className="mt-2 text-gray-400 text-sm">
                    <span className="text-gray-500">CNPJ:</span> {e.cnpj}
                  </p>

                  <div className="mt-6 flex gap-2">
                    <button
                      onClick={() => setDetailsOpen(e)}
                      className="flex-1 bg-blue-600/50 rounded-lg py-2 hover:bg-blue-700 transition shadow font-semibold"
                    >
                      Ver Detalhes
                    </button>

                    <button
                      onClick={() => {
                        setImportDadosOpen(e); // 👈 vamos usar isso já já
                      }}
                      className="flex-1 bg-blue-600/80 rounded-lg py-2 hover:bg-blue-700 transition shadow font-semibold"
                    >
                      Importar Dados
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* BOTÕES */}
            <div className="mt-10 flex justify-center gap-4">
              <button
                onClick={() => setImportEmpresaOpen(true)}
                className="flex items-center gap-2 bg-blue-600/70 px-6 py-3 rounded-xl hover:bg-blue-700 transition shadow-lg text-white font-semibold"
              >
                Importar Empresa
              </button>
            </div>
          </div>
        </main>

        {/** === MODAL: DETALHES === */}
        {detailsOpen && (
          <Modal
            title={`${detailsOpen.nome}`}
            onClose={() => setDetailsOpen(null)}
          >
            <EmpresaDetails
              empresa={detailsOpen}
              onEdit={() => {
                setEditOpen(detailsOpen);
                setDetailsOpen(null);
              }}
              onDelete={async () => {
                await remover(detailsOpen.id);
                setDetailsOpen(null);
              }}
              onRefresh={async () => {
                setRefreshing(true);
                try {
                  await refreshPorEmpresa(detailsOpen.id);
                } catch (err) {
                  console.error("Erro ao atualizar empresa:", err);
                  alert("Erro ao atualizar empresa.");
                } finally {
                  setRefreshing(false);
                }
              }}
              refreshing={refreshing}
            />

          </Modal>
        )}

        {/** === MODAL: EDITAR === */}
        {editOpen && (
          <Modal title="Editar Empresa" onClose={() => setEditOpen(null)}>
            <EmpresaForm
              initialData={editOpen}
              onSubmit={async (dados) => {
                await editar(editOpen.id, dados);
                setEditOpen(null);
              }}
            />
          </Modal>
        )}

        {/** === MODAL: IMPORTAR EMPRESA === */}
        {importEmpresaOpen && (
          <Modal
            title="Importar Empresa via Token Nibo"
            onClose={() => setImportEmpresaOpen(false)}
          >
            <ImportarEmpresaForm
              onImport={async (token) => {
                try {
                  await importarViaNibo(token);
                  setImportEmpresaOpen(false);
                } catch (err) {
                  console.error(err);
                  alert("Erro ao importar.");
                }
              }}
            />
          </Modal>
        )}

        {/** === MODAL: IMPORTAR DADOS === */}
        {importDadosOpen && (
          <Modal
            title={`Importar dados — ${importDadosOpen.nome}`}
            onClose={() => setImportDadosOpen(null)}
          >
            <ImportarDadosForm
              empresa={importDadosOpen}
              onImport={async (token) => {
                try {
                  await importarDados(importDadosOpen.id, token);
                  setImportDadosOpen(null);
                } catch (err) {
                  console.error(err);
                  alert("Erro ao importar dados.");
                }
              }}
            />
          </Modal>
        )}

      </div>
    </div>
  );
}

/* ------------------ */
/* COMPONENTES INTERNOS */
/* ------------------ */
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative bg-gray-900 p-6 rounded-2xl shadow-xl w-full max-w-lg border border-gray-700">

        {/* BOTÃO FECHAR FIXO */}
        <button
          onClick={onClose}
          className="absolute top-5 right-4 text-gray-400 hover:text-white transition"
          aria-label="Fechar"
        >
          <X size={22} />
        </button>

        {/* TÍTULO */}
        {title && (
          <h3 className="text-xl font-semibold mb-4 pr-8">
            {title}
          </h3>
        )}

        {/* CONTEÚDO */}
        {children}
      </div>
    </div>
  );
}
