import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error('⚠️ API key is not set. Please add VITE_GEMINI_API_KEY to your .env file');
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Initialize chat with history support
let chat = null;

export function initializeChat() {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
    });
    
    chat = model.startChat({
      history: [],
    });
    
    console.log('✅ Chat initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Error initializing chat:', error);
    return false;
  }
}

export async function sendMessage(message) {
  if (!API_KEY) {
    throw new Error('API key is not configured. Please check your .env file.');
  }

  try {
    // Initialize chat if not already done
    if (!chat) {
      initializeChat();
    }

    // Send message with chat history
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    
    if (!text || text.trim().length === 0) {
      throw new Error('Empty response received from API');
    }
    
    return text;
  } catch (error) {
    console.error('❌ Error calling Gemini API:', error);
    
    // Provide user-friendly error messages
    if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key')) {
      throw new Error('Invalid API key. Please check your configuration.');
    } else if (error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED')) {
      throw new Error('API quota exceeded. Please try again later.');
    } else if (error.message?.includes('models/gemini-pro')) {
      throw new Error('Model not available. Using updated model.');
    } else if (error.message?.includes('fetch') || error.message?.includes('network')) {
      throw new Error('Network error. Please check your internet connection.');
    } else {
      throw new Error(`Failed to get response: ${error.message}`);
    }
  }
}

// Reset chat history
export function resetChat() {
  chat = null;
  console.log('🔄 Chat history reset');
}
