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

// Create new resource (for internal or external articles)
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

// Create article with content (alias for createResource for clarity)
export const createArticle = async (resourceData: ResourceFormData): Promise<Resource> => {
  return createResource(resourceData);
};

// Update article content
export const updateArticleContent = async (id: string, content: string): Promise<Resource> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    
    const updateData = {
      content,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(docRef, updateData);
    
    const updatedDoc = await getDoc(docRef);
    return convertResource(updatedDoc);
  } catch (error) {
    console.error('Error updating article content:', error);
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
  (resource.content && resource.content.toLowerCase().includes(searchTerm.toLowerCase()));
          
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

// Get related articles by tag
export const getRelatedArticles = async (currentId: string, tags: string[], maxResults = 3): Promise<Resource[]> => {
  try {
    if (!tags.length) return [];
    
    // Get resources that have at least one matching tag, excluding current article
    const snapshot = await getDocs(resourcesCollection);
    
    return snapshot.docs
      .map(convertResource)
      .filter(resource => {
        // Skip current article
        if (resource.id === currentId) return false;
        
        // Check for tag match
        return resource.tags?.some((tag: string) => tags.includes(tag));
      })
      .slice(0, maxResults); // Limit the number of related articles
  } catch (error) {
    console.error('Error fetching related articles:', error);
    throw error;
  }
};

// Get latest articles
export const getLatestArticles = async (limitCount = 5): Promise<Resource[]> => {
  try {
    const q = query(
      resourcesCollection,
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(convertResource);
  } catch (error) {
    console.error('Error fetching latest articles:', error);
    throw error;
  }
};

// Convert a Medium article to an internal article (for migration)
export const convertExternalToInternal = async (id: string, content: string): Promise<Resource> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    
    const updateData = {
      content,
      // Keep externalLink as a reference but use internal content
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(docRef, updateData);
    
    const updatedDoc = await getDoc(docRef);
    return convertResource(updatedDoc);
  } catch (error) {
    console.error('Error converting external to internal article:', error);
    throw error;
  }
};