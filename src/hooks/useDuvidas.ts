import { useEffect, useState } from "react";
import * as Repository from "../services/DatabaseRepository";
import { Duvida } from "../types";

export function useDuvidasList() {
  const [duvidas, setDuvidas] = useState<Duvida[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarDados = async () => {
    setCarregando(true);
    const data = await Repository.getDuvidas();
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
      await Repository.deleteDuvida(id);
      await refresh();
      return { success: true };
    } catch (error: any) {
      return { success: false, error };
    }
  };

  return { duvidas, carregando, refresh, apagarDuvida };
}
