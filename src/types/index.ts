export type Bloco = {
  id: string;
  tipo: 'texto' | 'subtitulo' | 'imagem' | 'video' | 'separador' | 'alerta';
  titulo?: string;
  conteudo?: string;
  url?: string;
  alt?: string;
};

export type Material = {
  id: string;
  title: string;
  imagemCapa?: string;
  blocos: Bloco[];
  createdAt: string;
};

export type Duvida = {
  id: string;
  title: string;
  resposta?: string; // Mantido para retrocompatibilidade
  tipoResposta?: 'curta' | 'expandida';
  respostaCurta?: string;
  respostaExpandida?: string;
  imagemDuvida?: string;
  createdAt: string;
};
