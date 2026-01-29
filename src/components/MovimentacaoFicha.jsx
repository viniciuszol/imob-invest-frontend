// src/components/MovimentacaoFicha.jsx
import { Edit } from "lucide-react";
import MovimentacaoForm from "./MovimentacaoForm";
import { useAtivo } from "../contexts/AtivoContext";
import { formatDateBR } from "../utils/date.js";


export default function MovimentacaoFicha({
  movimentacao,
  readOnly = true,
  onEdit,
  onSubmit
}) {
  if (!movimentacao) return null;

  if (!readOnly) {
    return (
      <MovimentacaoForm
        initialData={movimentacao}
        onSubmit={onSubmit}
      />
    );
  }

  const isSaida = Number(movimentacao.valor) < 0;

  const formatBRL = (v) => {
    const n = Number(v);
    if (isNaN(n)) return "—";

    return `${n < 0 ? "-" : ""}R$ ${Math.abs(n).toLocaleString("pt-BR", {
      minimumFractionDigits: 2
    })}`;
  };

  const { ativos } = useAtivo();

  const ativo =
    ativos.find(a => a.id === movimentacao.ativo_id) ?? null;


  return (
    <div className="
      max-w-xl mx-auto
      bg-gray-800
      rounded-2xl
      border border-gray-700
      p-6
      space-y-5
    ">
      {/* VALOR */}
      <div className="text-center space-y-1">
        <div className={`text-3xl font-semibold ${isSaida ? "text-red-500" : "text-green-500"}`}>
          {formatBRL(movimentacao.valor)}
        </div>

        <div className={`text-sm font-semibold uppercase ${isSaida ? "text-red-500" : "text-green-500"}`}>
          {isSaida ? "Saída" : "Entrada"}
        </div>
      </div>
      

      <div className="h-px bg-gray-700" />


      {/* NOME | DATA */}
      <div className="grid grid-cols-2 gap-4 text">
        <div>
          <div className="text-gray-400 ">Nome</div>
          <div className="font-semibold text-gray-200 truncate">
            {movimentacao.descricao || "—"}
          </div>
        </div>

        <div className="text-right">
          <div className="text-gray-400 ">Data</div>
          <div className="text-gray-300">
            {formatDateBR(movimentacao.data_movimentacao)}
          </div>
        </div>
      </div>

      {/* ATIVO */}
      <div className="text-left ">
        <div className="text-gray-400 ">Ativo</div>
        <div className="font-semibold text-gray-200">
          {ativo?.nome || "—"}
        </div>
      </div>
      {/* AÇÕES */}
      <div className="flex justify-end pt-2">        <button
          onClick={() => onEdit && onEdit(movimentacao)}
          className="p-2 rounded-lg hover:bg-gray-800 hover:text-yellow-500 transition"
        >
          <Edit size={18} />
        </button>
      </div>
    </div>
  );
}
