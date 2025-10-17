import axios from 'axios';
import isAxiosError  from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Create a session ID that persists during the user's session
const getSessionId = () => {
  let sessionId = localStorage.getItem('ussd_session_id');
  if (!sessionId) {
    sessionId = `web-session-${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('ussd_session_id', sessionId);
  }
  return sessionId;
};

// Main function to interact with USSD API
export const processUSSD = async (
  phoneNumber: string,
  text: string
): Promise<string> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ussd`, {
      sessionId: getSessionId(),
      serviceCode: '*123#',
      phoneNumber,
      text
    });

    return typeof response.data === 'string' 
      ? response.data 
      : String(response.data);
  } catch (error: any) {
    console.error('USSD API Error:', error);
    if (await isAxiosError(error) && error.response) {
      return `END Error: ${error.response.status} - ${error.response.data}`;
    }
    // Type guard pattern for error handling
    if (error instanceof Error) {
      return `END Error: ${error.message}`;
    } else {
      // Handle case where error is not an Error instance
      return 'END An unknown error occurred';
    }
  }
};

// Clear session
 export const clearUSSDSession = async () => {
  // Get the current session ID before removing it
  const sessionId = localStorage.getItem('ussd_session_id');
  
  // Remove from localStorage
  localStorage.removeItem('ussd_session_id');
  
  // If we had an active session ID, tell the server to clear it
  if (sessionId) {
    try {
      await axios.post(`${API_URL}/reset-session`, { sessionId });
    } catch (error) {
      console.error('Failed to reset session on server:', error);
    }
  }
};
