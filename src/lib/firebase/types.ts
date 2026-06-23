import { Timestamp, QueryDocumentSnapshot } from 'firebase/firestore';

export interface Memoria {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'foto' | 'video' | 'historia' | 'audio';
  anoDoSaoJoao: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  autorId: string;
  autorNome: string;
  autorCidade: string;
  mediaUrl: string;
  mediaThumbnailUrl: string;
  mediaType: string;
  mediaSizeBytes: number;
  categoria: 'quadrilha' | 'shows' | 'vila-junina' | 'comidas' | 'familia' | 'fogueira' | 'outros';
  tags: string[];
  localNome: string | null;
  localLat: number | null;
  localLng: number | null;
  likeCount: number;
  comentarioCount: number;
  viewCount: number;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  moderadoPor: string | null;
  motivoRejeicao: string | null;
  searchTokens: string[];
}

export interface Like {
  userId: string;
  createdAt: Timestamp;
}

export interface Comentario {
  id: string;
  autorId: string;
  autorNome: string;
  texto: string;
  createdAt: Timestamp;
  status: 'ativo' | 'removido';
}

export interface Usuario {
  uid: string;
  nome: string;
  cidade: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  totalMemorias: number;
  totalLikesRecebidos: number;
  emailNotificacoes: boolean;
  perfilPublico: boolean;
}

export interface Ano {
  ano: number;
  totalMemorias: number;
  categoriaPrincipal: string;
  thumbnailUrl: string;
  memoriaDestaqueId: string;
  updatedAt: Timestamp;
}

export interface FilaModeracao {
  memoriaId: string;
  autorId: string;
  autorNome: string;
  titulo: string;
  tipo: string;
  mediaUrl: string;
  createdAt: Timestamp;
  status: 'pendente' | 'processado';
}

export interface FiltrosGaleria {
  categoria?: string;
  anoMin?: number;
  anoMax?: number;
  busca?: string;
  limite?: number;
  cursor?: QueryDocumentSnapshot;
}

export interface CriarMemoriaInput {
  titulo: string;
  descricao: string;
  tipo: 'foto' | 'video' | 'historia' | 'audio';
  anoDoSaoJoao: number;
  autorId: string;
  autorNome: string;
  autorCidade: string;
  mediaUrl: string;
  mediaThumbnailUrl: string;
  mediaType: string;
  mediaSizeBytes: number;
  categoria: 'quadrilha' | 'shows' | 'vila-junina' | 'comidas' | 'familia' | 'fogueira' | 'outros';
  tags?: string[];
  localNome?: string | null;
  localLat?: number | null;
  localLng?: number | null;
}

export interface CriarUsuarioInput {
  nome: string;
  cidade: string;
  bio?: string | null;
  avatarUrl?: string | null;
}
