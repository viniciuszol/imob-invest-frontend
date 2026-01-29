import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { registerRequest } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await registerRequest(form.nome, form.email, form.password);

      // Após registrar, manda pro login
      navigate("/");
    } catch (err) {
      setError("Erro ao criar conta. Verifique os dados.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black -z-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-sm p-8 flex flex-col gap-6"
      >
        <h1 className="text-3xl font-bold text-center">Criar conta</h1>
        <p className="text-muted text-center -mt-4">
          Cadastre-se para acessar o sistema
        </p>

        <Input
          label="Nome"
          name="nome"
          value={form.nome}
          onChange={handleChange}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />

        <Input
          label="Senha"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <Button disabled={loading}>
          {loading ? "Criando..." : "Criar conta"}
        </Button>
        
        <p className="text-sm text-center text-muted">
          Já tem conta?{" "}
          <Link to="/" className="text-blue-400 hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  );
}
