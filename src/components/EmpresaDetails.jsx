import { Edit, Trash, RefreshCw } from "lucide-react";

const actionBtn =
  "p-2 rounded-lg text-gray-400 hover:bg-gray-800 transition";

function EmpresaDetails({ empresa, onEdit, onDelete, onRefresh, refreshing }) {
  return (
    <div className="text-gray-300 flex flex-col gap-3">

      <p>
        <strong>Nome:</strong> {empresa.nome}
      </p>

      <p>
        <strong>CNPJ:</strong> {empresa.cnpj}
      </p>

      {/* AÇÕES */}
      <div className="mt-4 flex gap-3 justify-end">
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className={`${actionBtn} ${refreshing
              ? "opacity-50 cursor-not-allowed"
              : "hover:text-blue-500"
            }`}
          title="Atualizar empresa"
        >
          <RefreshCw
            size={18}
            className={refreshing ? "animate-spin" : ""}
          />
        </button>

        <button
          onClick={onEdit}
          className={`${actionBtn} hover:text-yellow-500`}
          title="Editar empresa"
        >
          <Edit size={18} />
        </button>

        <button
          onClick={onDelete}
          className={`${actionBtn} hover:text-red-500`}
          title="Excluir empresa"
        >
          <Trash size={18} />
        </button>
      </div>
    </div>
  );
}

export default EmpresaDetails;
