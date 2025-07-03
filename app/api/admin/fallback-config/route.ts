import { NextRequest, NextResponse } from 'next/server'
import { 
  getFallbackSystemConfig, 
  updateFallbackSystemConfig, 
  updateFallbackModel, 
  removeFallbackModel,
  testFallbackModel,
  getAdminConfiguration
} from '@/utils/nexiousAISettings'

// Admin authentication check
function checkAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false
  }
  
  const password = authHeader.substring(7)
  const validPasswords = ['nex-devs.org889123', 'nex-devs919']
  return validPasswords.includes(password)
}

// GET - Fetch fallback system configuration
export async function GET(request: NextRequest) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const fallbackConfig = getFallbackSystemConfig()
    
    return NextResponse.json({
      success: true,
      data: fallbackConfig
    })
  } catch (error) {
    console.error('Error fetching fallback configuration:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fallback configuration' },
      { status: 500 }
    )
  }
}

// POST - Update fallback system configuration
export async function POST(request: NextRequest) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const configData = await request.json()
    
    // Validate configuration data
    if (typeof configData.enabled !== 'boolean') {
      return NextResponse.json({ error: 'Invalid enabled value' }, { status: 400 })
    }
    
    if (typeof configData.primaryTimeout !== 'number' || configData.primaryTimeout < 5000 || configData.primaryTimeout > 30000) {
      return NextResponse.json({ error: 'Invalid primary timeout value' }, { status: 400 })
    }

    // Update the configuration
    updateFallbackSystemConfig(configData)
    
    return NextResponse.json({
      success: true,
      message: 'Fallback system configuration updated successfully'
    })
  } catch (error) {
    console.error('Error updating fallback configuration:', error)
    return NextResponse.json(
      { error: 'Failed to update fallback configuration' },
      { status: 500 }
    )
  }
}

// PUT - Handle model operations (add, test)
export async function PUT(request: NextRequest) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, model } = await request.json()
    
    if (action === 'add-model') {
      // Validate model data
      if (!model.model || !model.description) {
        return NextResponse.json({ error: 'Model ID and description are required' }, { status: 400 })
      }
      
      if (typeof model.priority !== 'number' || model.priority < 1 || model.priority > 10) {
        return NextResponse.json({ error: 'Invalid priority value' }, { status: 400 })
      }
      
      if (typeof model.timeout !== 'number' || model.timeout < 3000 || model.timeout > 15000) {
        return NextResponse.json({ error: 'Invalid timeout value' }, { status: 400 })
      }

      // Add the model
      updateFallbackModel(model)
      
      return NextResponse.json({
        success: true,
        message: 'Fallback model added successfully'
      })
    }
    
    if (action === 'test-model') {
      // Test the model
      const testResult = await testFallbackModel(model)
      
      return NextResponse.json({
        success: true,
        data: testResult
      })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error handling model operation:', error)
    return NextResponse.json(
      { error: 'Failed to handle model operation' },
      { status: 500 }
    )
  }
}

// DELETE - Remove fallback model
export async function DELETE(request: NextRequest) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { modelId } = await request.json()
    
    if (!modelId) {
      return NextResponse.json({ error: 'Model ID is required' }, { status: 400 })
    }

    // Remove the model
    removeFallbackModel(modelId)
    
    return NextResponse.json({
      success: true,
      message: 'Fallback model removed successfully'
    })
  } catch (error) {
    console.error('Error removing fallback model:', error)
    return NextResponse.json(
      { error: 'Failed to remove fallback model' },
      { status: 500 }
    )
  }
}
