export interface Participant {
  id: string;
  name: string;
  email: string;
}

export interface Raffle {
  id: string;
  title: string;
  description: string;
  status: 'Draft' | 'Active' | 'Completed';
  totalParticipants: number;
  totalWinners: number;
  participants: Participant[];
  winners: Participant[];
}
