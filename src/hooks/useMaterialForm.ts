import { useState, useEffect } from "react";
import * as Repository from "../services/DatabaseRepository";
import { uploadFile } from "../firebase/storage";
import { Bloco, Material } from "../types";

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

/** Verifica se a URI é de um arquivo local (não uma URL pública) */
const isLocalUri = (uri: string): boolean =>
  uri.startsWith("file://") || uri.startsWith("content://");

/** Converte uma URI local em Blob para upload */
const uriToBlob = async (uri: string): Promise<Blob> => {
  const response = await fetch(uri);
  return response.blob();
};

/** Extrai ou gera um nome de arquivo a partir da URI */
const getFileName = (uri: string): string => {
  const parts = uri.split("/");
  const name = parts[parts.length - 1].split("?")[0]; // remove query strings
  return name.includes(".") ? name : `${Date.now()}.jpg`;
};

export function useMaterialForm(id?: string | string[]) {
  const [titulo, setTitulo] = useState("");
  const [imagemCapa, setImagemCapa] = useState("");
  const [blocos, setBlocos] = useState<Bloco[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [carregandoDados, setCarregandoDados] = useState(!!id);

  // Carrega os dados se houver ID sendo editado
  useEffect(() => {
    if (!id || typeof id !== "string") {
      setCarregandoDados(false);
      return;
    }

    const carregarMaterial = async () => {
      try {
        const data = await Repository.getMaterialById(id);
        if (data) {
          setTitulo(data.title || "");
          setImagemCapa(data.imagemCapa || "");
          setBlocos(data.blocos || []);
        }
      } catch (error) {
        console.error("Erro ao buscar material:", error);
      } finally {
        setCarregandoDados(false);
      }
    };

    carregarMaterial();
  }, [id]);

  // ── Manipulação de Blocos ──────────────────────────────────────────

  const addBlocoTexto = () =>
    setBlocos((prev) => [...prev, { id: uid(), tipo: "texto", titulo: "", conteudo: "" }]);

  const addBlocoSubtitulo = () =>
    setBlocos((prev) => [...prev, { id: uid(), tipo: "subtitulo", conteudo: "" }]);

  const addBlocoImagem = () =>
    setBlocos((prev) => [...prev, { id: uid(), tipo: "imagem", url: "", alt: "" }]);

  const addBlocoVideo = () =>
    setBlocos((prev) => [...prev, { id: uid(), tipo: "video", url: "" }]);

  const addBlocoSeparador = () =>
    setBlocos((prev) => [...prev, { id: uid(), tipo: "separador" }]);

  const addBlocoAlerta = () =>
    setBlocos((prev) => [...prev, { id: uid(), tipo: "alerta", conteudo: "" }]);

  const removeBloco = (idToRemove: string) =>
    setBlocos((prev) => prev.filter((b) => b.id !== idToRemove));

  const updateBloco = (idToUpdate: string, campo: string, valor: string) =>
    setBlocos((prev) =>
      prev.map((b) => (b.id === idToUpdate ? { ...b, [campo]: valor } : b))
    );

  const moverBloco = (idToMove: string, direcao: "up" | "down") => {
    setBlocos((prev) => {
      const idx = prev.findIndex((b) => b.id === idToMove);
      if (direcao === "up" && idx === 0) return prev;
      if (direcao === "down" && idx === prev.length - 1) return prev;
      const nova = [...prev];
      const troca = direcao === "up" ? idx - 1 : idx + 1;
      [nova[idx], nova[troca]] = [nova[troca], nova[idx]];
      return nova;
    });
  };

  // ── Salvar com Upload para Firebase Storage ────────────────────────

  const salvarMaterial = async () => {
    if (!titulo.trim()) {
      return { success: false, error: "Por favor, preencha o título da aula." };
    }
    if (blocos.length === 0) {
      return { success: false, error: "Adicione pelo menos um bloco de conteúdo." };
    }

    setSalvando(true);
    setUploadProgress(0);

    try {
      // 1. Upload da imagem de capa (se for URI local)
      let capaUrl = imagemCapa;
      if (imagemCapa && isLocalUri(imagemCapa)) {
        const blob = await uriToBlob(imagemCapa);
        const fileName = getFileName(imagemCapa);
        capaUrl = await uploadFile("materiais/capas", blob, fileName, setUploadProgress);
      }

      // 2. Upload das imagens dos blocos (se forem URIs locais)
      const blocosProcessados = await Promise.all(
        blocos.map(async (bloco) => {
          if (bloco.tipo === "imagem" && bloco.url && isLocalUri(bloco.url)) {
            const blob = await uriToBlob(bloco.url);
            const fileName = getFileName(bloco.url);
            const url = await uploadFile("materiais/imagens", blob, fileName);
            return { ...bloco, url };
          }
          return bloco;
        })
      );

      // 3. Persistir no Firestore
      if (id && typeof id === "string") {
        await Repository.updateMaterial(id, {
          title: titulo.trim(),
          imagemCapa: capaUrl.trim(),
          blocos: blocosProcessados,
        });
      } else {
        await Repository.addMaterial({
          title: titulo.trim(),
          imagemCapa: capaUrl.trim(),
          blocos: blocosProcessados,
        });
      }

      return { success: true };
    } catch (err: any) {
      console.error("Erro ao salvar material:", err);
      return { success: false, error: err.message || "Erro desconhecido." };
    } finally {
      setSalvando(false);
      setUploadProgress(0);
    }
  };

  return {
    titulo,
    setTitulo,
    imagemCapa,
    setImagemCapa,
    blocos,
    setBlocos,
    salvando,
    uploadProgress,
    carregandoDados,
    acoesBloco: {
      addBlocoTexto,
      addBlocoSubtitulo,
      addBlocoImagem,
      addBlocoVideo,
      addBlocoSeparador,
      addBlocoAlerta,
      removeBloco,
      updateBloco,
      moverBloco,
    },
    salvarMaterial,
  };
}
