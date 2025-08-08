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
  companyId?: string;
  companyName?: string;
  rules?: string;
  privacyPolicy?: string;
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
}
