// src/services/leadService.ts
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
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Lead, LeadFormData } from '../models/Lead';
import { trackEvent } from './firebase';

const COLLECTION_NAME = 'leads';
const leadsCollection = collection(db, COLLECTION_NAME);

// Convert Firestore document to Lead model
const convertLead = (doc: any): Lead => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
};

// Get all leads
export const getAllLeads = async (): Promise<Lead[]> => {
  const snapshot = await getDocs(leadsCollection);
  return snapshot.docs.map(convertLead);
};

// Get lead by ID
export const getLeadById = async (id: string): Promise<Lead | null> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return convertLead(docSnap);
};

// Get leads by activity ID
export const getLeadsByActivity = async (activityId: string): Promise<Lead[]> => {
  const q = query(
    leadsCollection,
    where('activityId', '==', activityId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(convertLead);
};

// Create new lead
export const createLead = async (leadData: LeadFormData): Promise<Lead> => {
  try {
    console.log('Creating lead with data:', leadData);
    
    const leadWithDates = {
      ...leadData,
      status: leadData.status || 'new',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(leadsCollection, leadWithDates);
    console.log('Lead created with ID:', docRef.id);
    
    // Track lead capture event for analytics
    trackEvent('lead_captured', {
      activity_id: leadData.activityId,
      activity_name: leadData.activityName
    });
    
    return {
      id: docRef.id,
      ...leadData,
      status: leadData.status || 'new',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  } catch (error) {
    console.error('Error creating lead in Firestore:', error);
    throw error;
  }
};

// Update lead
export const updateLead = async (id: string, leadData: Partial<LeadFormData>): Promise<Lead> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  
  const updateData = {
    ...leadData,
    updatedAt: serverTimestamp()
  };
  
  await updateDoc(docRef, updateData);
  
  const updatedDoc = await getDoc(docRef);
  return convertLead(updatedDoc);
};

// Delete lead
export const deleteLead = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};

// Get leads statistics
export const getLeadsStatistics = async (): Promise<{
  total: number;
  newLeads: number;
  contacted: number;
  converted: number;
  lost: number;
}> => {
  const snapshot = await getDocs(leadsCollection);
  const leads = snapshot.docs.map(convertLead);
  
  return {
    total: leads.length,
    newLeads: leads.filter(lead => lead.status === 'new').length,
    contacted: leads.filter(lead => lead.status === 'contacted').length,
    converted: leads.filter(lead => lead.status === 'converted').length,
    lost: leads.filter(lead => lead.status === 'lost').length
  };
};

// Mark lead as contacted
export const markLeadAsContacted = async (id: string, notes?: string): Promise<Lead> => {
  return updateLead(id, { status: 'contacted', notes });
};

// Mark lead as converted
export const markLeadAsConverted = async (id: string, notes?: string): Promise<Lead> => {
  const lead = await getLeadById(id);
  
  if (lead) {
    // Track conversion event for analytics
    trackEvent('lead_converted', {
      activity_id: lead.activityId,
      activity_name: lead.activityName
    });
  }
  
  return updateLead(id, { status: 'converted', notes });
};

// Mark lead as lost
export const markLeadAsLost = async (id: string, notes?: string): Promise<Lead> => {
  return updateLead(id, { status: 'lost', notes });
};