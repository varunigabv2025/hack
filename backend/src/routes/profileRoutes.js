import express from 'express';
const router = express.Router();
import { createProfile, getProfile } from '../controllers/profileController.js';

/**
 * PROFILE ROUTES
 * Mounted at /api/profile
 */

// POST /api/profile - Create new user profile
router.post('/', createProfile);

// GET /api/profile/:userId - Get user profile
router.get('/:userId', getProfile);

export default router;

