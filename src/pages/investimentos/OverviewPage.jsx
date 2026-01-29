import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import SubNavInvestimentos from "../../components/SubNavInvestimentos";
import { PieChart, BarChart3 } from "lucide-react";

import { Pie, Bar} from "react-chartjs-2";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    BarElement,
    PointElement,
} from "chart.js";

import { useInvestimentos } from "../../contexts/InvestimentosContext";
import { useDominio } from "../../contexts/DominioContext";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    BarElement,
    PointElement,
);

/* =========================
   PALETA (50 CORES)
========================== */
const COLORS = [
    "#3b82f6", "#22c55e", "#a855f7", "#f97316", "#eab308",
    "#ec4899", "#14b8a6", "#8b5cf6", "#f43f5e", "#06b6d4",
    "#84cc16", "#6366f1", "#d946ef", "#0ea5e9", "#10b981",
    "#f59e0b", "#ef4444", "#8b5cf6", "#22d3ee", "#4ade80",
    "#fb7185", "#c084fc", "#38bdf8", "#facc15", "#34d399",
    "#e879f9", "#fb923c", "#818cf8", "#2dd4bf", "#a3e635",
    "#fde047", "#f472b6", "#7dd3fc", "#86efac", "#fda4af",
    "#ddd6fe", "#67e8f9", "#bbf7d0", "#fecaca", "#e9d5ff",
    "#99f6e4", "#bef264", "#fef08a", "#fbcfe8", "#bae6fd",
    "#dcfce7", "#fee2e2", "#ede9fe", "#cffafe", "#ecfccb"
];

