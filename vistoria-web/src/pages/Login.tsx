import { useState } from "react";
import { Mail, Lock, ArrowRight, UserCircle2 } from "lucide-react";
import { api } from "../services/api";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

import logoEpta from "../assets/logoepta.png";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.access_token);

      const user = response.data.user;
      const cargo = user?.role === "admin" ? "Vistoriador" : "Vendedor";

      alert(`Olá! Você logou como ${cargo}.\nBem-vindo, ${user?.name || 'usuário'}!`);
      navigate("/vistorias");
      
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const msgErro = axiosError.response?.data?.message || "Erro ao conectar com o servidor";
      setErro(msgErro);
    } finally {
      setLoading(false);
    }
  };

  const testeRapido = (userEmail: string) => {
    setEmail(userEmail);
    setPassword("123456");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-sm p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src={logoEpta}
              alt="EPTA Tecnologia"
              className="w-44 h-auto object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">Bem-vindo</h1>
          <p className="text-gray-500 text-sm">Insira suas credenciais para acessar o sistema.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {erro && (
            <p className="text-red-500 text-xs text-center bg-red-50 p-2 rounded border border-red-100">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? "Carregando..." : "Entrar"} <ArrowRight className="h-5 w-5" />
          </button>
        </form>

        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
          <span className="relative bg-white px-4 text-xs text-gray-400 uppercase font-bold">Ou teste com</span>
        </div>

        <div className="space-y-3">
          <button type="button" onClick={() => testeRapido("vendedor@teste.com")} className="w-full flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all text-left group">
            <div className="bg-gray-100 p-2 rounded-full text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors"><UserCircle2 /></div>
            <div>
              <p className="text-sm font-bold text-gray-700">Vendedor</p>
              <p className="text-xs text-gray-400">vendedor@teste.com</p>
            </div>
          </button>

          <button type="button" onClick={() => testeRapido("admin@teste.com")} className="w-full flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all text-left group">
            <div className="bg-gray-100 p-2 rounded-full text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors"><UserCircle2 /></div>
            <div>
              <p className="text-sm font-bold text-gray-700">Vistoriador</p>
              <p className="text-xs text-gray-400">admin@teste.com</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}