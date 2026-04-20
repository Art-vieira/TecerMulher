import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase.config';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [carregandoAuth, setCarregandoAuth] = useState(true);

  useEffect(() => {
    // Inscreve-se nas mudanças de estado de login
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      setCarregandoAuth(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    isAdmin: !!user,
    carregandoAuth,
  };
}
