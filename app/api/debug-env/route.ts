import { NextResponse } from 'next/server';
import { ENV_CONFIG, validateEnvironmentVariables } from '@/backend/lib/env-config';

export async function GET() {
  try {
    const validation = validateEnvironmentVariables();
    
    return NextResponse.json({
      isValid: validation.isValid,
      missing: validation.missing,
      environment: ENV_CONFIG.NODE_ENV,
      variables: {
        ADMIN_USERNAME: ENV_CONFIG.ADMIN_USERNAME ? '✅ Set' : '❌ Missing',
        ADMIN_PASSWORD: ENV_CONFIG.ADMIN_PASSWORD ? '✅ Set' : '❌ Missing',
        DATABASE_PASSWORD: ENV_CONFIG.DATABASE_PASSWORD ? '✅ Set' : '❌ Missing',
      },
      rawEnv: {
        ADMIN_USERNAME: process.env.ADMIN_USERNAME,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? '[HIDDEN]' : undefined,
        DATABASE_PASSWORD: process.env.DATABASE_PASSWORD ? '[HIDDEN]' : undefined,
      }
    });
  } catch (error) {
    console.error('Environment debug error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

