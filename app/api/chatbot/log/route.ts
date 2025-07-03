import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to logs storage file
const LOGS_FILE_PATH = path.join(process.cwd(), 'data', 'chatbot-logs.json');

// Ensure logs file exists
function ensureLogsFile() {
  try {
    // Create the directory if it doesn't exist
    const dir = path.dirname(LOGS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Create the file with empty array if it doesn't exist
    if (!fs.existsSync(LOGS_FILE_PATH)) {
      fs.writeFileSync(LOGS_FILE_PATH, JSON.stringify([]));
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring logs file:', error);
    return false;
  }
}

// Get current logs
function getLogs() {
  try {
    if (!fs.existsSync(LOGS_FILE_PATH)) {
      ensureLogsFile();
      return [];
    }
    
    const logsData = fs.readFileSync(LOGS_FILE_PATH, 'utf8');
    return JSON.parse(logsData);
  } catch (error) {
    console.error('Error reading logs:', error);
    return [];
  }
}

// Add a new log entry
function addLogEntry(logData: any) {
  try {
    ensureLogsFile();
    
    // Get current logs
    const logs = getLogs();
    
    // Add new log entry
    logs.push({
      ...logData,
      // Ensure these fields exist
      timestamp: logData.timestamp || Date.now(),
      request: logData.request || '',
      response: logData.response || '',
      responseTime: logData.responseTime || 0,
      status: logData.status || 'unknown'
    });
    
    // Keep only the most recent 1000 logs
    if (logs.length > 1000) {
      logs.splice(0, logs.length - 1000);
    }
    
    // Write logs back to file
    fs.writeFileSync(LOGS_FILE_PATH, JSON.stringify(logs));
    
    return true;
  } catch (error) {
    console.error('Error adding log entry:', error);
    return false;
  }
}

// Handle POST requests to log chatbot interactions
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.request || !body.status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Add log entry
    const success = addLogEntry(body);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to add log entry' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in POST log:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 