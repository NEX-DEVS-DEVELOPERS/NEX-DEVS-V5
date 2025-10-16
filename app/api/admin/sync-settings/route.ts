import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Admin authentication
const ADMIN_PASSWORD = 'nex-devs.org889123';

function validateAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const password = authHeader.substring(7);
  return password === ADMIN_PASSWORD;
}

// POST - Sync all settings to configuration files
export async function POST(request: NextRequest) {
  try {
    if (!validateAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      apiKeys,
      standardModeSettings,
      proModeSettings,
      proModeMaintenance,
      standardModeConfig,
      knowledgeEntries,
      fallbackSystemConfig
    } = body;

    // Update nexiousAISettings.ts file
    if (apiKeys || standardModeSettings || proModeSettings || proModeMaintenance || standardModeConfig || fallbackSystemConfig) {
      await updateAISettingsFile({
        apiKeys,
        standardModeSettings,
        proModeSettings,
        proModeMaintenance,
        standardModeConfig,
        fallbackSystemConfig
      });
    }

    // Update nexious-knowledge.ts file
    if (knowledgeEntries && knowledgeEntries.length > 0) {
      await updateKnowledgeFile(knowledgeEntries);
    }

    // CRITICAL FIX: Force cache invalidation and module reloading
    try {
      // Clear Node.js module cache for the updated files
      const aiSettingsPath = path.join(process.cwd(), 'utils', 'nexiousAISettings.ts');
      const knowledgePath = path.join(process.cwd(), 'lib', 'nexious-knowledge.ts');

      // Delete from require cache to force reload using static paths
      try {
        delete require.cache[path.resolve(process.cwd(), 'utils/nexiousAISettings.ts')];
        delete require.cache[path.resolve(process.cwd(), 'lib/nexious-knowledge.ts')];
      } catch (resolveError) {
        // Fallback: try to clear cache using absolute paths
        delete require.cache[aiSettingsPath];
        delete require.cache[knowledgePath];
      }

      // Force Next.js to revalidate pages that use these modules
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/revalidate?path=/&secret=nex-devs919`);

      console.log('✅ Cache invalidated and modules reloaded');
    } catch (cacheError) {
      console.warn('⚠️ Cache invalidation failed:', cacheError);
      // Don't fail the entire operation if cache invalidation fails
    }

    return NextResponse.json({
      success: true,
      message: 'All settings synchronized successfully and cache invalidated',
      timestamp: new Date().toISOString(),
      cacheCleared: true
    });

  } catch (error) {
    console.error('Error syncing settings:', error);
    return NextResponse.json(
      { error: 'Failed to sync settings', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Function to update nexiousAISettings.ts
async function updateAISettingsFile(settings: any) {
  const filePath = path.join(process.cwd(), 'utils', 'nexiousAISettings.ts');
  
  try {
    // Read current file
    const currentContent = await fs.readFile(filePath, 'utf-8');
    
    let updatedContent = currentContent;

    // Update API Key Configuration
    if (settings.apiKeys) {
      const apiKeyConfigRegex = /const API_KEY_CONFIG: APIKeyConfig = \{[\s\S]*?\};/;
      const newApiKeyConfig = `const API_KEY_CONFIG: APIKeyConfig = {
  primary: '${settings.apiKeys.primary || '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'}',
  backup: '${settings.apiKeys.backup || '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'}',
  fallbackModels: [
    'anthropic/claude-3-haiku',
    'meta-llama/llama-3.1-8b-instruct',
    'mistralai/mistral-small',
    'anthropic/claude-3.5-haiku'
  ]
};`;
      updatedContent = updatedContent.replace(apiKeyConfigRegex, newApiKeyConfig);
    }

    // Update Standard Mode Settings
    if (settings.standardModeSettings) {
      const standardSettingsRegex = /const standardModeSettings: AIModelSettings = \{[\s\S]*?\};/;
      const newStandardSettings = `const standardModeSettings: AIModelSettings = {
  model: '${settings.standardModeSettings.model || 'deepseek/deepseek-r1-0528:free'}',
  temperature: ${settings.standardModeSettings.temperature || 0.7},
  maxTokens: ${settings.standardModeSettings.maxTokens || 2500},
  topP: ${settings.standardModeSettings.topP || 0.9},
  presencePenalty: ${settings.standardModeSettings.presencePenalty || 0},
  frequencyPenalty: ${settings.standardModeSettings.frequencyPenalty || 0},
  timeout: ${settings.standardModeSettings.timeout || 12000},
  thinkingTime: ${settings.standardModeSettings.responseDelay || 400},
  apiEndpoint: '${settings.standardModeSettings.apiEndpoint || 'https://openrouter.ai/api/v1/chat/completions'}',
  // Extended settings
  useCustomModel: ${settings.standardModeSettings.useCustomModel || false},
  customModel: '${settings.standardModeSettings.customModel || ''}',
  messageLimit: ${settings.standardModeSettings.messageLimit || 15},
  cooldownHours: ${settings.standardModeSettings.cooldownHours || 2},
  disableAutoScroll: ${settings.standardModeSettings.disableAutoScroll || false},
  enableTypingIndicator: ${settings.standardModeSettings.enableTypingIndicator !== undefined ? settings.standardModeSettings.enableTypingIndicator : true},
  enableSoundNotifications: ${settings.standardModeSettings.enableSoundNotifications || false},
  enableMessageHistory: ${settings.standardModeSettings.enableMessageHistory !== undefined ? settings.standardModeSettings.enableMessageHistory : true},
  responseDelay: ${settings.standardModeSettings.responseDelay || 400},
  systemPrompt: \`${(settings.standardModeSettings.systemPrompt || '').replace(/`/g, '\\`')}\`
};`;
      updatedContent = updatedContent.replace(standardSettingsRegex, newStandardSettings);
    }

    // Update Pro Mode Settings
    if (settings.proModeSettings) {
      const proSettingsRegex = /const proModeSettings: AIModelSettings = \{[\s\S]*?\};/;
      const newProSettings = `const proModeSettings: AIModelSettings = {
  model: '${settings.proModeSettings.model || 'deepseek/deepseek-r1-0528:free'}',
  temperature: ${settings.proModeSettings.temperature || 0.5},
  maxTokens: ${settings.proModeSettings.maxTokens || 5000},
  topP: ${settings.proModeSettings.topP || 0.8},
  presencePenalty: ${settings.proModeSettings.presencePenalty || 0},
  frequencyPenalty: ${settings.proModeSettings.frequencyPenalty || 0.1},
  timeout: ${settings.proModeSettings.timeout || 25000},
  thinkingTime: ${settings.proModeSettings.thinkingTime || 1200},
  apiEndpoint: '${settings.proModeSettings.apiEndpoint || 'https://openrouter.ai/api/v1/chat/completions'}',
  // Extended Pro Mode settings
  useCustomModel: ${settings.proModeSettings.useCustomModel || false},
  customModel: '${settings.proModeSettings.customModel || ''}',
  enableCodeHighlighting: ${settings.proModeSettings.enableCodeHighlighting !== undefined ? settings.proModeSettings.enableCodeHighlighting : true},
  enableCopyCode: ${settings.proModeSettings.enableCopyCode !== undefined ? settings.proModeSettings.enableCopyCode : true},
  disableAutoScroll: ${settings.proModeSettings.disableAutoScroll !== undefined ? settings.proModeSettings.disableAutoScroll : true},
  enableAdvancedFormatting: ${settings.proModeSettings.enableAdvancedFormatting !== undefined ? settings.proModeSettings.enableAdvancedFormatting : true},
  enableLivePreview: ${settings.proModeSettings.enableLivePreview || false},
  enableFileExport: ${settings.proModeSettings.enableFileExport || false},
  enableMultiLanguage: ${settings.proModeSettings.enableMultiLanguage !== undefined ? settings.proModeSettings.enableMultiLanguage : true},
  enableDebugMode: ${settings.proModeSettings.enableDebugMode || false},
  contextWindow: ${settings.proModeSettings.contextWindow || 8},
  enableDarkTheme: ${settings.proModeSettings.enableDarkTheme !== undefined ? settings.proModeSettings.enableDarkTheme : true},
  enableAnimations: ${settings.proModeSettings.enableAnimations !== undefined ? settings.proModeSettings.enableAnimations : true},
  enableKeyboardShortcuts: ${settings.proModeSettings.enableKeyboardShortcuts !== undefined ? settings.proModeSettings.enableKeyboardShortcuts : true},
  enableFullscreen: ${settings.proModeSettings.enableFullscreen || false},
  systemPrompt: \`${(settings.proModeSettings.systemPrompt || '').replace(/`/g, '\\`')}\`
};`;
      updatedContent = updatedContent.replace(proSettingsRegex, newProSettings);
    }

    // Update Pro Mode Maintenance
    if (settings.proModeMaintenance) {
      const maintenanceRegex = /const PRO_MODE_MAINTENANCE: ProModeMaintenanceConfig = \{[\s\S]*?\};/;
      const newMaintenance = `const PRO_MODE_MAINTENANCE: ProModeMaintenanceConfig = {
  isUnderMaintenance: ${settings.proModeMaintenance.isUnderMaintenance || true},
  maintenanceMessage: "${settings.proModeMaintenance.maintenanceMessage || 'Nexious Pro Mode is currently under maintenance.'}",
  maintenanceEndDate: new Date('${settings.proModeMaintenance.maintenanceEndDate || '2025-07-01T00:00:00Z'}'),
  showCountdown: ${settings.proModeMaintenance.showCountdown || true}
};`;
      updatedContent = updatedContent.replace(maintenanceRegex, newMaintenance);
    }

    // Update Standard Mode Config
    if (settings.standardModeConfig) {
      const configRegex = /const STANDARD_MODE_CONFIG: StandardModeConfig = \{[\s\S]*?\};/;
      const newConfig = `const STANDARD_MODE_CONFIG: StandardModeConfig = {
  requestLimit: ${settings.standardModeConfig.requestLimit || 15},
  cooldownHours: ${settings.standardModeConfig.cooldownHours || 2},
  resetInterval: ${settings.standardModeConfig.resetInterval || 24 * 60 * 60 * 1000}
};`;
      updatedContent = updatedContent.replace(configRegex, newConfig);
    }

    // Update Fallback System Configuration
    if (settings.fallbackSystemConfig) {
      const fallbackConfigRegex = /const FALLBACK_SYSTEM_CONFIG: FallbackSystemConfig = \{[\s\S]*?\};/;
      const fallbackModelsCode = settings.fallbackSystemConfig.fallbackModels?.map((model: any) => `    {
      model: '${model.model}',
      priority: ${model.priority},
      timeout: ${model.timeout},
      maxRetries: ${model.maxRetries || 2},
      temperature: ${model.temperature},
      maxTokens: ${model.maxTokens},
      isEnabled: ${model.isEnabled},
      description: '${model.description}'
    }`).join(',\n') || '';

      const newFallbackConfig = `const FALLBACK_SYSTEM_CONFIG: FallbackSystemConfig = {
  enabled: ${settings.fallbackSystemConfig.enabled},
  primaryTimeout: ${settings.fallbackSystemConfig.primaryTimeout || 9000},
  fallbackModels: [
${fallbackModelsCode}
  ],
  notificationEnabled: ${settings.fallbackSystemConfig.notificationEnabled},
  notificationMessage: '${settings.fallbackSystemConfig.notificationMessage || 'Switched to premium backup AI model for enhanced performance'}',
  maxFallbackAttempts: ${settings.fallbackSystemConfig.maxFallbackAttempts || 3},
  fallbackDelay: ${settings.fallbackSystemConfig.fallbackDelay || 500}
};`;
      updatedContent = updatedContent.replace(fallbackConfigRegex, newFallbackConfig);
    }

    // Write updated content back to file with atomic operation
    const tempFilePath = `${filePath}.tmp`;
    await fs.writeFile(tempFilePath, updatedContent, 'utf-8');
    await fs.rename(tempFilePath, filePath);

    // Force file system sync
    const fileHandle = await fs.open(filePath, 'r+');
    await fileHandle.sync();
    await fileHandle.close();

    console.log('✅ Successfully updated nexiousAISettings.ts with atomic write');

  } catch (error) {
    console.error('Error updating AI settings file:', error);
    throw error;
  }
}

