// In-memory storage for chat messages
let chatMessages = [];

// Add some sample messages
if (chatMessages.length === 0) {
    chatMessages = [
        {
            id: '1',
            sender: 'admin',
            receiver: 'user',
            message: 'Hello! Thanks for your response!',
            timestamp: new Date(Date.now() - 1800000).toISOString()
        },
        {
            id: '2',
            sender: 'user',
            receiver: 'admin',
            message: 'Thank you for asking!',
            timestamp: new Date(Date.now() - 1200000).toISOString()
        }
    ];
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { sender, receiver, message, timestamp } = req.body;
        
        // Validate input
        if (!sender || !receiver || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const chatMessage = {
            id: Date.now().toString(),
            sender,
            receiver,
            message: message.trim(),
            timestamp: timestamp || new Date().toISOString()
        };
        
        // Store message
        chatMessages.push(chatMessage);
        
        // Keep only last 50 messages
        if (chatMessages.length > 50) {
            chatMessages.splice(0, chatMessages.length - 50);
        }
        
        console.log('Chat message saved:', chatMessage);
        
        return res.status(200).json({ 
            success: true, 
            message: 'Message sent successfully',
            id: chatMessage.id
        });
        
    } catch (error) {
        console.error('Error saving message:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}