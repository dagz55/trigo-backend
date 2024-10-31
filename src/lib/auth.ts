const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const signIn = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/azure/login`, {
      method: 'POST',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Azure login error:', error);
    throw new Error('Failed to authenticate with Azure');
  }
}

export const signOut = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/azure/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Logout failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Azure logout error:', error);
    throw new Error('Failed to logout from Azure');
  }
}

export const getSession = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/azure/status`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.isConnected ? data.account : null;
  } catch (error) {
    return null;
  }
}