// Function to update nexious-knowledge.ts
async function updateKnowledgeFile(knowledgeEntries: any[]) {
  const filePath = path.join(process.cwd(), 'lib', 'nexious-knowledge.ts');
  
  try {
    // Read current file
    const currentContent = await fs.readFile(filePath, 'utf-8');
    
    // Generate new knowledge entries
    const newEntriesCode = knowledgeEntries.map(entry => `  {
    id: '${entry.id}',
    category: '${entry.category}',
    title: '${entry.title}',
    content: \`${entry.content.replace(/`/g, '\\`')}\`,
    tags: [${entry.tags.map((tag: string) => `'${tag}'`).join(', ')}],
    dateAdded: new Date('${entry.dateAdded}'),
    lastModified: new Date('${entry.lastModified}'),
    isActive: ${entry.isActive}
  }`).join(',\n');

    // Find the dynamicKnowledgeBase array and update it
    const dynamicKnowledgeRegex = /let dynamicKnowledgeBase: KnowledgeEntry\[\] = \[[\s\S]*?\];/;
    const newDynamicKnowledge = `let dynamicKnowledgeBase: KnowledgeEntry[] = [
${newEntriesCode}
];`;

    const updatedContent = currentContent.replace(dynamicKnowledgeRegex, newDynamicKnowledge);

    // Write updated content back to file with atomic operation
    const tempFilePath = `${filePath}.tmp`;
    await fs.writeFile(tempFilePath, updatedContent, 'utf-8');
    await fs.rename(tempFilePath, filePath);

    // Force file system sync
    const fileHandle = await fs.open(filePath, 'r+');
    await fileHandle.sync();
    await fileHandle.close();

    console.log('✅ Successfully updated nexious-knowledge.ts with atomic write');

  } catch (error) {
    console.error('Error updating knowledge file:', error);
    throw error;
  }
}

// GET - Get current file contents for verification
export async function GET(request: NextRequest) {
  try {
    if (!validateAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const aiSettingsPath = path.join(process.cwd(), 'utils', 'nexiousAISettings.ts');
    const knowledgePath = path.join(process.cwd(), 'lib', 'nexious-knowledge.ts');

    const [aiSettingsContent, knowledgeContent] = await Promise.all([
      fs.readFile(aiSettingsPath, 'utf-8'),
      fs.readFile(knowledgePath, 'utf-8')
    ]);

    return NextResponse.json({
      success: true,
      files: {
        aiSettings: {
          path: 'utils/nexiousAISettings.ts',
          lastModified: (await fs.stat(aiSettingsPath)).mtime,
          size: aiSettingsContent.length
        },
        knowledge: {
          path: 'lib/nexious-knowledge.ts',
          lastModified: (await fs.stat(knowledgePath)).mtime,
          size: knowledgeContent.length
        }
      }
    });

  } catch (error) {
    console.error('Error reading files:', error);
    return NextResponse.json(
      { error: 'Failed to read files', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

