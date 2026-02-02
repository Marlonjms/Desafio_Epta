import { api } from "./api";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;
  role: string;
  name?: string;
}

export const loginService = async (email: string, password: string) => {
  const response = await api.post("/auth/login", { email, password });
  const token = response.data.access_token;

  const decoded = jwtDecode<JwtPayload>(token);

  return {
    token,
    user: {
      id: decoded.sub,
      role: decoded.role,
      name: decoded.name || 'Usuário'
    }
  };
};