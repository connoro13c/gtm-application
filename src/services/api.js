/**
 * API service for the GTM Application
 * Handles all API requests to the backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fetch wrapper with authentication and error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} Response data
 */
async function fetchWithAuth(endpoint, options = {}) {
  // Get token from local storage
  const token = localStorage.getItem('auth_token');
  
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Add authorization header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  // Make request
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  // Handle non-2xx responses
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: 'An unknown error occurred',
    }));
    
    throw new Error(error.error || error.message || 'API request failed');
  }
  
  // Parse JSON response
  return response.json();
}

/**
 * Authentication API
 */
export const authApi = {
  /**
   * Login user
   * @param {Object} credentials - User credentials
   * @returns {Promise<Object>} User data and token
   */
  login: (credentials) => {
    return fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  
  /**
   * Register new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} User data and token
   */
  register: (userData) => {
    return fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  getProfile: () => {
    return fetchWithAuth('/auth/me');
  },
  
  /**
   * Update user profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise<Object>} Updated user profile
   */
  updateProfile: (profileData) => {
    return fetchWithAuth('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};

/**
 * Accounts API
 */
export const accountsApi = {
  /**
   * Get all accounts with optional filtering
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Accounts and pagination data
   */
  getAccounts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/accounts?${queryString}`);
  },
  
  /**
   * Get account by ID
   * @param {string} id - Account ID
   * @returns {Promise<Object>} Account data
   */
  getAccount: (id) => {
    return fetchWithAuth(`/accounts/${id}`);
  },
  
  /**
   * Create new account
   * @param {Object} accountData - Account data
   * @returns {Promise<Object>} Created account
   */
  createAccount: (accountData) => {
    return fetchWithAuth('/accounts', {
      method: 'POST',
      body: JSON.stringify(accountData),
    });
  },
  
  /**
   * Update account
   * @param {string} id - Account ID
   * @param {Object} accountData - Updated account data
   * @returns {Promise<Object>} Updated account
   */
  updateAccount: (id, accountData) => {
    return fetchWithAuth(`/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(accountData),
    });
  },
  
  /**
   * Delete account
   * @param {string} id - Account ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteAccount: (id) => {
    return fetchWithAuth(`/accounts/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Scenarios API
 */
export const scenariosApi = {
  /**
   * Get all scenarios
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Scenarios and pagination data
   */
  getScenarios: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchWithAuth(`/scenarios?${queryString}`);
  },
  
  /**
   * Get scenario by ID
   * @param {string} id - Scenario ID
   * @returns {Promise<Object>} Scenario data
   */
  getScenario: (id) => {
    return fetchWithAuth(`/scenarios/${id}`);
  },
  
  /**
   * Create new scenario
   * @param {Object} scenarioData - Scenario data
   * @returns {Promise<Object>} Created scenario
   */
  createScenario: (scenarioData) => {
    return fetchWithAuth('/scenarios', {
      method: 'POST',
      body: JSON.stringify(scenarioData),
    });
  },
  
  /**
   * Update scenario
   * @param {string} id - Scenario ID
   * @param {Object} scenarioData - Updated scenario data
   * @returns {Promise<Object>} Updated scenario
   */
  updateScenario: (id, scenarioData) => {
    return fetchWithAuth(`/scenarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(scenarioData),
    });
  },
  
  /**
   * Delete scenario
   * @param {string} id - Scenario ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteScenario: (id) => {
    return fetchWithAuth(`/scenarios/${id}`, {
      method: 'DELETE',
    });
  },
  
  /**
   * Run scenario model
   * @param {string} id - Scenario ID
   * @returns {Promise<Object>} Scenario results
   */
  runScenario: (id) => {
    return fetchWithAuth(`/scenarios/${id}/run`, {
      method: 'POST',
    });
  },
};

/**
 * Segmentation API
 */
export const segmentationApi = {
  /**
   * Get all segments
   * @returns {Promise<Array>} Segments list
   */
  getSegments: () => {
    return fetchWithAuth('/segmentation/segments');
  },
  
  /**
   * Get segment by ID
   * @param {string} id - Segment ID
   * @returns {Promise<Object>} Segment data
   */
  getSegment: (id) => {
    return fetchWithAuth(`/segmentation/segments/${id}`);
  },
  
  /**
   * Create new segment
   * @param {Object} segmentData - Segment data
   * @returns {Promise<Object>} Created segment
   */
  createSegment: (segmentData) => {
    return fetchWithAuth('/segmentation/segments', {
      method: 'POST',
      body: JSON.stringify(segmentData),
    });
  },
  
  /**
   * Update segment
   * @param {string} id - Segment ID
   * @param {Object} segmentData - Updated segment data
   * @returns {Promise<Object>} Updated segment
   */
  updateSegment: (id, segmentData) => {
    return fetchWithAuth(`/segmentation/segments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(segmentData),
    });
  },
  
  /**
   * Delete segment
   * @param {string} id - Segment ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteSegment: (id) => {
    return fetchWithAuth(`/segmentation/segments/${id}`, {
      method: 'DELETE',
    });
  },
  
  /**
   * Auto-segment accounts based on criteria
   * @param {Object} criteria - Segmentation criteria
   * @returns {Promise<Object>} Segmentation results
   */
  autoSegment: (criteria) => {
    return fetchWithAuth('/segmentation/auto-segment', {
      method: 'POST',
      body: JSON.stringify({ criteria }),
    });
  },
};

/**
 * Insights API
 */
export const insightsApi = {
  /**
   * Get dashboard insights
   * @returns {Promise<Object>} Dashboard data
   */
  getDashboardInsights: () => {
    return fetchWithAuth('/insights/dashboard');
  },
  
  /**
   * Get predictive insights for an account
   * @param {string} accountId - Account ID
   * @returns {Promise<Object>} Account predictions
   */
  getAccountPredictions: (accountId) => {
    return fetchWithAuth(`/insights/predictions/${accountId}`);
  },
  
  /**
   * Get territory analysis
   * @returns {Promise<Object>} Territory analysis data
   */
  getTerritoryAnalysis: () => {
    return fetchWithAuth('/insights/territory-analysis');
  },
};

export default {
  auth: authApi,
  accounts: accountsApi,
  scenarios: scenariosApi,
  segmentation: segmentationApi,
  insights: insightsApi,
};
