import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase.config";

export type BlocoTexto = { id: string; tipo: "texto"; conteudo: string };
export type BlocoImagem = {
  id: string;
  tipo: "imagem";
  url: string;
  alt: string;
};
export type Bloco = BlocoTexto | BlocoImagem;

export type Material = {
  id: string;
  title: string;
  imagemCapa?: string;
};

export type MaterialDetail = Material & {
  blocos: Bloco[];
};

export function useMateriaisList() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "materiais"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const dados: Material[] = snapshot.docs.map((d) => ({
          id: d.id,
          title: d.data().title ?? "Sem título",
          imagemCapa: d.data().imagemCapa ?? "",
        }));
        setMateriais(dados);
        setCarregando(false);
      },
      (err) => {
        console.error("Erro ao buscar materiais:", err);
        setCarregando(false);
      },
    );
    return () => unsubscribe();
  }, []);

  const apagarMaterial = async (id: string) => {
    try {
      await deleteDoc(doc(db, "materiais", id));
      return { success: true };
    } catch (error: any) {
      console.error("Erro ao apagar material:", error);
      return { success: false, error };
    }
  };

  return { materiais, carregando, apagarMaterial };
}

export function useMaterial(id?: string | string[]) {
  const [material, setMaterial] = useState<MaterialDetail | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!id || typeof id !== "string") {
      setCarregando(false);
      return;
    }

    const docRef = doc(db, "materiais", id);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setMaterial({
            id: docSnap.id,
            title: data.title || "Sem título",
            imagemCapa: data.imagemCapa || "",
            blocos: data.blocos || [],
          });
        } else {
          setMaterial(null);
        }
        setCarregando(false);
      },
      (error) => {
        console.error("Erro ao carregar aula:", error);
        setCarregando(false);
      },
    );

    return () => unsubscribe();
  }, [id]);

  return { material, carregando };
}
