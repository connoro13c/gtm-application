const API_BASE_URL = '/api';

export const createSession = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId })
    });
    
    if (!response.ok) {
      throw new Error('Failed to create session');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating wizard session:', error);
    throw error;
  }
};

export const updateSession = async (sessionId, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update session');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating wizard session:', error);
    throw error;
  }
};

export const getSession = async (sessionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch session');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching wizard session:', error);
    throw error;
  }
};

export const getUserSessions = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions?userId=${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user sessions');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    throw error;
  }
};

export const saveAsDraft = async (sessionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/draft`, {
      method: 'PUT'
    });
    
    if (!response.ok) {
      throw new Error('Failed to save session as draft');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving session as draft:', error);
    throw error;
  }
};

export const completeSession = async (sessionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/complete`, {
      method: 'PUT'
    });
    
    if (!response.ok) {
      throw new Error('Failed to complete session');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error completing session:', error);
    throw error;
  }
};

export const validateSession = async (sessionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/validate`);
    
    if (!response.ok) {
      throw new Error('Failed to validate session');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error validating session:', error);
    throw error;
  }
}; 