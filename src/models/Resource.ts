// src/models/Resource.ts
export interface Resource {
  id: string;
  title: string;
  category: string;
  readTime: string;
  imageUrl: string;
  externalLink?: string;
  content?: string; // HTML content for internal articles
  featured?: boolean;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ResourceFormData extends Omit<Resource, 'id' | 'createdAt' | 'updatedAt'> {}