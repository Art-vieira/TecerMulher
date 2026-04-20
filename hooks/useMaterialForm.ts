import { useState, useEffect } from 'react';
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { Bloco } from './useMateriais';

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function useMaterialForm(id?: string | string[]) {
  const [titulo, setTitulo] = useState('');
  const [imagemCapa, setImagemCapa] = useState('');
  const [blocos, setBlocos] = useState<Bloco[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(!!id);

  // Carrega os dados se houver ID sendo editado
  useEffect(() => {
    if (!id || typeof id !== 'string') {
      setCarregandoDados(false);
      return;
    }

    const carregarMaterial = async () => {
      try {
        const docRef = doc(db, 'materiais', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitulo(data.title || '');
          setImagemCapa(data.imagemCapa || '');
          setBlocos(data.blocos || []);
        } else {
          setTitulo('');
          setImagemCapa('');
          setBlocos([]);
        }
      } catch (error) {
        console.error('Erro ao buscar material:', error);
      } finally {
        setCarregandoDados(false);
      }
    };

    carregarMaterial();
  }, [id]);

  // Manipulação de Blocos
  const addBlocoTexto = () =>
    setBlocos((prev) => [...prev, { id: uid(), tipo: 'texto', conteudo: '' }]);

  const addBlocoImagem = () =>
    setBlocos((prev) => [...prev, { id: uid(), tipo: 'imagem', url: '', alt: '' }]);

  const removeBloco = (idToRemove: string) =>
    setBlocos((prev) => prev.filter((b) => b.id !== idToRemove));

  const updateBloco = (idToUpdate: string, campo: string, valor: string) =>
    setBlocos((prev) =>
      prev.map((b) => (b.id === idToUpdate ? { ...b, [campo]: valor } : b))
    );

  const moverBloco = (idToMove: string, direcao: 'up' | 'down') => {
    setBlocos((prev) => {
      const idx = prev.findIndex((b) => b.id === idToMove);
      if (direcao === 'up' && idx === 0) return prev;
      if (direcao === 'down' && idx === prev.length - 1) return prev;
      const nova = [...prev];
      const troca = direcao === 'up' ? idx - 1 : idx + 1;
      [nova[idx], nova[troca]] = [nova[troca], nova[idx]];
      return nova;
    });
  };

  // Salvar no Firebase (Criação ou Edição)
  const salvarMaterial = async () => {
    if (!titulo.trim()) {
      return { success: false, error: 'Por favor, preencha o título da aula.' };
    }
    if (blocos.length === 0) {
      return { success: false, error: 'Adicione pelo menos um bloco de conteúdo.' };
    }

    setSalvando(true);
    try {
      if (id && typeof id === 'string') {
        const docRef = doc(db, 'materiais', id);
        await updateDoc(docRef, {
          title: titulo.trim(),
          imagemCapa: imagemCapa.trim(),
          blocos,
        });
      } else {
        await addDoc(collection(db, 'materiais'), {
          title: titulo.trim(),
          imagemCapa: imagemCapa.trim(),
          blocos,
          createdAt: serverTimestamp(),
        });
      }
      return { success: true };
    } catch (err: any) {
      console.error('Erro ao salvar material:', err);
      return { success: false, error: err.message };
    } finally {
      setSalvando(false);
    }
  };

  return {
    titulo, setTitulo,
    imagemCapa, setImagemCapa,
    blocos, setBlocos,
    salvando,
    carregandoDados,
    acoesBloco: { addBlocoTexto, addBlocoImagem, removeBloco, updateBloco, moverBloco },
    salvarMaterial
  };
}
