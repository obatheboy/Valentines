// Responses are stored in global.valentineResponses

export default async function handler(req, res) {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method === 'GET') {
        try {
            // Get from global storage
            const responses = global.valentineResponses || [];
            
            // Sort by newest first
            const sortedResponses = responses.sort((a, b) => 
                new Date(b.timestamp) - new Date(a.timestamp)
            );
            
            console.log('📊 Returning', sortedResponses.length, 'responses');
            
            return res.status(200).json(sortedResponses);
            
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