export interface Project {
  id: number;
  name: string;
  jurisdiction: string;
  status: string;
  created_at: string;
}

export interface Task {
  id: number;
  project_id: number;
  title: string;
  status: 'pending' | 'active' | 'completed';
  workstream: 'legal' | 'market' | 'admin';
  executor: 'ai' | 'professional' | 'user';
  executorName?: string;
  connection?: string;
}

export interface Lawyer {
  name: string;
  firm: string;
  rating: number;
  specialty: string;
  contact: string;
  email: string;
  location: string;
  description: string;
  emailDraft: string;
}

export interface ContractAnalysis {
  summary: string;
  liabilities: string[];
  taxes: string[];
  commissions: string[];
  redFlags: string[];
}
