export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { username, password } = req.body;
        
        // In production, use proper authentication
        const isValid = username === 'admin' && password === 'valentine2024';
        
        return res.status(200).json({ 
            success: isValid,
            message: isValid ? 'Login successful' : 'Invalid credentials'
        });
        
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}