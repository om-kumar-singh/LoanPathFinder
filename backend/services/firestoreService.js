import { db } from '../firebaseAdmin.js';
import { Timestamp } from 'firebase-admin/firestore';

// Collection names
const COLLECTIONS = {
  SIMULATIONS: 'simulations',
  USERS: 'users'
};

/**
 * Save a simulation to Firestore
 */
export const saveSimulation = async (userId, data) => {
  try {
    const simulationData = {
      userId,
      financialData: data.financialData || {},
      score: data.score || 0,
      explanation: data.explanation || {},
      riskCategory: data.riskCategory || 'Moderate',
      estimatedAPR: data.estimatedAPR || 0,
      timestamp: data.timestamp ? Timestamp.fromDate(new Date(data.timestamp)) : Timestamp.now()
    };
    
    const docRef = await db.collection(COLLECTIONS.SIMULATIONS).add(simulationData);
    return {
      _id: docRef.id,
      id: docRef.id,
      ...simulationData,
      timestamp: simulationData.timestamp.toDate().toISOString()
    };
  } catch (error) {
    console.error('Error saving simulation:', error);
    throw error;
  }
};

/**
 * Get user simulations with pagination and filters
 */
export const getUserSimulations = async (userId, options = {}) => {
  try {
    const {
      page = 1,
      limit = 50,
      startDate,
      endDate
    } = options;
    
    let query = db.collection(COLLECTIONS.SIMULATIONS)
      .where('userId', '==', userId);
    
    // Date range filtering
    if (startDate) {
      query = query.where('timestamp', '>=', Timestamp.fromDate(new Date(startDate)));
    }
    if (endDate) {
      query = query.where('timestamp', '<=', Timestamp.fromDate(new Date(endDate)));
    }
    
    // Order by timestamp descending
    query = query.orderBy('timestamp', 'desc');
    
    // Pagination
    const skip = (page - 1) * limit;
    if (skip > 0) {
      // For pagination, we'd need to get the last document from previous page
      // This is a simplified version - for production, use cursor-based pagination
      const allDocs = await query.get();
      const startIndex = skip;
      const endIndex = startIndex + limit;
      const paginatedDocs = allDocs.docs.slice(startIndex, endIndex);
      
    const simulations = paginatedDocs.map(doc => {
      const data = doc.data();
      return {
        _id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : (data.timestamp || new Date().toISOString())
      };
    });
      
      return {
        simulations,
        pagination: {
          page,
          limit,
          total: allDocs.size,
          pages: Math.ceil(allDocs.size / limit)
        }
      };
    } else {
      // First page
      const snapshot = await query.limit(limit).get();
      const allDocs = await query.get(); // Get total count
      
      const simulations = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          _id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : (data.timestamp || new Date().toISOString())
        };
      });
      
      return {
        simulations,
        pagination: {
          page,
          limit,
          total: allDocs.size,
          pages: Math.ceil(allDocs.size / limit)
        }
      };
    }
  } catch (error) {
    console.error('Error getting user simulations:', error);
    throw error;
  }
};

/**
 * Delete a simulation
 */
export const deleteSimulation = async (simulationId) => {
  try {
    await db.collection(COLLECTIONS.SIMULATIONS).doc(simulationId).delete();
    return { success: true };
  } catch (error) {
    console.error('Error deleting simulation:', error);
    throw error;
  }
};

/**
 * Get statistics with filters
 */
