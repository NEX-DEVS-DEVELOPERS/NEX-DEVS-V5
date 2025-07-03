import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to settings storage file
const SETTINGS_FILE_PATH = path.join(process.cwd(), 'data', 'chatbot-settings.json');

// Default settings
const DEFAULT_SETTINGS = {
  enabled: true,
  model: 'deepseek/deepseek-r1-0528:free',
  lastUpdated: new Date().toISOString()
};

// Get current settings - improved for faster response
function getSettings() {
  try {
    // Always read directly from file to ensure freshest data
    if (!fs.existsSync(SETTINGS_FILE_PATH)) {
      return DEFAULT_SETTINGS;
    }
    
    // Use synchronous file reading for speed in this case
    const settingsData = fs.readFileSync(SETTINGS_FILE_PATH, 'utf8');
    try {
      const parsedSettings = JSON.parse(settingsData);
      return {
        enabled: parsedSettings.enabled,
        model: parsedSettings.model || DEFAULT_SETTINGS.model,
        lastUpdated: parsedSettings.lastUpdated || DEFAULT_SETTINGS.lastUpdated
      };
    } catch (parseError) {
      console.error('Error parsing settings JSON:', parseError);
      return DEFAULT_SETTINGS;
    }
  } catch (error) {
    console.error('Error reading settings:', error);
    return DEFAULT_SETTINGS;
  }
}

// Handle GET requests to retrieve chatbot enabled status
export async function GET(request: NextRequest) {
  try {
    // Always get fresh settings
    const settings = getSettings();
    
    // Set extremely aggressive no-cache headers
    const headers = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store',
      'X-Accel-Expires': '0',
      'X-Response-Time': Date.now().toString()
    };
    
    return NextResponse.json({
      enabled: settings.enabled !== undefined ? settings.enabled : true,
      model: settings.model || 'deepseek/deepseek-r1-0528:free',
      lastUpdated: settings.lastUpdated || new Date().toISOString()
    }, { headers });
  } catch (error) {
    console.error('Error in GET public settings:', error);
    
    // Return default settings in case of error
    return NextResponse.json({
      enabled: true,
      model: 'deepseek/deepseek-r1-0528:free',
      lastUpdated: new Date().toISOString()
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }
} 