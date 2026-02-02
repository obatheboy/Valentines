// This would connect to a database in production
// For demo, we'll use a global variable (resets on server restart)

// In-memory storage
let responses = [];

// Initialize with some sample data for demo
if (responses.length === 0) {
    responses = [
        {
            id: '1',
            answer: 'YES',
            name: 'Sarah',
            message: 'I would love to!',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            ip: '127.0.0.1'
        },
        {
            id: '2',
            answer: 'MAYBE',
            name: 'Emily',
            message: 'Let me think about it',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            ip: '127.0.0.1'
        }
    ];
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        // In production, fetch from database
        // For demo, return the in-memory responses
        
        return res.status(200).json(responses);
        
    } catch (error) {
        console.error('Error fetching responses:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}