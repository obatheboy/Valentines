// In-memory storage (for demo - in production use a database)
const responses = [];

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { answer, name, message, timestamp, ip } = req.body;
        
        // Validate input
        if (!answer || !name) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const response = {
            id: Date.now().toString(),
            answer: answer.toUpperCase(),
            name: name.trim(),
            message: message ? message.trim() : '',
            timestamp: timestamp || new Date().toISOString(),
            ip: ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            userAgent: req.headers['user-agent']
        };
        
        // Store response (in memory - will reset on server restart)
        responses.push(response);
        
        // Keep only last 100 responses to prevent memory issues
        if (responses.length > 100) {
            responses.splice(0, responses.length - 100);
        }
        
        console.log('Response received:', response);
        
        return res.status(200).json({ 
            success: true, 
            message: 'Response saved successfully',
            id: response.id
        });
        
    } catch (error) {
        console.error('Error saving response:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// For serverless, we can't maintain state between invocations
// In production, you'd use a database like MongoDB, PostgreSQL, or Vercel KV