import { useState } from "react";
import { Check, X } from "lucide-react";

export default function UserForm({ user, onSave, onCancel }) {
  const [nome, setNome] = useState(user?.nome ?? "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ nome });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-gray-400">Nome</label>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700"
        />
      </div>

      <div>
        <label className="text-sm text-gray-400">Email</label>
        <input
          value={user.email}
          disabled
          className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 opacity-60"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">

        <button
          type="submit"
          className="p-2 rounded-lg hover:bg-gray-800 text-green-400"
        >
          <Check size={18} />
        </button>
      </div>
    </form>
  );
}
