// src/services/resourceService.ts
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Resource, ResourceFormData } from '../models/Resource';

const COLLECTION_NAME = 'resources';
const resourcesCollection = collection(db, COLLECTION_NAME);

// Convert Firestore document to Resource model
const convertResource = (doc: any): Resource => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
};

// Get all resources
export const getAllResources = async (): Promise<Resource[]> => {
  try {
    const q = query(resourcesCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(convertResource);
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }
};

// Get featured resources
export const getFeaturedResources = async (limitCount = 6): Promise<Resource[]> => {
  try {
    const q = query(
      resourcesCollection,
      where('featured', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(convertResource);
  } catch (error) {
    console.error('Error fetching featured resources:', error);
    throw error;
  }
};

// Get resources by category
export const getResourcesByCategory = async (category: string): Promise<Resource[]> => {
  try {
    const q = query(
      resourcesCollection,
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(convertResource);
  } catch (error) {
    console.error('Error fetching resources by category:', error);
    throw error;
  }
};

// Get resource by ID
export const getResourceById = async (id: string): Promise<Resource | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return convertResource(docSnap);
  } catch (error) {
    console.error('Error fetching resource by ID:', error);
    throw error;
  }
};

// Add a Medium article to resources
export const addMediumArticle = async (articleData: any): Promise<Resource> => {
  try {
    console.log('Adding medium article to resources:', articleData);
    
    // Create the resource document with all needed fields
    const resourceData = {
      title: articleData.title,
      description: articleData.description,
      category: articleData.category || 'Development',
      readTime: articleData.readTime || '5 min read',
      imageUrl: articleData.imageUrl || 'https://source.unsplash.com/random/600x400/?kids,learning',
      externalLink: articleData.externalLink,
      featured: articleData.featured || false,
      tags: articleData.tags || [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    // Add the document to Firestore
    const docRef = await addDoc(resourcesCollection, resourceData);
    console.log('Resource added with ID:', docRef.id);
    
    return {
      id: docRef.id,
      ...resourceData,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Resource;
  } catch (error) {
    console.error('Error adding resource:', error);
    throw error;
  }
};

// Create new resource
export const createResource = async (resourceData: ResourceFormData): Promise<Resource> => {
  try {
    const resourceWithDates = {
      ...resourceData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(resourcesCollection, resourceWithDates);
    
    return {
      id: docRef.id,
      ...resourceData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  } catch (error) {
    console.error('Error creating resource:', error);
    throw error;
  }
};

// Update resource
export const updateResource = async (id: string, resourceData: Partial<ResourceFormData>): Promise<Resource> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    
    const updateData = {
      ...resourceData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(docRef, updateData);
    
    const updatedDoc = await getDoc(docRef);
    return convertResource(updatedDoc);
  } catch (error) {
    console.error('Error updating resource:', error);
    throw error;
  }
};

// Delete resource
export const deleteResource = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting resource:', error);
    throw error;
  }
};

// Search resources
export const searchResources = async (
  searchTerm: string,
  categories: string[] = []
): Promise<Resource[]> => {
  try {
    // Simple search implementation
    const snapshot = await getDocs(resourcesCollection);
    
    return snapshot.docs
      .map(convertResource)
      .filter(resource => {
        const matchesSearch = !searchTerm || 
          resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resource.description.toLowerCase().includes(searchTerm.toLowerCase());
          
        const matchesCategory = !categories.length || 
          categories.includes(resource.category);
          
        return matchesSearch && matchesCategory;
      });
  } catch (error) {
    console.error('Error searching resources:', error);
    throw error;
  }
};

// Get resources by tags
export const getResourcesByTags = async (tags: string[]): Promise<Resource[]> => {
  try {
    if (!tags.length) return getAllResources();
    
    // Firestore doesn't support array contains any with more than 10 values
    // So we'll get all resources and filter on client side
    const snapshot = await getDocs(resourcesCollection);
    
    return snapshot.docs
      .map(convertResource)
      .filter(resource => {
        return resource.tags?.some((tag: string) => tags.includes(tag));
      });
  } catch (error) {
    console.error('Error fetching resources by tags:', error);
    throw error;
  }
};