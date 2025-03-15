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
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { db, storage } from './firebase';
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
    const snapshot = await getDocs(resourcesCollection);
    return snapshot.docs.map(convertResource);
  };
  
  // Get featured resources
  export const getFeaturedResources = async (limitCount = 6): Promise<Resource[]> => {
    const q = query(
      resourcesCollection,
      where('featured', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(convertResource);
  };
  
  // Get resources by category
  export const getResourcesByCategory = async (category: string): Promise<Resource[]> => {
    const q = query(
      resourcesCollection,
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(convertResource);
  };
  
  // Get resource by ID
  export const getResourceById = async (id: string): Promise<Resource | null> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return convertResource(docSnap);
  };
  
  // Create new resource
  export const createResource = async (
    resourceData: ResourceFormData,
    imageFile?: File
  ): Promise<Resource> => {
    let imageUrl = resourceData.imageUrl;
    
    // Upload image if provided
    if (imageFile) {
      const storageRef = ref(storage, `resources/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(snapshot.ref);
    }
    
    const resourceWithDates = {
      ...resourceData,
      imageUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(resourcesCollection, resourceWithDates);
    
    return {
      id: docRef.id,
      ...resourceData,
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  };
  
  // Update resource
  export const updateResource = async (
    id: string,
    resourceData: Partial<ResourceFormData>,
    imageFile?: File
  ): Promise<Resource> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    let updateData = { ...resourceData };
    
    // Upload new image if provided
    if (imageFile) {
      const storageRef = ref(storage, `resources/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      updateData.imageUrl = await getDownloadURL(snapshot.ref);
    }
    
    // Fix for TypeScript error
    (updateData as any).updatedAt = serverTimestamp();
    
    await updateDoc(docRef, updateData);
    
    const updatedDoc = await getDoc(docRef);
    return convertResource(updatedDoc);
  };
  
  // Delete resource
  export const deleteResource = async (id: string): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  };
  
  // Search resources
  export const searchResources = async (
    searchTerm: string,
    categories: string[] = []
  ): Promise<Resource[]> => {
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
  };
  
  // Get resources by tags
  export const getResourcesByTags = async (tags: string[]): Promise<Resource[]> => {
    if (!tags.length) return getAllResources();
    
    // Firestore doesn't support array contains any with more than 10 values
    // So we'll get all resources and filter on client side
    const snapshot = await getDocs(resourcesCollection);
    
    return snapshot.docs
      .map(convertResource)
      .filter(resource => {
        return resource.tags?.some((tag: string) => tags.includes(tag));
      });
  };