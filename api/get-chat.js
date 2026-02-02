// Import the shared chat messages array
// In production, this would query a database

let chatMessages = [];

// Sample data
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
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { user } = req.query;
        
        // Filter messages based on user
        let filteredMessages = chatMessages;
        
        if (user === 'admin') {
            // Admin sees all messages
            filteredMessages = chatMessages;
        } else {
            // User sees messages where they're sender or receiver
            filteredMessages = chatMessages.filter(
                msg => msg.sender === user || msg.receiver === user || msg.sender === 'admin'
            );
        }
        
        // Sort by timestamp (oldest first)
        filteredMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        return res.status(200).json({ 
            messages: filteredMessages 
        });
        
    } catch (error) {
        console.error('Error fetching chat:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}