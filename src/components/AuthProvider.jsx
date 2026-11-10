import { useCallback, useEffect, useMemo, useState } from "react";
import { tokens } from "../api/client.js";
import { authApi } from "../api/endpoints.js";
import { AuthContext } from "../lib/authContext.js";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(() => !tokens.get());

  useEffect(() => tokens.onClear(() => setUser(null)), []);

  useEffect(() => {
    if (!tokens.get()) return;
    authApi
      .me()
      .then(setUser, () => tokens.clear())
      .finally(() => setReady(true));
  }, []);

  const login = useCallback(async (credentials) => {
    tokens.set(await authApi.login(credentials));
    setUser(await authApi.me());
  }, []);

  const register = useCallback(
    async (values) => {
      await authApi.register(values);
      await login({ username: values.username, password: values.password });
    },
    [login],
  );

  const logout = useCallback(() => tokens.clear(), []);

  const value = useMemo(() => ({ user, ready, login, register, logout }), [user, ready, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
