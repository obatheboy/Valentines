import { addMessage, getMessages } from './data-storage.js';

export default async function handler(req, res) {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method === 'POST') {
        try {
            const { name, message, timestamp } = req.body;
            
            if (!name || !message) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Please enter your name and message' 
                });
            }
            
            const newMessage = addMessage({
                name: name.trim(),
                message: message.trim(),
                timestamp: timestamp || new Date().toISOString()
            });
            
            console.log('💌 Message saved:', newMessage);
            
            return res.status(200).json({ 
                success: true, 
                message: 'Message sent successfully!',
                id: newMessage.id,
                data: newMessage
            });
            
        } catch (error) {
            console.error('Error saving message:', error);
            return res.status(500).json({ 
                success: false, 
                error: 'Failed to save message' 
            });
        }
    }
    
    // Handle GET requests
    if (req.method === 'GET') {
        try {
            const messages = getMessages();
            console.log('📨 Returning', messages.length, 'messages');
            return res.status(200).json(messages);
        } catch (error) {
            console.error('Error getting messages:', error);
            return res.status(500).json({ 
                success: false, 
                error: 'Failed to get messages' 
            });
        }
    }
    
    return res.status(405).json({ 
        success: false, 
        error: 'Method not allowed' 
    });
}