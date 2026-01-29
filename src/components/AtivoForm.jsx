// src/components/AtivoForm.jsx
import { useState, useEffect, useMemo } from "react";
import { Check, ChevronDown, } from "lucide-react";
import Input from "./Input";
import Button from "./Button";
import api from "../api/api";
import MoneyInput from "./MoneyInput";

/* =======================
   MÁSCARAS
======================= */

const maskMoney = (value) => {
  if (value === null || value === undefined || Number(value) === 0) return "";
  const number = Number(value);

  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2
  });
};

const maskMoneyNegative = (value) => {
  if (value === null || value === undefined || Number(value) === 0) return "";

  const abs = Math.abs(Number(value));

  return `- ${abs.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2
  })}`;
};

const parseMoney = (value) => {
  if (!value) return 0;
  const numeric = value.replace(/\D/g, "");
  return Number(numeric) / 100;
};

export default function AtivoForm({ initialData, onSubmit, loading }) {
  const [form, setForm] = useState({
    nome: "",

    status_id: null,
    tipo_id: null,
    finalidade_id: null,
    potencial_id: null,
    grau_desmobilizacao_id: null,
    percentual_participacao: 100,

    valor_aquisicao: 0,
    despesas_aquisicao: 0,

    receitas: 0,
    despesas: 0,

    saldo_devedor: 0,
    preco_venda: 0,
    participacao_venda: 100
  });

  const [dominios, setDominios] = useState({
    status: [],
    tipos: [],
    finalidades: [],
    potenciais: [],
    graus: []
  });

  const dominiosAtivos = useMemo(() => ({
    status: dominios.status.filter(d => d.ativo),
    tipos: dominios.tipos.filter(d => d.ativo),
    finalidades: dominios.finalidades.filter(d => d.ativo),
    potenciais: dominios.potenciais.filter(d => d.ativo),
    graus: dominios.graus.filter(d => d.ativo),
  }), [dominios]);


  /* =======================
     LOAD DOMÍNIOS
  ======================= */
  useEffect(() => {
    const loadDominios = async () => {
      const [
        statusRes,
        tipoRes,
        finalidadeRes,
        potencialRes,
        grauRes
      ] = await Promise.all([
        api.get("/dominio/status-ativo"),
        api.get("/dominio/tipos-ativo"),
        api.get("/dominio/finalidades-ativo"),
        api.get("/dominio/potenciais-ativo"),
        api.get("/dominio/graus-desmobilizacao")
      ]);

      setDominios({
        status: statusRes.data,
        tipos: tipoRes.data,
        finalidades: finalidadeRes.data,
        potenciais: potencialRes.data,
        graus: grauRes.data
      });
    };

    loadDominios();
  }, []);

  /* =======================
     LOAD INITIAL DATA
  ======================= */
  useEffect(() => {
    if (initialData) {
      setForm(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  /* =======================
     VALOR COMPRA (CALCULADO)
  ======================= */
  const valorCompra = useMemo(() => {
    return (
      Number(form.valor_aquisicao || 0) +
      Number(form.despesas_aquisicao || 0)
    );
  }, [form.valor_aquisicao, form.despesas_aquisicao]);

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...form,
      valor_compra: valorCompra
    });
  };

  return (
    <form
      className="flex flex-col gap-6 max-h-[80vh] overflow-auto"
      onSubmit={handleSubmit}
    >
      <div className="bg-gray-800/20 rounded-xl p-4 border border-gray-700 space-y-6">
        <Input
          label="Nome"
          value={form.nome}
          onChange={(e) =>
            setForm(prev => ({ ...prev, nome: e.target.value }))
          }
        />

        {/* =======================
         SELECTS
      ======================= */}

        {/* =======================
   SELECTS
======================= */}

        <div className="grid grid-cols-3 gap-4">
          {/* STATUS */}
          <div>
            <label className="text-sm text-white-400">Status</label>
            <select
              value={form.status_id}
              onChange={(e) =>
                setForm(prev => ({ ...prev, status_id: e.target.value ? Number(e.target.value) : null }))
              }
              className="appearance-none bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 w-full"
            >
              <option value="">Selecione</option>
              {dominiosAtivos.status.map(s => (
                <option key={s.id} value={s.id}>{s.nome}</option>
              ))}
            </select>
          </div>

          {/* TIPO */}
          <div>
            <label className="text-sm text-white-400">Tipo</label>
            <select
              value={form.tipo_id}
              onChange={(e) =>
                setForm(prev => ({ ...prev, tipo_id: e.target.value ? Number(e.target.value) : null }))
              }
              className="appearance-none bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 w-full"
            >
              <option value="">Selecione</option>
              {dominiosAtivos.tipos.map(t => (
                <option key={t.id} value={t.id}>{t.nome}</option>
              ))}
            </select>
          </div>

          {/* FINALIDADE */}
          <div>
            <label className="text-sm text-white-400">Finalidade</label>
            <select
              value={form.finalidade_id}
              onChange={(e) =>
                setForm(prev => ({ ...prev, finalidade_id: e.target.value ? Number(e.target.value) : null }))
              }
              className="appearance-none bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 w-full"
            >
              <option value="">Selecione</option>
              {dominiosAtivos.finalidades.map(f => (
                <option key={f.id} value={f.id}>{f.nome}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* POTENCIAL */}
          <div>
            <label className="text-sm text-white-400">Potencial</label>
            <select
              value={form.potencial_id}
              onChange={(e) =>
                setForm(prev => ({ ...prev, potencial_id: e.target.value ? Number(e.target.value) : null }))
              }
              className="appearance-none bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 w-full"
            >
              <option value="">Selecione</option>
              {dominiosAtivos.potenciais.map(p => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </div>

          {/* GRAU */}
          <div>
            <label className="text-sm text-white-400">Grau de Desmobilização</label>
            <select
              value={form.grau_desmobilizacao_id}
              onChange={(e) =>
                setForm(prev => ({ ...prev, grau_desmobilizacao_id: e.target.value ? Number(e.target.value) : null }))
              }
              className="appearance-none bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 w-full "
            >
              <option value="">Selecione</option>
              {dominiosAtivos.graus.map(g => (
                <option key={g.id} value={g.id}>{g.nome}</option>
              ))}
            </select>
          </div>
        </div>

        {/* =======================
         VALORES FINANCEIROS
      ======================= */}

        <div className="grid grid-cols-2 gap-4">
          <MoneyInput
            label="Valor Aquisição"
            value={form.valor_aquisicao}
            onChange={(value) =>
              setForm(prev => ({
                ...prev,
                valor_aquisicao: value
              }))
            }
          />

          <MoneyInput
            label="Despesas Aquisição"
            value={form.despesas_aquisicao}
            onChange={(value) =>
              setForm(prev => ({
                ...prev,
                despesas_aquisicao: value
              }))
            }
          />
        </div>

        <MoneyInput
          label="Valor Compra (automático)"
          value={valorCompra}
          disabled
        />

        <div className="grid grid-cols-2 gap-4">
          <MoneyInput
            label="Saldo Devedor "
            value={form.saldo_devedor}
            onChange={(value) =>
              setForm(prev => ({
                ...prev,
                saldo_devedor: value
              }))
            }
          />

          <MoneyInput
            label="Preço Venda"
            value={form.preco_venda}
            onChange={(value) =>
              setForm(prev => ({
                ...prev,
                preco_venda: value
              }))
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
        <Input
          label="Participação Venda (%)"
          value={form.participacao_venda}
          onChange={(e) =>
            setForm(prev => ({
              ...prev,
              participacao_venda: Number(e.target.value.replace(/\D/g, ""))
            }))
          }
        />
        <Input
          label="Percentual Participação (%)"
          value={form.percentual_participacao}
          onChange={(e) =>
            setForm(prev => ({
              ...prev,
              percentual_participacao: Number(e.target.value.replace(/\D/g, ""))
            }))
          }
        />
        </div>
      </div>
<div className="flex justify-end">
  <button
    type="submit"
    disabled={loading}
    title="Salvar alterações"
    className={`
      p-2 rounded-lg
      text-white-400
      hover:text-green-500 hover:bg-gray-800
      transition
      disabled:opacity-100 disabled:cursor-not-allowed
    `}
  >
    <Check size={18} className={loading ? "animate-pulse" : ""} />
  </button>
</div>

    </form>
  );
}
