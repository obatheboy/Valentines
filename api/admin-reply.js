let replies = [];

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { originalMessageId, userName, reply, timestamp } = req.body;
        
        if (!userName || !reply) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const replyObj = {
            id: Date.now().toString(),
            originalMessageId,
            userName,
            reply: reply.trim(),
            timestamp: timestamp || new Date().toISOString(),
        };
        
        replies.push(replyObj);
        
        console.log('Admin reply saved:', replyObj);
        
        return res.status(200).json({ 
            success: true, 
            message: 'Reply sent successfully'
        });
        
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}