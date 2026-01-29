// src/components/MovimentacaoForm.jsx
import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { useAtivo } from "../contexts/AtivoContext";


export default function MovimentacaoForm({ initialData = {}, onSubmit, loading }) {

    const { ativos } = useAtivo();

    const [form, setForm] = useState({
        descricao: "",
        valor: 0,
        tipo: "entrada",
        data_movimentacao: "",
        ativo_id: null,
        ...initialData
    });
    useEffect(() => {
        if (initialData) {
            setForm(prev => ({
                ...prev,
                ...initialData,
                tipo: Number(initialData.valor) < 0 ? "saida" : "entrada"
            }));
        }
    }, [initialData]);

    const formatBRLInput = (value) => {
        const v = Number(value) || 0;

        return `R$ ${Math.abs(v).toLocaleString("pt-BR", {
            minimumFractionDigits: 2
        })}`;
    };


    const parseBRL = (v) =>
        Number(v.replace(/\D/g, "")) / 100;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ativo_id: form.ativo_id,
            descricao: form.descricao?.trim() || undefined,
            data_movimentacao: form.data_movimentacao || undefined,
            valor:
                form.valor === "" || form.valor === null
                    ? undefined
                    : form.tipo === "saida"
                        ? -Math.abs(Number(form.valor))
                        : Math.abs(Number(form.valor)),
        };

        Object.keys(payload).forEach(
            k => payload[k] === undefined && delete payload[k]
        );

        console.log("PAYLOAD FINAL:", payload);

        await onSubmit(payload);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 max-w mx-auto bottom-4"
        >

            <div className="bg-gray-900/60 rounded-xl p-3 border border-gray-700 space-y-3">

                <div>
                    <label className="text-sm text-gray-400">Nome</label>
                    <input
                        value={form.descricao}
                        onChange={(e) =>
                            setForm(prev => ({ ...prev, descricao: e.target.value }))
                        }
                        className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-gray-400 ">Tipo</label>
                        <select
                            value={form.tipo}
                            onChange={(e) =>
                                setForm(prev => ({ ...prev, tipo: e.target.value }))
                            }
                            className="appearance-none w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700"
                        >
                            <option value="entrada">Entrada</option>
                            <option value="saida">Saída</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm text-gray-400">Valor</label>
                        <input
                            value={formatBRLInput(form.valor)}
                            onChange={(e) =>
                                setForm(prev => ({
                                    ...prev,
                                    valor: parseBRL(e.target.value)
                                }))
                            }
                            className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 text-right"
                            inputMode="decimal"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm text-gray-400">Data</label>
                    <input
                        type="date"
                        value={form.data_movimentacao?.slice(0, 10) ?? ""}
                        onChange={(e) =>
                            setForm(prev => ({
                                ...prev,
                                data_movimentacao: e.target.value
                            }))
                        }
                        className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700"
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-400">Ativo</label>
                    <select
                        value={form.ativo_id ?? ""}
                        onChange={(e) =>
                            setForm(prev => ({
                                ...prev,
                                ativo_id: Number(e.target.value) || null
                            }))
                        }
                        className="appearance-none w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700"
                    >
                        {ativos.map(a => (
                            <option key={a.id} value={a.id}>
                                {a.nome}
                            </option>
                        ))}
                    </select>
                </div>

            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="p-2 rounded-lg hover:bg-gray-800 text-green-400"
                    title="Salvar movimentação"
                >
                    <Check size={18} />
                </button>
            </div>
        </form>
    );
}
