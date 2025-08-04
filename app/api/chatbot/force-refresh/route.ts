import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Admin password for authentication
const ADMIN_PASSWORD = 'nex-devs919';

// Function to trigger chatbot settings refresh
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      apiKeys, 
      standardModeSettings, 
      proModeSettings, 
      proModeMaintenance,
      forceReload = true 
    } = body;

    // Update the chatbot settings file directly
    const success = await updateChatbotSettings({
      apiKeys,
      standardModeSettings,
      proModeSettings,
      proModeMaintenance
    });

    if (success) {
      // Create a timestamp file to signal the chatbot to refresh
      const refreshSignalPath = path.join(process.cwd(), 'data', 'chatbot-refresh-signal.json');
      const refreshSignal = {
        timestamp: Date.now(),
        settings: {
          apiKeys,
          standardModeSettings,
          proModeSettings,
          proModeMaintenance
        },
        forceReload
      };

      // Ensure directory exists
      const dir = path.dirname(refreshSignalPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(refreshSignalPath, JSON.stringify(refreshSignal, null, 2));

      return NextResponse.json({
        success: true,
        message: 'Chatbot settings updated and refresh signal sent',
        timestamp: refreshSignal.timestamp
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to update chatbot settings'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in force-refresh:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Function to update chatbot settings in the component file
async function updateChatbotSettings(settings: any): Promise<boolean> {
  try {
    const chatbotFilePath = path.join(process.cwd(), 'components', 'NexiousChatbot.tsx');
    
    if (!fs.existsSync(chatbotFilePath)) {
      console.error('Chatbot file not found');
      return false;
    }

    let fileContent = fs.readFileSync(chatbotFilePath, 'utf8');

    // Update API keys if provided
    if (settings.apiKeys?.primary) {
      fileContent = fileContent.replace(
        /const OPENROUTER_API_KEY = ['"]([^'"]*)['"]/,
        `const OPENROUTER_API_KEY = '${settings.apiKeys.primary}'`
      );
    }

    if (settings.apiKeys?.backup) {
      fileContent = fileContent.replace(
        /const BACKUP_API_KEY = ['"]([^'"]*)['"]/,
        `const BACKUP_API_KEY = '${settings.apiKeys.backup}'`
      );
    }

    // Update Pro Mode maintenance status
    if (settings.proModeMaintenance) {
      const maintenanceConfig = `
  isUnderMaintenance: ${settings.proModeMaintenance.isUnderMaintenance},
  maintenanceMessage: "${settings.proModeMaintenance.maintenanceMessage}",
  maintenanceEndDate: "${settings.proModeMaintenance.maintenanceEndDate}",
  showCountdown: ${settings.proModeMaintenance.showCountdown}`;

      // Replace the maintenance configuration
      fileContent = fileContent.replace(
        /isUnderMaintenance:\s*[^,]+,[\s\S]*?showCountdown:\s*[^,}]+/,
        maintenanceConfig.trim()
      );
    }

    // Write the updated content back
    fs.writeFileSync(chatbotFilePath, fileContent);

    // Also update the settings file for persistence
    const settingsFilePath = path.join(process.cwd(), 'data', 'chatbot-settings.json');
    const currentSettings = fs.existsSync(settingsFilePath) 
      ? JSON.parse(fs.readFileSync(settingsFilePath, 'utf8'))
      : {};

    const updatedSettings = {
      ...currentSettings,
      ...settings,
      enabled: true, // Force enable chatbot when settings are applied
      lastUpdated: new Date().toISOString(),
      forceRefreshTimestamp: Date.now()
    };

    // Ensure directory exists
    const dir = path.dirname(settingsFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(settingsFilePath, JSON.stringify(updatedSettings, null, 2));

    console.log('Successfully updated chatbot settings');
    return true;
  } catch (error) {
    console.error('Error updating chatbot settings:', error);
    return false;
  }
}

// GET endpoint to check refresh signal
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const refreshSignalPath = path.join(process.cwd(), 'data', 'chatbot-refresh-signal.json');
    
    if (fs.existsSync(refreshSignalPath)) {
      const refreshSignal = JSON.parse(fs.readFileSync(refreshSignalPath, 'utf8'));
      return NextResponse.json({
        hasRefreshSignal: true,
        ...refreshSignal
      });
    } else {
      return NextResponse.json({
        hasRefreshSignal: false
      });
    }
  } catch (error) {
    console.error('Error checking refresh signal:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE endpoint to clear refresh signal
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const refreshSignalPath = path.join(process.cwd(), 'data', 'chatbot-refresh-signal.json');

    if (fs.existsSync(refreshSignalPath)) {
      fs.unlinkSync(refreshSignalPath);
    }

    return NextResponse.json({
      success: true,
      message: 'Refresh signal cleared'
    });
  } catch (error) {
    console.error('Error clearing refresh signal:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
