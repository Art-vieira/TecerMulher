import { useState, useEffect } from 'react';
import * as Repository from '../services/DatabaseRepository';
import { uploadFile } from "../firebase/storage";

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

export function useDuvidaForm(duvidaId?: string | string[]) {
  const id = Array.isArray(duvidaId) ? duvidaId[0] : duvidaId;

  const [title, setTitle] = useState('');
  const [tipoResposta, setTipoResposta] = useState<'curta' | 'expandida'>('curta');
  const [respostaCurta, setRespostaCurta] = useState('');
  const [respostaExpandida, setRespostaExpandida] = useState('');
  const [imagemDuvida, setImagemDuvida] = useState('');

  const [carregandoDados, setCarregandoDados] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function loadDuvida() {
      if (!id) return;
      setCarregandoDados(true);
      const data = await Repository.getDuvidaById(id);
      if (data) {
        setTitle(data.title || '');
        setTipoResposta(data.tipoResposta || 'curta');
        
        // Se já existir "resposta" antiga, jogamos para respostaCurta
        setRespostaCurta(data.respostaCurta || data.resposta || '');
        setRespostaExpandida(data.respostaExpandida || '');
        setImagemDuvida(data.imagemDuvida || '');
      }
      setCarregandoDados(false);
    }
    loadDuvida();
  }, [id]);

  const salvarDuvida = async () => {
    if (!title.trim()) {
      return { success: false, error: 'O título da pergunta é obrigatório.' };
    }
    if (tipoResposta === 'curta' && !respostaCurta.trim()) {
      return { success: false, error: 'A resposta curta não pode ser vazia.' };
    }
    if (tipoResposta === 'expandida' && !respostaExpandida.trim()) {
      return { success: false, error: 'A resposta expandida não pode ser vazia.' };
    }

    setSalvando(true);

    try {
      let imageUrl = imagemDuvida;
      if (imagemDuvida && isLocalUri(imagemDuvida)) {
        const blob = await uriToBlob(imagemDuvida);
        const fileName = getFileName(imagemDuvida);
        imageUrl = await uploadFile("duvidas/imagens", blob, fileName);
      }

      if (id) {
        await Repository.updateDuvida(id, {
          title,
          tipoResposta,
          respostaCurta,
          respostaExpandida,
          imagemDuvida: imageUrl,
        });
      } else {
        await Repository.addDuvida({
          title,
          tipoResposta,
          respostaCurta,
          respostaExpandida,
          imagemDuvida: imageUrl,
        });
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Erro ao salvar a dúvida.' };
    } finally {
      setSalvando(false);
    }
  };

  return {
    title, setTitle,
    tipoResposta, setTipoResposta,
    respostaCurta, setRespostaCurta,
    respostaExpandida, setRespostaExpandida,
    imagemDuvida, setImagemDuvida,
    carregandoDados,
    salvando,
    salvarDuvida
  };
}
