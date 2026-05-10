import { useState, useEffect } from 'react';
import * as Repository from '../services/DatabaseRepository';

export function useAuth() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [carregandoAuth, setCarregandoAuth] = useState(true);

  useEffect(() => {
    // Verifica sessão local ao carregar
    const checkSession = async () => {
      const session = await Repository.getUserSession();
      setUser(session);
      setCarregandoAuth(false);
    };

    checkSession();
  }, []);

  const loginLocal = async (email: string) => {
    const session = { email };
    await Repository.saveUserSession(session);
    setUser(session);
  };

  const logoutLocal = async () => {
    await Repository.saveUserSession(null);
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
