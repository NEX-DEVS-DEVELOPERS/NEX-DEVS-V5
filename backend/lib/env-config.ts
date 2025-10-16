// Environment configuration with validation
export const ENV_CONFIG = {
  // Admin credentials
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'iblame_hasnaat',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'nex-devs.org889123',
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || 'alihasnaat919',

  // Security email configuration
  SECURITY_EMAIL: process.env.SECURITY_EMAIL || 'nexdevs.org@gmail.com',
  SECURITY_EMAIL_PASSWORD: process.env.SECURITY_EMAIL_PASSWORD || 'hcgn fypy ylnm pvud',

  // Environment info
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_SERVER: typeof window === 'undefined',
}

// Validation function
export function validateEnvironmentVariables() {
  const missing: string[] = []

  if (!ENV_CONFIG.ADMIN_USERNAME) missing.push('ADMIN_USERNAME')
  if (!ENV_CONFIG.ADMIN_PASSWORD) missing.push('ADMIN_PASSWORD')
  if (!ENV_CONFIG.DATABASE_PASSWORD) missing.push('DATABASE_PASSWORD')

  return {
    isValid: missing.length === 0,
    missing,
    config: ENV_CONFIG
  }
}

// Server-side only debug function - NEVER logs to browser console
export function debugEnvironmentVariables() {
  // Only log on server-side in development mode
  if (ENV_CONFIG.IS_DEVELOPMENT && ENV_CONFIG.IS_SERVER) {
    console.log('🔧 [SERVER-ONLY] Environment Variables Debug:')
    console.log('ADMIN_USERNAME:', ENV_CONFIG.ADMIN_USERNAME ? '✅ Set' : '❌ Missing')
    console.log('ADMIN_PASSWORD:', ENV_CONFIG.ADMIN_PASSWORD ? '✅ Set' : '❌ Missing')
    console.log('DATABASE_PASSWORD:', ENV_CONFIG.DATABASE_PASSWORD ? '✅ Set' : '❌ Missing')
    console.log('SECURITY_EMAIL:', ENV_CONFIG.SECURITY_EMAIL ? '✅ Set' : '❌ Missing')
    console.log('NODE_ENV:', ENV_CONFIG.NODE_ENV)
  }
}

// Security-focused logging function - server-side only
export function logSecurityEvent(event: string, details: any) {
  if (ENV_CONFIG.IS_SERVER) {
    console.log(`🔒 [SECURITY] ${event}:`, {
      ...details,
      timestamp: new Date().toISOString(),
      environment: ENV_CONFIG.NODE_ENV
    })
  }
}
