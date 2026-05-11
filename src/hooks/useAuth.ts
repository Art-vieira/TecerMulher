import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase/config';
import { signIn, signOut } from '../firebase/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [carregandoAuth, setCarregandoAuth] = useState(true);

  useEffect(() => {
    // Escuta mudanças de autenticação em tempo real (login, logout, expiração de token)
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setCarregandoAuth(false);
    });

    // Cancela o listener quando o componente desmonta
    return unsubscribe;
  }, []);

  /**
   * Realiza login com email e senha no Firebase Authentication.
   * Lança erro em caso de credenciais inválidas — trate no chamador.
   */
  const login = async (email: string, password: string) => {
    await signIn(email, password);
  };

  /**
   * Realiza logout e limpa o estado de autenticação.
   */
  const logout = async () => {
    await signOut();
  };

  return {
    user,
    isAdmin: !!user,
    carregandoAuth,
    login,
    logout,
  };
}
