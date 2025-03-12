/**
 * Authentication routes for the GTM Application
 * Handles user authentication and authorization
 */

import express from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route POST /api/auth/login
 * @desc Authenticate user and get token
 * @access Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // In a real application, you would use bcrypt to compare passwords
    // For this example, we're using a simplified approach
    // TODO: Implement proper password hashing and comparison
    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    // Return user info and token
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

/**
 * @route GET /api/auth/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

/**
 * @route PUT /api/auth/me
 * @desc Update current user profile
 * @access Private
 */
router.put('/me', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, currentPassword, newPassword } = req.body;
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Prepare update data
    const updateData = {};
    
    if (name) {
      updateData.name = name;
    }
    
    if (email && email !== user.email) {
      // Check if email is already in use
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      
      if (existingUser) {
        return res.status(400).json({ error: 'Email is already in use' });
      }
      
      updateData.email = email;
    }
    
    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to set a new password' });
      }
      
      // In a real application, you would use bcrypt to compare passwords
      // For this example, we're using a simplified approach
      if (currentPassword !== user.password) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }
      
      // TODO: Hash the new password before storing
      updateData.password = newPassword;
    }
    
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public (typically restricted in production)
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'USER' } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // TODO: Hash password before storing
    
    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // In production, this should be hashed
        role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    
    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

export default router;
