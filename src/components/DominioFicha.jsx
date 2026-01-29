import { Pencil, Pause, Play, Trash, Layers, Edit } from "lucide-react";

export default function DominioFicha({
  dominio,
  onEdit,
  onToggleAtivo,
  onDelete
}) {
  return (
    <div className="space-y-6">
      {/* INFO */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-400">
          <Layers size={16} /> Nome
        </div>
        <p className="text-lg">{dominio.nome}</p>

        <div className="text-gray-400 mt-4">Tipo</div>
        <p className="text-sm">{dominio.tipo}</p>

        <div className="text-gray-400 mt-4">Status</div>
        <p className={dominio.ativo ? "text-green-400" : "text-red-400"}>
          {dominio.ativo ? "Ativo" : "Inativo"}
        </p>
      </div>

      {/* AÇÕES */}
      <div className="flex justify-between pt-4 border-t border-gray-800">
        <div className="flex gap-2">
          {dominio.ativo ? (
            <button
              onClick={onToggleAtivo}
              className="flex items-center gap-2 text-yellow-400 hover:text-yellow-500"
            >
              <Pause size={16} /> Inativar
            </button>
          ) : (
            <button
              onClick={onToggleAtivo}
              className="flex items-center gap-2 text-green-400 hover:text-green-500"
            >
              <Play size={16} /> Reativar
            </button>
          )}

          {!dominio.ativo && (
            <button
              onClick={onDelete}
              className="flex items-center gap-2 text-red-400 hover:text-red-500"
            >
              <Trash size={16} /> Excluir
            </button>
          )}
        </div>

        {dominio.ativo && (
          <button
            onClick={onEdit}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-500"
          >
            <Edit size={16} /> Editar
          </button>
        )}
      </div>
    </div>
  );
}
