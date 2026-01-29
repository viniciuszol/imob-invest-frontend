import { useNavigate } from "react-router-dom";
import {
  User2,
  Home,
  Building2,
  LineChart,
  TrendingUp,
  Percent,
  LogOut
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import UserModal from "./UserModal";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [openUser, setOpenUser] = useState(false);

  return (
    <>
      <header className="bg-gray-900/60 backdrop-blur-lg border-b border-gray-800 px-8 py-4 flex items-center sticky top-0 z-50 shadow-lg">

        {/* ESQUERDA: Usuário */}
        <div
          onClick={() => setOpenUser(true)}
          className="flex items-center gap-2 px-3 py-3 rounded-lg hover:bg-gray-700 hover:text-blue-500 transition cursor-pointer"
        >
          <User2 size={24} />
        </div>

        {/* CENTRO: Navegação */}
        <nav className="flex-1 flex justify-center items-center gap-6 text-gray-300">
          <button
            onClick={() => navigate("/empresas")}
            className="hover:text-white transition flex items-center gap-1"
          >
            <Building2 size={18} /> Empresas
          </button>

          <button
            onClick={() => navigate("/ativos")}
            className="hover:text-white transition flex items-center gap-1"
          >
            <Home size={18} /> Ativos
          </button>

          <button
            onClick={() => navigate("/movimentacoes")}
            className="hover:text-white transition flex items-center gap-1"
          >
            <LineChart size={18} /> Movimentações
          </button>

          <button
            onClick={() => navigate("/cdi")}
            className="hover:text-white transition flex items-center gap-1"
          >
            <Percent size={18} /> CDI
          </button>
        </nav>

        {/* DIREITA: Logout */}
        <div>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="flex items-center text-white gap-2 px-3 py-3 rounded-lg hover:bg-gray-700 hover:text-red-600 transition"
          >
            <LogOut size={24} />
          </button>
        </div>
      </header>

      {/* MODAL DO USUÁRIO */}
      {openUser && (
        <UserModal
          user={user}
          onClose={() => setOpenUser(false)}
          onSave={(data) => {
            console.log("editar usuário:", data);
          }}
          onDelete={() => {
            const ok = confirm("Deseja excluir sua conta?");
            if (ok) {
              console.log("deletar usuário");
            }
          }}
        />
      )}
    </>
  );
}