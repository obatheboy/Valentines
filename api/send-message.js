// Global storage for messages
if (!global.valentineMessages) {
    global.valentineMessages = [];
}

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
            
            const newMessage = {
                id: Date.now().toString(),
                name: name.trim(),
                message: message.trim(),
                timestamp: timestamp || new Date().toISOString(),
                replied: false
            };
            
            // Add to global storage
            global.valentineMessages.push(newMessage);
            
            // Keep only last 100 messages
            if (global.valentineMessages.length > 100) {
                global.valentineMessages = global.valentineMessages.slice(-100);
            }
            
            console.log('💌 Message saved from:', name);
            
            return res.status(200).json({ 
                success: true, 
                message: 'Message sent successfully!',
                id: newMessage.id
            });
            
        } catch (error) {
            console.error('Error saving message:', error);
            return res.status(500).json({ 
                success: false, 
                error: 'Failed to save message' 
            });
        }
    }
    
    // Handle GET requests (for admin)
    if (req.method === 'GET') {
        try {
            const messages = global.valentineMessages || [];
            return res.status(200).json(messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
            return res.status(500).json({ 
                success: false, 
                error: 'Failed to fetch messages' 
            });
        }
    }
    
    return res.status(405).json({ 
        success: false, 
        error: 'Method not allowed' 
    });
}