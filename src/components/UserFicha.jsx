import { Edit, Trash, User } from "lucide-react";

const actionBtn =
  "p-2 rounded-lg text-gray-400 hover:bg-gray-800 transition";

export default function UserFicha({ user, onEdit, onDelete }) {
  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto p-4 bg-gray-800 rounded-xl border border-gray-700">
      {/* INFO */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-400">
          <User size={16} /> Nome
        </div>
        <p className="text-lg">{user?.nome ?? "—"}</p>

        <div className="text-gray-400 mt-4">Email</div>
        <p>{user?.email}</p>
      </div>

      {/* AÇÕES */}
      <div className="flex justify-between pt-4 border-t border-gray-800">
        <button
          onClick={onDelete}
          className={`${actionBtn} hover:text-red-500`}
          title="Excluir Usuário"
        >
          <Trash size={18} />
        </button>
        
        <button
          onClick={() => onEdit && onEdit(user)}
          className="text-gray-400 hover:text-yellow-500 transition"
          title="Editar Usuário"
        >
          <Edit size={18} />
        </button>
      </div>
    </div>
  );
}
