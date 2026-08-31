import {
  createContext,
  useContext,
  useMemo,
  useState
} from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("estateflow_user");
    return raw ? JSON.parse(raw) : null;
  });

  async function login(email, password) {
    const { data } = await api.post("/auth/login", {
      email,
      password
    });

    localStorage.setItem("estateflow_token", data.token);
    localStorage.setItem(
      "estateflow_user",
      JSON.stringify(data.user)
    );

    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem("estateflow_token");
    localStorage.removeItem("estateflow_user");
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, login, logout }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
