import { createContext, useContext, useState, useEffect, useRef } from "react";
import { loginRequest, registerRequest } from "../api/auth";
import { parseJwt } from "../utils/jwt";
import { getMe } from "../api/usuario";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);

  const didInit = useRef(false);

  const login = async (email, password, remember = true) => {
    const data = await loginRequest(email, password);

    setToken(data.access_token);
    localStorage.setItem("token", data.access_token);

    // user mínimo (completo depois via JWT)
    setUser({ email });
  };


  const register = async (nome, email, password) => {
    await registerRequest(nome, email, password);
  };

useEffect(() => {
  if (!token) return;

  const carregarUsuario = async () => {
    try {
      const usuario = await getMe();
      setUser(usuario);
    } catch (err) {
      console.error("Erro ao carregar usuário:", err);
      logout();
    }
  };

  carregarUsuario();
}, [token]);


  useEffect(() => {
    if (!token) return;

    if (didInit.current) return;
    didInit.current = true;

    const payload = parseJwt(token);
    if (!payload?.exp) return;

    const expiresAt = payload.exp * 1000;
    const timeout = expiresAt - Date.now();

    if (timeout <= 0) {
      logout();
      return;
    }

    const timer = setTimeout(() => {
      logout();
    }, timeout);

    return () => clearTimeout(timer);
  }, [token]);

  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("empresa_ativa");

    Object.keys(localStorage)
      .filter(k => k.startsWith("empresa_ativa_"))
      .forEach(k => localStorage.removeItem(k));

    didInit.current = false;
  };

  useEffect(() => {
    if (!user?.id) return;

    const raw = localStorage.getItem("empresa_ativa");
    if (!raw) return;

    try {
      const empresa = JSON.parse(raw);

      if (empresa.userId !== user.id) {
        localStorage.removeItem("empresa_ativa");

        Object.keys(localStorage)
          .filter(k => k.startsWith("empresa_ativa_"))
          .forEach(k => localStorage.removeItem(k));
      }
    } catch {
      localStorage.removeItem("empresa_ativa");
    }
  }, [user]);


  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
