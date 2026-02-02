import { 
  getMessages, 
  getResponses, 
  addMessage, 
  addResponse,
  getStorage 
} from './storage.js';

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { action, type } = req.query;
  
  console.log(`📦 API Request: ${req.method} ${action || ''} ${type || ''}`);
  
  try {
    // GET ALL DATA
    if (req.method === 'GET' && !action) {
      const data = {
        messages: getMessages(),
        responses: getResponses(),
        timestamp: new Date().toISOString(),
        status: 'success'
      };
      
      console.log(`📊 Returning ${data.messages.length} messages, ${data.responses.length} responses`);
      return res.status(200).json(data);
    }
    
    // GET SPECIFIC DATA
    if (req.method === 'GET' && action === 'get') {
      if (type === 'messages') {
        return res.status(200).json(getMessages());
      }
      if (type === 'responses') {
        return res.status(200).json(getResponses());
      }
      if (type === 'all') {
        return res.status(200).json({
          messages: getMessages(),
          responses: getResponses()
        });
      }
    }
    
    // ADD MESSAGE
    if (req.method === 'POST' && action === 'message') {
      const { name, message, timestamp } = req.body;
      
      if (!name || !message) {
        return res.status(400).json({ 
          success: false, 
          error: 'Name and message required' 
        });
      }
      
      const newMessage = addMessage({
        name: name.trim(),
        message: message.trim(),
        timestamp: timestamp || new Date().toISOString()
      });
      
      return res.status(200).json({
        success: true,
        message: 'Message sent!',
        id: newMessage.id,
        data: newMessage
      });
    }
    
    // ADD RESPONSE
    if (req.method === 'POST' && action === 'response') {
      const { answer, name, timestamp } = req.body;
      
      if (!answer || !name) {
        return res.status(400).json({ 
          success: false, 
          error: 'Answer and name required' 
        });
      }
      
      const newResponse = addResponse({
        answer: answer.toUpperCase(),
        name: name.trim(),
        timestamp: timestamp || new Date().toISOString()
      });
      
      return res.status(200).json({
        success: true,
        message: 'Response saved!',
        id: newResponse.id,
        data: newResponse
      });
    }
    
    // DEBUG ENDPOINT
    if (req.method === 'GET' && action === 'debug') {
      return res.status(200).json({
        storage: getStorage(),
        timestamp: new Date().toISOString(),
        memory: process.memoryUsage()
      });
    }
    
    // DEFAULT: Return all data
    return res.status(200).json({
      messages: getMessages(),
      responses: getResponses(),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ API Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error: ' + error.message 
    });
  }
}