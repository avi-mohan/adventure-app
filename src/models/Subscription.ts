// src/models/Subscription.ts
export interface Subscription {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    subscriptionSource: 'homepage' | 'resources' | 'footer' | 'lead' | 'other';
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface SubscriptionFormData {
    email: string;
    firstName?: string;
    lastName?: string;
    subscriptionSource: 'homepage' | 'resources' | 'footer' | 'lead' | 'other';
  }