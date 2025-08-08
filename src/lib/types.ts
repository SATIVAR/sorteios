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
}
