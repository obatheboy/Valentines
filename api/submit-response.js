// Global storage for responses
if (!global.valentineResponses) {
    global.valentineResponses = [];
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
            const { answer, name, timestamp } = req.body;
            
            if (!answer || !name) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Missing answer or name' 
                });
            }
            
            const response = {
                id: Date.now().toString(),
                answer: answer.toUpperCase(),
                name: name.trim(),
                timestamp: timestamp || new Date().toISOString(),
            };
            
            // Add to global storage
            global.valentineResponses.push(response);
            
            // Keep only last 50 responses
            if (global.valentineResponses.length > 50) {
                global.valentineResponses = global.valentineResponses.slice(-50);
            }
            
            console.log('✅ Response saved:', name, '-', answer);
            
            return res.status(200).json({ 
                success: true, 
                message: 'Response saved'
            });
            
        } catch (error) {
            console.error('Error saving response:', error);
            return res.status(500).json({ 
                success: false, 
                error: 'Failed to save response' 
            });
        }
    }
    
    // Handle GET requests (for admin)
    if (req.method === 'GET') {
        try {
            const responses = global.valentineResponses || [];
            return res.status(200).json(responses);
        } catch (error) {
            console.error('Error fetching responses:', error);
            return res.status(500).json({ 
                success: false, 
                error: 'Failed to fetch responses' 
            });
        }
    }
    
    return res.status(405).json({ 
        success: false, 
        error: 'Method not allowed' 
    });
}