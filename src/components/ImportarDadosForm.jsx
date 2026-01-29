import { useState } from "react";

export default function ImportarDadosForm({ empresa, onImport }) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!token) return;

    try {
      setLoading(true);
      await onImport(token);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={submit}>

      <input
        className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700"
        placeholder="Token da API Nibo"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        disabled={loading}
      />

      <button
        type="submit"
        disabled={loading}
        className={`rounded-lg py-2 transition text-white
          ${loading
            ? "bg-blue-600/50 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
          }
        `}
      >
        {loading ? "Importando..." : "Importar Dados"}
      </button>
    </form>
  );
}
