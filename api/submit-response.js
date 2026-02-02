import { addResponse, getResponses } from './data-storage.js';

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
            
            const newResponse = addResponse({
                answer: answer.toUpperCase(),
                name: name.trim(),
                timestamp: timestamp || new Date().toISOString()
            });
            
            console.log('✅ Response saved:', newResponse);
            
            return res.status(200).json({ 
                success: true, 
                message: 'Response saved',
                id: newResponse.id,
                data: newResponse
            });
            
        } catch (error) {
            console.error('Error saving response:', error);
            return res.status(500).json({ 
                success: false, 
                error: 'Failed to save response' 
            });
        }
    }
    
    // Handle GET requests
    if (req.method === 'GET') {
        try {
            const responses = getResponses();
            console.log('📊 Returning', responses.length, 'responses');
            return res.status(200).json(responses);
        } catch (error) {
            console.error('Error getting responses:', error);
            return res.status(500).json({ 
                success: false, 
                error: 'Failed to get responses' 
            });
        }
    }
    
    return res.status(405).json({ 
        success: false, 
        error: 'Method not allowed' 
    });
}