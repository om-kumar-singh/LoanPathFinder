import express from 'express';
import {
  syncUser,
  getUserPreferences,
  updateUserPreferences
} from '../services/firestoreService.js';

const router = express.Router();

// Get or create user
router.post('/sync', async (req, res) => {
  try {
    const { firebaseUID, email } = req.body;
    
    if (!firebaseUID || !email) {
      return res.status(400).json({ error: 'firebaseUID and email are required' });
    }
    
    const user = await syncUser(firebaseUID, email);
    res.json(user);
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user preferences
router.get('/:uid/preferences', async (req, res) => {
  try {
    const preferences = await getUserPreferences(req.params.uid);
    res.json(preferences);
  } catch (error) {
    console.error('Error getting preferences:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update user preferences
router.put('/:uid/preferences', async (req, res) => {
  try {
    const preferences = await updateUserPreferences(req.params.uid, req.body);
    res.json(preferences);
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

