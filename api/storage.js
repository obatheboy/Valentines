// Simple in-memory storage for Valentine's Day
// Data persists for the duration of the serverless function's lifecycle

let storage = {
  messages: [],
  responses: [],
  initialized: false
};

// Initialize with some test data if empty
function initializeStorage() {
  if (!storage.initialized) {
    storage.messages = [];
    storage.responses = [];
    storage.initialized = true;
    console.log('📦 Storage initialized');
  }
}

export function getMessages() {
  initializeStorage();
  return storage.messages;
}

export function getResponses() {
  initializeStorage();
  return storage.responses;
}

export function addMessage(message) {
  initializeStorage();
  const newMessage = {
    id: Date.now().toString(),
    name: message.name || 'Anonymous',
    message: message.message || '',
    timestamp: message.timestamp || new Date().toISOString(),
    replied: false
  };
  
  storage.messages.push(newMessage);
  console.log('💌 Message added to storage:', newMessage.name);
  return newMessage;
}

export function addResponse(response) {
  initializeStorage();
  const newResponse = {
    id: Date.now().toString(),
    answer: response.answer || 'NO',
    name: response.name || 'Anonymous',
    timestamp: response.timestamp || new Date().toISOString()
  };
  
  storage.responses.push(newResponse);
  console.log('✅ Response added to storage:', newResponse.name, '-', newResponse.answer);
  return newResponse;
}

// Export storage for debugging
export function getStorage() {
  return storage;
}