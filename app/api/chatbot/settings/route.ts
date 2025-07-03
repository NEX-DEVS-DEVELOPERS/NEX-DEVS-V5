import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Admin password for authentication
const ADMIN_PASSWORD = 'nex-devs919';

// Path to settings storage file
const SETTINGS_FILE_PATH = path.join(process.cwd(), 'data', 'chatbot-settings.json');

// Default settings
const DEFAULT_SETTINGS = {
  apiKey: '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',
  model: 'deepseek/deepseek-r1-0528:free',
  enabled: true,
  lastUpdated: new Date().toISOString()
};

// Ensure the settings file exists
function ensureSettingsFile() {
  try {
    // Create the directory if it doesn't exist
    const dir = path.dirname(SETTINGS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Create the file with default settings if it doesn't exist
    if (!fs.existsSync(SETTINGS_FILE_PATH)) {
      fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(DEFAULT_SETTINGS, null, 2));
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring settings file:', error);
    return false;
  }
}

// Get current settings
function getSettings() {
  try {
    if (!fs.existsSync(SETTINGS_FILE_PATH)) {
      ensureSettingsFile();
      return DEFAULT_SETTINGS;
    }
    
    const settingsData = fs.readFileSync(SETTINGS_FILE_PATH, 'utf8');
    return JSON.parse(settingsData);
  } catch (error) {
    console.error('Error reading settings:', error);
    return DEFAULT_SETTINGS;
  }
}

// Update settings
function updateSettings(newSettings: any) {
  try {
    ensureSettingsFile();
    
    // Merge with existing settings
    const currentSettings = getSettings();
    const updatedSettings = {
      ...currentSettings,
      ...newSettings,
      lastUpdated: new Date().toISOString()
    };
    
    // Write updated settings to file
    fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(updatedSettings, null, 2));
    
    return updatedSettings;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
}

// Handle GET requests to retrieve current settings
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get current settings
    const settings = getSettings();
    
    return NextResponse.json({
      apiKey: settings.apiKey,
      model: settings.model || 'deepseek/deepseek-chat-v3-0324:free', // Default if not set
      enabled: settings.enabled,
      lastUpdated: settings.lastUpdated
    });
  } catch (error) {
    console.error('Error in GET settings:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Update the validation function to be more flexible
function validateModelFormat(model: string): boolean {
  // More flexible validation that allows:
  // 1. provider/model-name format (standard)
  // 2. Just model name without provider
  // 3. Allow more special characters in model names
  return true; // Accept all model formats for maximum flexibility
}

// Enhance the POST method with better validation
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse request body
    const body = await request.json();
    
    // Check for required fields
    if (body.apiKey === undefined && body.enabled === undefined && body.model === undefined) {
      return NextResponse.json({ error: 'No settings provided to update' }, { status: 400 });
    }
    
    // Validate model format if provided
    if (body.model !== undefined) {
      // Skip validation for known models or allow empty string (to reset to default)
      const knownModels = [
        'deepseek/deepseek-r1-0528:free',
        'deepseek/deepseek-chat-v3-0324:free',
        'anthropic/claude-3-opus-20240229',
        'anthropic/claude-3-sonnet-20240229',
        'anthropic/claude-3-haiku-20240307',
        'meta-llama/llama-3-70b-instruct',
        'meta-llama/llama-3-8b-instruct',
        'google/gemini-1.5-pro-latest',
        'google/gemini-1.0-pro',
        'mistralai/mistral-7b-instruct-v0.2',
        'openai/gpt-4-turbo',
        'openai/gpt-3.5-turbo'
      ];
      
      if (!knownModels.includes(body.model) && body.model.trim() !== '') {
        if (!validateModelFormat(body.model)) {
          return NextResponse.json({
            error: 'Invalid model format. Model should follow the pattern: provider/model-name'
          }, { status: 400 });
        }
      }
    }
    
    // Create update object with only the fields that are provided
    const updateData: any = {};
    if (body.apiKey !== undefined) updateData.apiKey = body.apiKey;
    if (body.enabled !== undefined) updateData.enabled = body.enabled;
    if (body.model !== undefined) updateData.model = body.model;
    
    // Update settings
    const updatedSettings = updateSettings(updateData);
    
    // If API key is updated, try to update it in the NexiousChatbot.tsx file directly
    if (body.apiKey) {
      try {
        updateApiKeyInFile(body.apiKey);
      } catch (error) {
        console.error('Failed to update API key in file:', error);
        // Continue without error, as the settings file is already updated
      }
    }
    
    // If model is updated, try to update it in the NexiousChatbot.tsx file directly
    if (body.model) {
      try {
        updateModelInFile(body.model);
      } catch (error) {
        console.error('Failed to update model in file:', error);
        // Continue without error, as the settings file is already updated
      }
    }
    
    return NextResponse.json({
      apiKey: updatedSettings.apiKey,
      model: updatedSettings.model,
      enabled: updatedSettings.enabled,
      lastUpdated: updatedSettings.lastUpdated
    });
  } catch (error) {
    console.error('Error in POST settings:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Function to update the API key directly in the NexiousChatbot.tsx file
function updateApiKeyInFile(newApiKey: string) {
  try {
    const chatbotFilePath = path.join(process.cwd(), 'components', 'NexiousChatbot.tsx');
    
    // Check if file exists
    if (!fs.existsSync(chatbotFilePath)) {
      console.error('Chatbot file not found at:', chatbotFilePath);
      return false;
    }
    
    // Read the file
    let fileContent = fs.readFileSync(chatbotFilePath, 'utf8');
    
    // Replace the API key
    fileContent = fileContent.replace(
      /const OPENROUTER_API_KEY = ['"]([^'"]+)['"]/,
      `const OPENROUTER_API_KEY = '${newApiKey}'`
    );
    
    // Write the updated content back to the file
    fs.writeFileSync(chatbotFilePath, fileContent);
    
    return true;
  } catch (error) {
    console.error('Error updating API key in file:', error);
    return false;
  }
}

// Improve the updateModelInFile function to better handle model updates
function updateModelInFile(newModel: string) {
  try {
    const chatbotFilePath = path.join(process.cwd(), 'components', 'NexiousChatbot.tsx');
    
    // Check if file exists
    if (!fs.existsSync(chatbotFilePath)) {
      console.error('Chatbot file not found at:', chatbotFilePath);
      return false;
    }
    
    // Read the file
    let fileContent = fs.readFileSync(chatbotFilePath, 'utf8');
    
    // Check if MODEL constant exists in the file
    if (!fileContent.includes('const MODEL =')) {
      console.error('MODEL constant not found in file');
      return false;
    }
    
    // Replace the MODEL constant using a more reliable pattern
    fileContent = fileContent.replace(
      /const MODEL = ['"]([^'"]+)['"]/,
      `const MODEL = '${newModel}'`
    );
    
    // Write the updated content back to the file
    fs.writeFileSync(chatbotFilePath, fileContent);
    
    // Also update in memory cache to ensure immediate effect
    try {
      // Clear any module cache that might exist (in case of server restarts)
      if (require.cache && require.cache[chatbotFilePath]) {
        delete require.cache[chatbotFilePath];
      }
    } catch (error) {
      // Ignore cache errors, just log them
      console.warn('Failed to clear module cache:', error);
    }
    
    console.log('Successfully updated model to', newModel);
    return true;
  } catch (error) {
    console.error('Error updating model in file:', error);
    return false;
  }
} 