import { useState, useEffect } from 'react';
import { LocalStorage, Duvida } from '../services/localStorage';

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
      const data = await LocalStorage.getDuvidaById(id);
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
      if (id) {
        await LocalStorage.updateDuvida(id, {
          title,
          tipoResposta,
          respostaCurta,
          respostaExpandida,
          imagemDuvida,
        });
      } else {
        await LocalStorage.addDuvida({
          title,
          tipoResposta,
          respostaCurta,
          respostaExpandida,
          imagemDuvida,
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
