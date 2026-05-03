import { useEffect, useState } from "react";
import { LocalStorage, Material, MaterialDetail } from "../services/localStorage";

export type BlocoTexto = { id: string; tipo: "texto"; conteudo: string };
export type BlocoImagem = {
  id: string;
  tipo: "imagem";
  url: string;
  alt: string;
};
export type Bloco = BlocoTexto | BlocoImagem;

export function useMateriaisList() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarDados = async () => {
    setCarregando(true);
    const data = await LocalStorage.getMateriais();
    setMateriais(data);
    setCarregando(false);
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const apagarMaterial = async (id: string) => {
    try {
      await LocalStorage.deleteMaterial(id);
      await carregarDados(); // Atualiza lista local
      return { success: true };
    } catch (error: any) {
      console.error("Erro ao apagar material:", error);
      return { success: false, error };
    }
  };

  return { materiais, carregando, apagarMaterial, refresh: carregarDados };
}

export function useMaterial(id?: string | string[]) {
  const [material, setMaterial] = useState<MaterialDetail | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!id || typeof id !== "string") {
      setCarregando(false);
      return;
    }

    const fetchDetail = async () => {
      setCarregando(true);
      const data = await LocalStorage.getMaterialById(id);
      setMaterial(data);
      setCarregando(false);
    };

    fetchDetail();
  }, [id]);

  return { material, carregando };
}
