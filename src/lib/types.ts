export interface Participant {
  id: string;
  name: string;
  email: string;
}

export interface Raffle {
  id: string;
  title: string;
  description: string;
  status: 'Rascunho' | 'Ativo' | 'Concluído';
  totalParticipants: number;
  totalWinners: number;
  participants: Participant[];
  winners: Participant[];
  companyId?: string | null;
  companyName?: string | null;
  rules?: string;
  privacyPolicy?: string;
  imageUrl?: string | null;
  imageAspectRatio?: '1:1' | '16:9' | null;
}

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  status: 'Ativo' | 'Inativo';
  whatsapp?: string;
  site?: string;
  instagram?: string;
  rafflesCount?: number;
  logoUrl?: string;
}

export interface User {
    uid: string;
    name: string;
    email: string;
    role: 'Super Admin' | 'Admin';
}
