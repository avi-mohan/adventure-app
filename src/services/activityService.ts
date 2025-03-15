// src/services/activityService.ts
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
    Timestamp, 
    serverTimestamp 
  } from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { db, storage } from './firebase';
  import { Activity, ActivityFormData } from '../models/Activity';
  
  const COLLECTION_NAME = 'activities';
  const activitiesCollection = collection(db, COLLECTION_NAME);
  
  // Convert Firestore document to Activity model
  const convertActivity = (doc: any): Activity => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  };
  
  // Get all activities
  export const getAllActivities = async (): Promise<Activity[]> => {
    const snapshot = await getDocs(activitiesCollection);
    return snapshot.docs.map(convertActivity);
  };
  
  // Get featured activities
  export const getFeaturedActivities = async (limitCount = 6): Promise<Activity[]> => {
    const q = query(
      activitiesCollection,
      where('featured', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(convertActivity);
  };
  
  // Get activities by age range
  export const getActivitiesByAgeRange = async (ageRanges: string[]): Promise<Activity[]> => {
    if (!ageRanges.length) return getAllActivities();
    
    // This would need a more complex query or client-side filtering
    // since Firestore can't do complex array contains operations
    const snapshot = await getDocs(activitiesCollection);
    return snapshot.docs
      .map(convertActivity)
      .filter(activity => {
        // Simplified age range matching - in a real app you would want more sophisticated logic
        return ageRanges.some(range => activity.ageRange.includes(range));
      });
  };
  
  // Get activity by ID
  export const getActivityById = async (id: string): Promise<Activity | null> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return convertActivity(docSnap);
  };
  
  // Create new activity
  export const createActivity = async (
    activityData: ActivityFormData,
    imageFile?: File
  ): Promise<Activity> => {
    let imageUrl = activityData.imageUrl;
    
    // Upload image if provided
    if (imageFile) {
      const storageRef = ref(storage, `activities/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(snapshot.ref);
    }
    
    const activityWithDates = {
      ...activityData,
      imageUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(activitiesCollection, activityWithDates);
    
    return {
      id: docRef.id,
      ...activityData,
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  };
  
  // Update activity
  export const updateActivity = async (
    id: string,
    activityData: Partial<ActivityFormData>,
    imageFile?: File
  ): Promise<Activity> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    let updateData = { ...activityData };
    
    // Upload new image if provided
    if (imageFile) {
      const storageRef = ref(storage, `activities/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      updateData.imageUrl = await getDownloadURL(snapshot.ref);
    }
    
    updateData.updatedAt = serverTimestamp() as any;
    
    await updateDoc(docRef, updateData);
    
    const updatedDoc = await getDoc(docRef);
    return convertActivity(updatedDoc);
  };
  
  // Delete activity
  export const deleteActivity = async (id: string): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  };
  
  // Search activities
  export const searchActivities = async (
    searchTerm: string, 
    filters: Record<string, any> = {}
  ): Promise<Activity[]> => {
    // In Firestore, there's no direct way to do a text search across fields
    // For a full-text search, you might want to use Algolia or a similar service
    // This is a simplified implementation
    
    const snapshot = await getDocs(activitiesCollection);
    
    return snapshot.docs
      .map(convertActivity)
      .filter(activity => {
        const matchesSearch = !searchTerm || 
          activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.description.toLowerCase().includes(searchTerm.toLowerCase());
          
        // Apply additional filters
        const matchesFilters = Object.entries(filters).every(([key, value]) => {
          if (!value || value.length === 0) return true;
          
          if (key === 'ageRange') {
            // Custom age range filter
            return value.some((range: string) => activity.ageRange.includes(range));
          }
          
          if (key === 'priceMax') {
            return activity.price <= value;
          }
          
          if (key === 'priceMin') {
            return activity.price >= value;
          }
          
          return true;
        });
        
        return matchesSearch && matchesFilters;
      });
  };