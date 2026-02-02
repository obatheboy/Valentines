import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'api', 'data.json');

// Read data from file
export function readData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data:', error);
        return { messages: [], responses: [], lastUpdated: new Date().toISOString() };
    }
}

// Write data to file
export function writeData(data) {
    try {
        data.lastUpdated = new Date().toISOString();
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing data:', error);
        return false;
    }
}

// Add a message
export function addMessage(messageData) {
    const data = readData();
    const newMessage = {
        id: Date.now().toString(),
        name: messageData.name || 'Anonymous',
        message: messageData.message || '',
        timestamp: messageData.timestamp || new Date().toISOString(),
        replied: false
    };
    
    data.messages.push(newMessage);
    writeData(data);
    return newMessage;
}

// Add a response
export function addResponse(responseData) {
    const data = readData();
    const newResponse = {
        id: Date.now().toString(),
        answer: responseData.answer || 'NO',
        name: responseData.name || 'Anonymous',
        timestamp: responseData.timestamp || new Date().toISOString()
    };
    
    data.responses.push(newResponse);
    writeData(data);
    return newResponse;
}

// Get all messages
export function getMessages() {
    return readData().messages;
}

// Get all responses
export function getResponses() {
    return readData().responses;
}