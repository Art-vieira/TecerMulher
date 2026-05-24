import { useEffect, useState } from "react";
import * as Repository from "../services/DatabaseRepository";
import { OfflineService } from "../services/OfflineService";
import { Duvida } from "../types";

export function useDuvidasList() {
  const [duvidas, setDuvidas] = useState<Duvida[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const online = await OfflineService.isConnected();
      if (online) {
        const data = await Repository.getDuvidas();
        setDuvidas(data);
      } else {
        const offlineData = await OfflineService.getOfflineDuvidas();
        setDuvidas(offlineData);
      }
    } catch (error) {
      console.error("Erro ao carregar dúvidas, caindo para offline:", error);
      const offlineData = await OfflineService.getOfflineDuvidas();
      setDuvidas(offlineData);
    } finally {
      setCarregando(false);
    }
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
