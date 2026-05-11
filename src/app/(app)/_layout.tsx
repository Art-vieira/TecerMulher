import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

/**
 * Layout do grupo (app)
 *
 * Lógica de acesso:
 * - Alunas (sem sessão): acesso livre a /menu, /material, /duvidas, /aula, /duvida-expandida
 * - Admin (com sessão):  mesmo acesso + rotas admin/* com funcionalidades de gestão
 * - Tentativa de acessar admin/* sem sessão → redireciona para /login
 */
export default function AppLayout() {
  const { user, carregandoAuth } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (carregandoAuth) return; // Aguarda verificação da sessão

    // Verifica se o usuário está tentando acessar uma rota administrativa
    const tentandoAcessarAdmin = segments[1] === 'admin';

    if (!user && tentandoAcessarAdmin) {
      // Sem sessão de admin → redireciona para login
      router.replace('/login');
    }
  }, [user, carregandoAuth, segments, router]);

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
