import { NextRequest, NextResponse } from 'next/server';
import {
  getAdminConfiguration,
  updateAPIKeyConfig,
  updateProModeMaintenanceConfig,
  updateStandardModeConfig,
  updateModeSettings,
  validateAPIKey,
  testAPIKey,
  getAPIUsageStats,
  type APIKeyConfig,
  type ProModeMaintenanceConfig,
  type StandardModeConfig,
  type AIModelSettings
} from '@/backend/utils/nexiousAISettings';

// Admin authentication check
function checkAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const password = authHeader.substring(7);
  return password === process.env.ADMIN_PASSWORD || password === 'nex-devs.org889123';
}

// GET - Retrieve current AI configuration
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const config = getAdminConfiguration();
    
    return NextResponse.json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Error fetching AI configuration:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI configuration' },
      { status: 500 }
    );
  }
}

// POST - Update AI configuration
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, data } = body;

    switch (type) {
      case 'api-keys':
        if (data.primary && !validateAPIKey(data.primary)) {
          return NextResponse.json(
            { error: 'Invalid primary API key format' },
            { status: 400 }
          );
        }
        if (data.backup && !validateAPIKey(data.backup)) {
          return NextResponse.json(
            { error: 'Invalid backup API key format' },
            { status: 400 }
          );
        }
        updateAPIKeyConfig(data as Partial<APIKeyConfig>);
        break;

      case 'pro-mode-maintenance':
        updateProModeMaintenanceConfig(data as Partial<ProModeMaintenanceConfig>);
        break;

      case 'standard-mode-config':
        updateStandardModeConfig(data as Partial<StandardModeConfig>);
        break;

      case 'model-settings':
        const { mode, settings } = data;
        if (mode !== 'standard' && mode !== 'pro') {
          return NextResponse.json(
            { error: 'Invalid mode. Must be "standard" or "pro"' },
            { status: 400 }
          );
        }
        updateModeSettings(mode, settings as Partial<AIModelSettings>);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid configuration type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: 'Configuration updated successfully'
    });
  } catch (error) {
    console.error('Error updating AI configuration:', error);
    return NextResponse.json(
      { error: 'Failed to update AI configuration' },
      { status: 500 }
    );
  }
}

// PUT - Test API key functionality
export async function PUT(request: NextRequest) {
  try {
    // Check admin authentication
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { apiKey, action } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    if (action === 'test') {
      const testResult = await testAPIKey(apiKey);
      return NextResponse.json({
        success: true,
        data: testResult
      });
    }

    if (action === 'usage') {
      const usageStats = await getAPIUsageStats(apiKey);
      return NextResponse.json({
        success: true,
        data: usageStats
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Must be "test" or "usage"' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error testing API key:', error);
    return NextResponse.json(
      { error: 'Failed to test API key' },
      { status: 500 }
    );
  }
}

