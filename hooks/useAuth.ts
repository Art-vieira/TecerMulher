import { useState, useEffect } from 'react';
import { LocalStorage } from '../services/localStorage';

export function useAuth() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [carregandoAuth, setCarregandoAuth] = useState(true);

  useEffect(() => {
    // Verifica sessão local ao carregar
    const checkSession = async () => {
      const session = await LocalStorage.getUserSession();
      setUser(session);
      setCarregandoAuth(false);
    };

    checkSession();
  }, []);

  const loginLocal = async (email: string) => {
    const session = { email };
    await LocalStorage.saveUserSession(session);
    setUser(session);
  };

  const logoutLocal = async () => {
    await LocalStorage.saveUserSession(null);
    setUser(null);
  };

  return {
    user,
    isAdmin: !!user,
    carregandoAuth,
    loginLocal,
    logoutLocal,
  };
}
