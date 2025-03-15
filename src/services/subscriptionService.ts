// src/services/subscriptionService.ts
import { 
    collection, 
    getDocs, 
    getDoc, 
    doc, 
    addDoc, 
    updateDoc, 
    query, 
    where, 
    serverTimestamp 
  } from 'firebase/firestore';
  import { db } from './firebase';
  import { Subscription, SubscriptionFormData } from '../models/Subscription';
  import { trackEvent } from './firebase';
  
  const COLLECTION_NAME = 'subscriptions';
  const subscriptionsCollection = collection(db, COLLECTION_NAME);
  
  // Convert Firestore document to Subscription model
  const convertSubscription = (doc: any): Subscription => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  };
  
  // Check if email already exists
  export const checkEmailExists = async (email: string): Promise<boolean> => {
    const q = query(
      subscriptionsCollection,
      where('email', '==', email)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  };
  
  // Subscribe a new email
  export const subscribeEmail = async (subscriptionData: SubscriptionFormData): Promise<Subscription | null> => {
    // Check if already subscribed
    const emailExists = await checkEmailExists(subscriptionData.email);
    
    if (emailExists) {
      // Email already exists, we might want to update the subscription or return null
      return null;
    }
    
    const subscriptionWithDates = {
      ...subscriptionData,
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(subscriptionsCollection, subscriptionWithDates);
    
    // Track subscription event for analytics
    trackEvent('newsletter_subscription', {
      source: subscriptionData.subscriptionSource
    });
    
    return {
      id: docRef.id,
      ...subscriptionData,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  };
  
  // Unsubscribe an email
  export const unsubscribeEmail = async (email: string): Promise<boolean> => {
    const q = query(
      subscriptionsCollection,
      where('email', '==', email)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return false;
    }
    
    // Update the first matching document (there should only be one)
    const docRef = doc(db, COLLECTION_NAME, snapshot.docs[0].id);
    await updateDoc(docRef, {
      active: false,
      updatedAt: serverTimestamp()
    });
    
    return true;
  };
  
  // Get all active subscriptions
  export const getAllActiveSubscriptions = async (): Promise<Subscription[]> => {
    const q = query(
      subscriptionsCollection,
      where('active', '==', true)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(convertSubscription);
  };
  
  // Get subscription by ID
  export const getSubscriptionById = async (id: string): Promise<Subscription | null> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return convertSubscription(docSnap);
  };
  
  // Get subscription by email
  export const getSubscriptionByEmail = async (email: string): Promise<Subscription | null> => {
    const q = query(
      subscriptionsCollection,
      where('email', '==', email)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }
    
    return convertSubscription(snapshot.docs[0]);
  };