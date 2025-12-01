import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

console.log('🔑 API Key loaded:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'NOT FOUND');

if (!API_KEY) {
  console.error('⚠️ API key is not set. Please add VITE_GEMINI_API_KEY to your .env file');
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Initialize chat with history support
let chat = null;

export function initializeChat() {
  try {
    console.log('🚀 Initializing chat with gemini-1.5-flash model...');
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
    });
    
    chat = model.startChat({
      history: [],
    });
    
    console.log('✅ Chat initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Error initializing chat:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return false;
  }
}

export async function sendMessage(message) {
  console.log('📤 Sending message:', message);
  
  if (!API_KEY) {
    const error = 'API key is not configured. Please check your .env file.';
    console.error('❌', error);
    throw new Error(error);
  }

  try {
    // Initialize chat if not already done
    if (!chat) {
      console.log('🔄 Chat not initialized, initializing now...');
      initializeChat();
    }

    console.log('⏳ Waiting for API response...');
    
    // Send message with chat history
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Response received:', text.substring(0, 100) + '...');
    
    if (!text || text.trim().length === 0) {
      throw new Error('Empty response received from API');
    }
    
    return text;
  } catch (error) {
    console.error('❌ Error calling Gemini API:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      response: error.response,
      status: error.status,
      statusText: error.statusText
    });
    
    // Provide user-friendly error messages
    if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key not valid')) {
      throw new Error('Invalid API key. Please check your configuration.');
    } else if (error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED')) {
      throw new Error('API quota exceeded. Please try again later.');
    } else if (error.message?.includes('models/gemini-pro')) {
      throw new Error('Model not available. Using updated model.');
    } else if (error.message?.includes('fetch') || error.message?.includes('network')) {
      throw new Error('Network error. Please check your internet connection.');
    } else if (error.status === 404) {
      throw new Error('Model not found. Please update the package.');
    } else {
      throw new Error(`API Error: ${error.message || 'Unknown error'}`);
    }
  }
}

// Reset chat history
export function resetChat() {
  chat = null;
  console.log('🔄 Chat history reset');
}
