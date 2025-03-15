// src/models/Lead.ts
export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  activityId: string;
  activityName: string;
  agreeToTerms: boolean;
  newsletter: boolean;
  notes?: string;
  status: 'new' | 'contacted' | 'converted' | 'lost';
  createdAt: Date;
  updatedAt: Date;
}

export interface LeadFormData extends Omit<Lead, 'id' | 'status' | 'createdAt' | 'updatedAt'> {
  status?: 'new' | 'contacted' | 'converted' | 'lost';
}