

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'select' | 'radio' | 'checkbox' | 'textarea';
  required: boolean;
  placeholder?: string;
  options?: FormFieldOption[];
}


export interface Participant {
  id: string;
  name: string;
  email?: string;
  [key: string]: any; // To allow for custom fields
}

export interface Raffle {
  id: string;
  title: string;
  description: string;
  status: 'Rascunho' | 'Ativo' | 'Concluído' | 'Finalizado';
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
  drawDates?: string[];
  formFields?: FormField[];
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

    
