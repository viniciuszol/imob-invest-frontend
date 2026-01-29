export default function MoneyInput({ label, value, onChange, negative = false }) {
  const maskMoney = (v) => {
    if (!v) return "";
    return Number(v).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2
    });
  };

  const parseMoney = (v) => {
    if (!v) return 0;
    const numeric = v.replace(/\D/g, "");
    return Number(numeric) / 100;
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-white-400">{label}</label>
      <input
        type="text"
        value={maskMoney(value)}
        onChange={(e) => {
          const parsed = parseMoney(e.target.value);
          onChange(negative ? -Math.abs(parsed) : parsed);
        }}
        className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text"
      />
    </div>
  );
}
