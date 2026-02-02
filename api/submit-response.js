let responses = [];

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { answer, name, timestamp } = req.body;
        
        if (!answer || !name) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const response = {
            id: Date.now().toString(),
            answer: answer.toUpperCase(),
            name: name.trim(),
            timestamp: timestamp || new Date().toISOString(),
        };
        
        responses.push(response);
        
        // Keep only last 50 responses
        if (responses.length > 50) {
            responses = responses.slice(-50);
        }
        
        console.log('Response saved:', response);
        
        return res.status(200).json({ 
            success: true, 
            message: 'Response saved'
        });
        
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}