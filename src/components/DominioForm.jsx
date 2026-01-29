// src/components/DominioForm.jsx
import { useState, useEffect } from "react";
import { Check, Lock } from "lucide-react";

const TIPOS = [
  { value: "status-ativo", label: "Status" },
  { value: "tipos-ativo", label: "Tipo" },
  { value: "finalidades-ativo", label: "Finalidade" },
  { value: "potenciais-ativo", label: "Potencial" },
  { value: "graus-desmobilizacao", label: "Grau de Desmobilização" }
];

export default function DominioForm({ dominio, tipoPadrao, onSubmit }) {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState(tipoPadrao ?? TIPOS[0].value);

  const isSistema = dominio?.is_sistema === true;

  useEffect(() => {
    if (dominio) {
      setNome(dominio.nome);
      setTipo(tipoPadrao);
    }
  }, [dominio, tipoPadrao]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome.trim() || isSistema) return;

    onSubmit({
      tipo,
      nome: nome.trim()
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <div className="bg-gray-900 rounded-xl p-3 border border-gray-700 space-y-3">



        {/* TIPO */}
        <div>
          <label className="text-sm text-gray-400">Tipo</label>
          <select
            value={tipo}
            disabled={!!dominio}
            onChange={e => setTipo(e.target.value)}
            className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 disabled:opacity-50"
          >
            {TIPOS.map(t => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* NOME */}
        <div>
          <label className="text-sm text-gray-400">Nome</label>
          <input
            value={nome}
            disabled={isSistema}
            onChange={e => setNome(e.target.value)}
            className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 disabled:opacity-50"
          />
        </div>

        {isSistema && (
          <p className="text-sm text-gray-400">
            Domínios do sistema não podem ser alterados.
          </p>
        )}
      </div>

      {/* BOTÃO (IGUAL MOVIMENTAÇÃO) */}
      {!isSistema && (
        <div className="flex justify-end">
          <button
            type="submit"
            className="p-2 rounded-lg hover:bg-gray-800 text-green-400"
            title="Salvar domínio"
          >
            <Check size={18} />
          </button>
        </div>
      )}
    </form>
  );
}
