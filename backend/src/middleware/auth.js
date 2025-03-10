/**
 * Authentication middleware for the GTM Application
 * Verifies JWT tokens and adds user data to request object
 */

import jwt from 'jsonwebtoken';

/**
 * Middleware to authenticate JWT tokens
 * Adds the decoded user information to the request object
 */
export const authenticateJWT = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided, authorization denied' });
  }
  
  // Check if the header has the correct format
  const parts = authHeader.split(' ');
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Token format is invalid' });
  }
  
  const token = parts[1];
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Add user data to request
    req.user = decoded;
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired' });
    }
    
    console.error('JWT verification error:', error);
    res.status(401).json({ error: 'Token is invalid' });
  }
};

/**
 * Middleware to check if the user has admin role
 * Must be used after authenticateJWT
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied. Admin privileges required' });
  }
  
  next();
};

/**
 * Middleware to check if the user has specific roles
 * Must be used after authenticateJWT
 * @param {string[]} roles - Array of allowed roles
 */
export const requireRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. Insufficient privileges' });
    }
    
    next();
  };
};