export const getStatistics = async (filters = {}) => {
  try {
    const { timeRange } = filters;
    
    let query = db.collection(COLLECTIONS.SIMULATIONS);
    
    // Date range filtering
    if (timeRange) {
      const now = new Date();
      let startDate;
      
      if (timeRange === 'week') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (timeRange === 'month') {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (timeRange === 'year') {
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      }
      
      if (startDate) {
        query = query.where('timestamp', '>=', Timestamp.fromDate(startDate));
      }
    }
    
    const snapshot = await query.get();
    const simulations = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        _id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : (data.timestamp ? new Date(data.timestamp) : new Date())
      };
    });
    
    // Calculate statistics
    const totalSimulations = simulations.length;
    const averageScore = simulations.length > 0
      ? simulations.reduce((sum, s) => sum + (s.score || 0), 0) / simulations.length
      : 0;
    
    // Risk distribution
    const riskDistribution = {
      Low: simulations.filter(s => s.riskCategory === 'Low').length,
      Moderate: simulations.filter(s => s.riskCategory === 'Moderate').length,
      High: simulations.filter(s => s.riskCategory === 'High').length
    };
    
    // Trend data (last 6 months)
    const trendData = [];
    const months = 6;
    for (let i = months - 1; i >= 0; i--) {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - i);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      
      const monthSims = simulations.filter(s => {
        let simDate;
        if (s.timestamp?.toDate) {
          simDate = s.timestamp.toDate();
        } else if (s.timestamp) {
          simDate = new Date(s.timestamp);
        } else {
          return false;
        }
        return simDate >= monthStart && simDate < monthEnd;
      });
      
      const monthAvg = monthSims.length > 0
        ? monthSims.reduce((sum, s) => sum + (s.score || 0), 0) / monthSims.length
        : 0;
      
      trendData.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        score: Math.round(monthAvg)
      });
    }
    
    // Success rate (scores >= 70)
    const successRate = simulations.length > 0
      ? (simulations.filter(s => s.score >= 70).length / simulations.length) * 100
      : 0;
    
    return {
      averageScore: Math.round(averageScore * 10) / 10,
      totalSimulations,
      successRate: Math.round(successRate * 10) / 10,
      riskDistribution: [
        { name: 'Low', value: riskDistribution.Low },
        { name: 'Moderate', value: riskDistribution.Moderate },
        { name: 'High', value: riskDistribution.High }
      ],
      trendData
    };
  } catch (error) {
    console.error('Error getting statistics:', error);
    throw error;
  }
};

/**
 * Get user preferences
 */
export const getUserPreferences = async (userId) => {
  try {
    const userDoc = await db.collection(COLLECTIONS.USERS).doc(userId).get();
    
    if (!userDoc.exists) {
      return { loanPreference: 'lowestEMI' }; // Default
    }
    
    const userData = userDoc.data();
    return userData.preferences || { loanPreference: 'lowestEMI' };
  } catch (error) {
    console.error('Error getting user preferences:', error);
    throw error;
  }
};

/**
 * Update user preferences
 */
export const updateUserPreferences = async (userId, preferences) => {
  try {
    const userRef = db.collection(COLLECTIONS.USERS).doc(userId);
    const userDoc = await userRef.get();
    
    const updateData = {
      preferences: {
        ...(userDoc.exists ? userDoc.data().preferences : {}),
        ...preferences
      },
      updatedAt: Timestamp.now()
    };
    
    if (!userDoc.exists) {
      updateData.createdAt = Timestamp.now();
      updateData.firebaseUID = userId;
    }
    
    await userRef.set(updateData, { merge: true });
    return updateData.preferences;
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
};

/**
 * Get user profile
 */
export const getUserProfile = async (userId) => {
  try {
    const userDoc = await db.collection(COLLECTIONS.USERS).doc(userId).get();
    
    if (!userDoc.exists) {
      return {
        name: '',
        gender: '',
        age: null,
        email: ''
      };
    }
    
    const data = userDoc.data();
    return {
      name: data.name || '',
      gender: data.gender || '',
      age: data.age || null,
      email: data.email || ''
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId, profileData) => {
  try {
    const userRef = db.collection(COLLECTIONS.USERS).doc(userId);
    const userDoc = await userRef.get();
    
    const updateData = {
      ...profileData,
      updatedAt: Timestamp.now()
    };
    
    if (!userDoc.exists) {
      updateData.createdAt = Timestamp.now();
      updateData.firebaseUID = userId;
      updateData.preferences = {
        loanPreference: 'lowestEMI'
      };
    }
    
    await userRef.set(updateData, { merge: true });
    
    const updatedDoc = await userRef.get();
    const data = updatedDoc.data();
    return {
      name: data.name || '',
      gender: data.gender || '',
      age: data.age || null,
      email: data.email || ''
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Sync user (create or get user)
 */
export const syncUser = async (firebaseUID, email) => {
  try {
    const userRef = db.collection(COLLECTIONS.USERS).doc(firebaseUID);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      await userRef.set({
        firebaseUID,
        email,
        name: '',
        gender: '',
        age: null,
        preferences: {
          loanPreference: 'lowestEMI'
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    }
    
    const userData = await userRef.get();
    if (!userData.exists) {
      throw new Error('User not found after creation');
    }
    const data = userData.data();
    return {
      id: userData.id,
      _id: userData.id,
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : (data.updatedAt || new Date().toISOString())
    };
  } catch (error) {
    console.error('Error syncing user:', error);
    throw error;
  }
};

