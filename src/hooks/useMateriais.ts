import { useEffect, useState } from "react";
import * as Repository from "../services/DatabaseRepository";
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

  const carregarDados = async () => {
    setCarregando(true);
    const data = await Repository.getMateriais();
    setMateriais(data);
    setCarregando(false);
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

  return { materiais, carregando, apagarMaterial, refresh: carregarDados };
}

export function useMaterial(id?: string | string[]) {
  const [material, setMaterial] = useState<Material | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!id || typeof id !== "string") {
      setCarregando(false);
      return;
    }

    const fetchDetail = async () => {
      setCarregando(true);
      const data = await Repository.getMaterialById(id);
      setMaterial(data);
      setCarregando(false);
    };

    fetchDetail();
  }, [id]);

  return { material, carregando };
}
