import { useEffect, useState } from "react";
import * as Repository from "../services/DatabaseRepository";
import { OfflineService } from "../services/OfflineService";
import { Material } from "../types";

export type BlocoTexto = { id: string; tipo: "texto"; conteudo: string };
export type BlocoImagem = {
  id: string;
  tipo: "imagem";
  url: string;
  alt: string;
};


export function useMateriaisList() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const online = await OfflineService.isConnected();
      if (online) {
        const data = await Repository.getMateriais();
        setMateriais(data);
        setIsOffline(false);
      } else {
        const offlineData = await OfflineService.getOfflineMateriais();
        setMateriais(offlineData);
        setIsOffline(true);
      }
    } catch (error) {
      console.error("Erro ao carregar materiais da nuvem, caindo para offline:", error);
      const offlineData = await OfflineService.getOfflineMateriais();
      setMateriais(offlineData);
      setIsOffline(true);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const apagarMaterial = async (id: string) => {
    try {
      await Repository.deleteMaterial(id);
      await carregarDados(); // Atualiza lista local
      return { success: true };
    } catch (error: any) {
      console.error("Erro ao apagar material:", error);
      return { success: false, error };
    }
  };

  return { materiais, carregando, isOffline, apagarMaterial, refresh: carregarDados };
}

export function useMaterial(id?: string | string[]) {
  const [material, setMaterial] = useState<Material | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (!id || typeof id !== "string") {
      setCarregando(false);
      return;
    }

    const fetchDetail = async () => {
      setCarregando(true);
      try {
        const online = await OfflineService.isConnected();
        if (online) {
          const data = await Repository.getMaterialById(id);
          if (data) {
            setMaterial(data);
            setIsOffline(false);
          } else {
            // Se não encontrou online, tenta local
            const offlineData = await OfflineService.getOfflineMateriais();
            const found = offlineData.find((m) => m.id === id) || null;
            setMaterial(found);
            setIsOffline(true);
          }
        } else {
          const offlineData = await OfflineService.getOfflineMateriais();
          const found = offlineData.find((m) => m.id === id) || null;
          setMaterial(found);
          setIsOffline(true);
        }
      } catch (error) {
        console.error("Erro ao buscar detalhe do material na nuvem, caindo para offline:", error);
        const offlineData = await OfflineService.getOfflineMateriais();
        const found = offlineData.find((m) => m.id === id) || null;
        setMaterial(found);
        setIsOffline(true);
      } finally {
        setCarregando(false);
      }
    };

    fetchDetail();
  }, [id]);

  return { material, carregando, isOffline };
}
