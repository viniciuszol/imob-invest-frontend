import { useState, useEffect } from "react";
import { Check } from "lucide-react";

export default function CDIForm({ cdi, onSubmit }) {
  const [form, setForm] = useState({
    data: "",
    percentual: "",
    cdi_am: "",
    cdi_percentual_am: ""
  });

  useEffect(() => {
    if (cdi) {
      setForm({
        data: cdi.data?.slice(0, 7),
        percentual: Number(cdi.porcentagem).toFixed(0),
        cdi_am: Number(cdi.cdi_am).toFixed(3),
        cdi_percentual_am: Number(cdi.cdi_percentual_am).toFixed(3)
      });
    }
  }, [cdi]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      data: `${form.data}-01`,
      porcentagem: Number(form.percentual),
      cdi_am: Number(form.cdi_am),
      cdi_percentual_am: Number(form.cdi_percentual_am)
    });
  };

  const maskDecimal3 = (value) => {
    if (!value) return "";

    // mantém só números
    const numeric = value.replace(/\D/g, "");

    // garante pelo menos 3 dígitos
    const padded = numeric.padStart(4, "0");

    const int = padded.slice(0, -3);
    const dec = padded.slice(-3);

    return `${Number(int)}.${dec}`;
  };

  const maskInteger = (value) => {
    if (!value) return "";
    return value.replace(/\D/g, "");
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div className="bg-gray-900 rounded-xl p-4 border border-gray-700 space-y-4">

        <div>
          <label className="text-sm text-gray-400">Mês / Ano</label>
          <input
            type="month"
            value={form.data}
            onChange={e => handleChange("data", e.target.value)}
            className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">Porcentagem</label>
          <input
            type="text"
            value={form.percentual}
            onChange={e =>
              handleChange("percentual", maskInteger(e.target.value))
            }
            className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700"
            required
          />

        </div>

        <div>
          <label className="text-sm text-gray-400">CDI a.m (%)</label>
          <input
            type="text"
            value={form.cdi_am}
            onChange={e =>
              handleChange("cdi_am", maskDecimal3(e.target.value))
            }
            className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700"
          />

        </div>

        <div>
          <label className="text-sm text-gray-400">CDI Percentual a.m (%)</label>
          <input
            type="text"
            value={form.cdi_percentual_am}
            onChange={e =>
              handleChange("cdi_percentual_am", maskDecimal3(e.target.value))
            }
            className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700"
          />

        </div>
      </div>

      {/* BOTÃO SALVAR (IGUAL MOVIMENTAÇÕES) */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="p-2 rounded-lg hover:bg-gray-800 text-green-400"
          title="Salvar"
        >
          <Check size={18} />
        </button>
      </div>
    </form>
  );
}
