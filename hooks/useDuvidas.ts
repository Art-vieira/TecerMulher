import { useEffect, useState } from "react";
import { LocalStorage, Duvida } from "../services/localStorage";

export function useDuvidasList() {
  const [duvidas, setDuvidas] = useState<Duvida[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarDados = async () => {
    setCarregando(true);
    const data = await LocalStorage.getDuvidas();
    setDuvidas(data);
    setCarregando(false);
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const refresh = async () => {
    await carregarDados();
  };

  const apagarDuvida = async (id: string) => {
    try {
      await LocalStorage.deleteDuvida(id);
      await refresh();
      return { success: true };
    } catch (error: any) {
      return { success: false, error };
    }
  };

  return { duvidas, carregando, refresh, apagarDuvida };
}
