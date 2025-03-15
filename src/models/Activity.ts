// src/models/Activity.ts
export interface Activity {
  id: string;
  title: string;
  description: string;
  price: number;
  ageRange: string;
  imageUrl?: string;
  images?: string[];  // Explicitly defined as optional string array
  websiteUrl?: string;
  location?: string;
  programDetails?: string;
  activities?: string[];
  featured?: boolean;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityFormData extends Omit<Activity, 'id' | 'createdAt' | 'updatedAt'> {}