export default function OverviewPage() {
    const { overview, carregarOverview } = useInvestimentos();
    const { dominios } = useDominio();

    /* =========================
       DOMÍNIOS NORMALIZADOS
    ========================== */
    const dominiosOverview = useMemo(() => {
        if (!dominios) {
            return {
                status: [],
                tipos: [],
                finalidades: [],
                potenciais: [],
                graus: []
            };
        }

        return {
            status: dominios["status-ativo"] ?? [],
            tipos: dominios["tipos-ativo"] ?? [],
            finalidades: dominios["finalidades-ativo"] ?? [],
            potenciais: dominios["potenciais-ativo"] ?? [],
            graus: dominios["graus-desmobilizacao"] ?? []
        };
    }, [dominios]);

    /* =========================
       ESTADOS
    ========================== */
    const [filters, setFilters] = useState({});
    const [metric, setMetric] = useState("total");
    const [chartType, setChartType] = useState("pie");

    /* =========================
       LOAD
    ========================== */
    useEffect(() => {
        carregarOverview({});
    }, []);

    useEffect(() => {
        carregarOverview(filters);
    }, [filters]);

    /* =========================
       DADOS
    ========================== */
    const ativos = overview?.ativos ?? [];

    const ativosValidos = ativos.filter((a) => {
        const valor = Number(a[metric]);

        if (!Number.isFinite(valor)) return false;
        if (valor === 0) return false;
        if (metric === "total" && valor < 0) return false;

        return true;
    });

    const totalGeral = ativosValidos.reduce(
        (acc, a) => acc + Number(a[metric]),
        0
    );

    const labels = ativosValidos.map(a => a.nome);
    const values = ativosValidos.map(a => Number(a[metric]));

    /* =========================
       HANDLERS
    ========================== */
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value || undefined
        }));
    };

    const limparFiltros = () => {
        setFilters({});
    };


    
    /* =========================
       METRICS MAP
    ========================== */
    const metricOptions = [
        { key: "total", label: "Total" },
        { key: "saldo_devedor", label: "Saldo Devedor" },
        { key: "preco_venda", label: "Preço de Venda" }
    ];

    
    const metricLabel =
        metricOptions.find(m => m.key === metric)?.label ?? metric;

    /* =========================
       DATASET
    ========================== */
    const chartData = useMemo(() => ({
        labels,
        datasets: [
            {
                label: metricLabel,
                data: values,
                backgroundColor: COLORS.slice(0, values.length),
                borderColor: COLORS.slice(0, values.length),
                fill: false
            }
        ]
    }), [metric, labels, values]);

    const commonChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        }
    };

    /* =========================
       RENDER GRÁFICO
    ========================== */
    const renderChart = () => {
        if (chartType === "bar") {
            return <Bar data={chartData} options={commonChartOptions} />;
        }

        return (
            <Pie
                data={chartData}
                options={{
                    ...commonChartOptions,
                    tooltip: {
                        callbacks: {
                            label(context) {
                                const value = context.parsed;
                                const percent = totalGeral
                                    ? ((value / totalGeral) * 100).toFixed(1)
                                    : 0;

                                return `${context.label}: ${percent}% (${value.toLocaleString(
                                    "pt-BR",
                                    { style: "currency", currency: "BRL" }
                                )})`;
                            }
                        }
                    }
                }}
            />
        );
    };

    return (
        <div>
            <Navbar />

            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
                <main className="px-8 py-10 max-w-7xl mx-auto">

                    <h2 className="text-3xl mb-6 font-semibold flex items-center gap-3">
                        <PieChart size={28} className="text-blue-400" />
                        Visão Geral
                    </h2>

                    <SubNavInvestimentos />

                    {/* FILTROS */}
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
                        {dominiosOverview.status.length > 0 && (
                            <select
                                className="bg-gray-800 px-3 py-2 rounded-lg border border-gray-700"
                                value={filters.status_id ?? ""}
                                onChange={e => handleFilterChange("status_id", e.target.value)}
                            >
                                <option value="">Status</option>
                                {dominiosOverview.status.map(d => (
                                    <option key={d.id} value={d.id}>{d.nome}</option>
                                ))}
                            </select>
                        )}

                        {dominiosOverview.tipos.length > 0 && (
                            <select
                                className="bg-gray-800 px-3 py-2 rounded-lg border border-gray-700"
                                value={filters.tipo_id ?? ""}
                                onChange={e => handleFilterChange("tipo_id", e.target.value)}
                            >
                                <option value="">Tipo</option>
                                {dominiosOverview.tipos.map(d => (
                                    <option key={d.id} value={d.id}>{d.nome}</option>
                                ))}
                            </select>
                        )}

                        {dominiosOverview.finalidades.length > 0 && (
                            <select
                                className="bg-gray-800 px-3 py-2 rounded-lg border border-gray-700"
                                value={filters.finalidade_id ?? ""}
                                onChange={e => handleFilterChange("finalidade_id", e.target.value)}
                            >
                                <option value="">Finalidade</option>
                                {dominiosOverview.finalidades.map(d => (
                                    <option key={d.id} value={d.id}>{d.nome}</option>
                                ))}
                            </select>
                        )}

                        {dominiosOverview.potenciais.length > 0 && (
                            <select
                                className="bg-gray-800 px-3 py-2 rounded-lg border border-gray-700"
                                value={filters.potencial_id ?? ""}
                                onChange={e => handleFilterChange("potencial_id", e.target.value)}
                            >
                                <option value="">Potencial</option>
                                {dominiosOverview.potenciais.map(d => (
                                    <option key={d.id} value={d.id}>{d.nome}</option>
                                ))}
                            </select>
                        )}

                        {dominiosOverview.graus.length > 0 && (
                            <select
                                className="bg-gray-800 px-3 py-2 rounded-lg border border-gray-700"
                                value={filters.grau_desmobilizacao_id ?? ""}
                                onChange={e => handleFilterChange("grau_desmobilizacao_id", e.target.value)}
                            >
                                <option value="">Grau de Desmobilização</option>
                                {dominiosOverview.graus.map(d => (
                                    <option key={d.id} value={d.id}>{d.nome}</option>
                                ))}
                            </select>
                        )}

                        <button
                            onClick={limparFiltros}
                            className="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700"
                        >
                            Limpar filtros
                        </button>
                    </div>

                    {/* CONTROLES */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-3">
                            {metricOptions.map(m => (
                                <button
                                    key={m.key}
                                    onClick={() => setMetric(m.key)}
                                    className={`px-4 py-2 rounded-lg border ${metric === m.key
                                            ? "bg-blue-600 border-blue-500"
                                            : "bg-gray-800 border-gray-700"
                                        }`}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setChartType("pie")}
                                title="Gráfico de Pizza"
                                className={`p-3 rounded-lg border ${chartType === "pie"
                                        ? "bg-blue-600 border-blue-500"
                                        : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                                    }`}
                            >
                                <PieChart size={20} />
                            </button>

                            <button
                                onClick={() => setChartType("bar")}
                                title="Gráfico de Colunas"
                                className={`p-3 rounded-lg border ${chartType === "bar"
                                        ? "bg-blue-600 border-blue-500"
                                        : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                                    }`}
                            >
                                <BarChart3 size={20} />
                            </button>


                            <div className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-500 flex items-center">
                                Exportação
                            </div>
                        </div>

                    </div>

                    {/* GRÁFICO + LEGENDA */}
                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6 h-[420px]">
                            {renderChart()}
                        </div>

                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 overflow-y-auto max-h-[420px]">
                            <h3 className="mb-4 font-semibold">Legenda</h3>

                            {ativosValidos.map((a, idx) => (
                                <div
                                    key={a.id}
                                    className="flex justify-between items-center mb-2 p-2 bg-gray-800 rounded-lg"
                                >
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: COLORS[idx] }}
                                        />
                                        <span>{a.nome}</span>
                                    </div>

                                    <span className="text-green-400 font-bold">
                                        {Number(a[metric]).toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL"
                                        })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}
