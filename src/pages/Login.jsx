import { useState, useEffect } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { loginRequest } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(true);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form.email, form.password, remember);
      navigate("/empresas");
    } catch {
      setError("Email ou senha inválidos");
    }

    setLoading(false);
  };

  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      navigate("/empresas");
    }
  }, [token]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black -z-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-sm p-8 flex flex-col gap-6"
      >
        <h1 className="text-3xl font-bold text-center">Imob Invest</h1>
        <p className="text-muted text-center -mt-4">Acesse sua conta</p>

        <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
        <Input label="Senha" name="password" type="password" value={form.password} onChange={handleChange} />

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={remember}
            onChange={e => setRemember(e.target.checked)}
          />
          Manter conectado
        </label>
        <Button disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>

        <p className="text-sm text-center text-muted">
          Não tem conta?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Criar conta
          </Link>
        </p>
      </form>
    </div>
  );
}
