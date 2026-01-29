import React, { useState, useEffect, useMemo } from "react";
import { Edit } from "lucide-react";
import api from "../api/api";
import AtivoForm from "./AtivoForm";

export default function AtivoFicha({
  ativo,
  readOnly,
  onEdit,
  onSubmit,
  empresas = []
}) {
  const [formData, setFormData] = useState({
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
    total: 0,

    saldo_devedor: 0,
    preco_venda: 0,
    participacao_venda: 100,

    ativo: true,
    empresa_id: null,

    ...ativo
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
     LABELS HUMANOS (SEM _ID)
  ======================= */
  const labelMap = {
    nome: "Nome",
    status_id: "Status",
    tipo_id: "Tipo",
    finalidade_id: "Finalidade",
    potencial_id: "Potencial",
    grau_desmobilizacao_id: "Grau de Desmobilização",

    valor_aquisicao: "Valor de Aquisição",
    despesas_aquisicao: "Despesas de Aquisição",
    valor_compra: "Valor de Compra",

    receitas: "Receitas",
    despesas: "Despesas",
    total: "Total",

    saldo_devedor: "Saldo Devedor",
    preco_venda: "Preço de Venda",

    percentual_participacao: "Participação (%)",
    participacao_venda: "Participação na Venda (%)"
  };

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

  useEffect(() => {
    if (ativo) {
      setFormData(prev => ({
        ...prev,
        ...ativo
      }));
    }
  }, [ativo]);

  /* =======================
     VALOR COMPRA (AUTO)
  ======================= */
  const valorCompra = useMemo(() => {
    return (
      Number(formData.valor_aquisicao || 0) +
      Number(formData.despesas_aquisicao || 0)
    );
  }, [formData.valor_aquisicao, formData.despesas_aquisicao]);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  /* =======================
     FORMATADORES
  ======================= */
  const formatBRL = (v) =>
    typeof v === "number"
      ? `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
      : "—";

  const formatPercent = (v) =>
    typeof v === "number" ? `${v}%` : "—";

  const nomeDominio = (lista, id) =>
    lista.find(i => i.id === id)?.nome ?? "—";

  const renderValue = (key) => {
    if (["percentual_participacao", "participacao_venda"].includes(key)) {
      return formatPercent(formData[key]);
    }

    if (
      [
        "valor_aquisicao",
        "despesas_aquisicao",
        "receitas",
        "despesas",
        "saldo_devedor",
        "preco_venda",
        "total"
      ].includes(key)
    ) {
      return formatBRL(formData[key]);
    }

    if (key === "valor_compra") {
      return formatBRL(valorCompra);
    }

    if (key === "status_id") return nomeDominio(dominios.status, formData[key]);
    if (key === "tipo_id") return nomeDominio(dominios.tipos, formData[key]);
    if (key === "finalidade_id") return nomeDominio(dominios.finalidades, formData[key]);
    if (key === "potencial_id") return nomeDominio(dominios.potenciais, formData[key]);
    if (key === "grau_desmobilizacao_id") return nomeDominio(dominios.graus, formData[key]);

    return formData[key] ?? "—";
  };

  const groups = [
    ["nome", "status_id", "tipo_id", "finalidade_id", "potencial_id", "grau_desmobilizacao_id"],

    [
      ["receitas", "despesas", "total"],
      ["valor_aquisicao", "despesas_aquisicao", "valor_compra"]
    ],

    ["saldo_devedor", "preco_venda"],
    ["percentual_participacao", "participacao_venda"]
  ];

  const empresaAtual = empresas?.find(e => e.id === formData.empresa_id);

  if (!readOnly) {
    return (
      <AtivoForm
        initialData={formData}
        onSubmit={(data) =>
          onSubmit({
            ...data,
            valor_compra: valorCompra
          })
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto p-4 bg-gray-800 rounded-xl border border-gray-700">

      {groups.map((g, i) => {
        if (Array.isArray(g[0])) {
          return (
            <div key={i} className="grid grid-cols-2 gap-4">
              {g.map((col, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  {col.map(fieldKey => (
                    <div key={fieldKey} className="flex justify-between">
                      <span className="font-semibold">{labelMap[fieldKey]}</span>
                      <span className="text-gray-300">
                        {renderValue(fieldKey)}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          );
        }

        return (
          <div key={i} className="grid grid-cols-2 gap-4">
            {g.map(fieldKey => (
              <div key={fieldKey} className="flex justify-between">
                <span className="font-semibold">{labelMap[fieldKey]}</span>
                <span className="text-gray-300">
                  {renderValue(fieldKey)}
                </span>
              </div>
            ))}
          </div>
        );
      })}

      {/* RODAPÉ */}
      <div className="flex justify-between items-center mt-4">
        {empresaAtual ? (
          <span className="text-sm text-gray-400">
            Empresa: <strong className="text-gray-200">{empresaAtual.nome}</strong>
          </span>
        ) : <span />}

        <button
          onClick={() => onEdit && onEdit(ativo)}
          className="text-gray-400 hover:text-yellow-500"
          title="Editar ativo"
        >
          <Edit size={18} />
        </button>
      </div>
    </div>
  );

}
