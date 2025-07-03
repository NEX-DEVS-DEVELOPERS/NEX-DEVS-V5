// Security management system for admin section
export interface SecurityState {
  isBlocked: boolean
  failedAttempts: number
  blockStartTime: number | null
  lastAttemptTime: number
  ipAddress?: string
  userAgent?: string
}

export class SecurityManager {
  private static readonly MAX_FAILED_ATTEMPTS = 2
  private static readonly BLOCK_DURATION = 30 * 60 * 1000 // 30 minutes in milliseconds
  private static readonly STORAGE_KEY = 'admin_security_state'
  private static readonly SERVER_STORAGE_KEY = 'admin_security_server'

  // Get current security state
  static getSecurityState(): SecurityState {
    if (typeof window === 'undefined') {
      // Server-side: return default state
      return {
        isBlocked: false,
        failedAttempts: 0,
        blockStartTime: null,
        lastAttemptTime: 0
      }
    }

    try {
      // Check both localStorage and sessionStorage for persistence
      const localState = localStorage.getItem(this.STORAGE_KEY)
      const sessionState = sessionStorage.getItem(this.STORAGE_KEY)
      
      // Use the most restrictive state (blocked state takes precedence)
      let state: SecurityState = {
        isBlocked: false,
        failedAttempts: 0,
        blockStartTime: null,
        lastAttemptTime: 0
      }

      if (localState) {
        const parsed = JSON.parse(localState)
        if (parsed.isBlocked) state = parsed
      }

      if (sessionState) {
        const parsed = JSON.parse(sessionState)
        if (parsed.isBlocked || parsed.failedAttempts > state.failedAttempts) {
          state = parsed
        }
      }

      // Check if block has expired
      if (state.isBlocked && state.blockStartTime) {
        const now = Date.now()
        if (now - state.blockStartTime > this.BLOCK_DURATION) {
          // Block has expired, reset state
          state = {
            isBlocked: false,
            failedAttempts: 0,
            blockStartTime: null,
            lastAttemptTime: 0
          }
          this.saveSecurityState(state)
        }
      }

      return state
    } catch (error) {
      console.error('Error reading security state:', error)
      return {
        isBlocked: false,
        failedAttempts: 0,
        blockStartTime: null,
        lastAttemptTime: 0
      }
    }
  }

  // Save security state to both localStorage and sessionStorage
  static saveSecurityState(state: SecurityState): void {
    if (typeof window === 'undefined') return

    try {
      const stateString = JSON.stringify(state)
      localStorage.setItem(this.STORAGE_KEY, stateString)
      sessionStorage.setItem(this.STORAGE_KEY, stateString)
      
      // Also save to a backup key for cross-tab communication
      localStorage.setItem(this.SERVER_STORAGE_KEY, stateString)
    } catch (error) {
      console.error('Error saving security state:', error)
    }
  }

  // Record a failed login attempt
  static recordFailedAttempt(ipAddress?: string, userAgent?: string): SecurityState {
    const currentState = this.getSecurityState()
    const now = Date.now()

    const newState: SecurityState = {
      ...currentState,
      failedAttempts: currentState.failedAttempts + 1,
      lastAttemptTime: now,
      ipAddress,
      userAgent
    }

    // Check if we should block access
    if (newState.failedAttempts >= this.MAX_FAILED_ATTEMPTS) {
      newState.isBlocked = true
      newState.blockStartTime = now
      
      // Log security violation
      console.warn('🚨 SECURITY ALERT: Admin access blocked due to failed login attempts', {
        attempts: newState.failedAttempts,
        ipAddress,
        userAgent,
        timestamp: new Date(now).toISOString()
      })
    }

    this.saveSecurityState(newState)
    return newState
  }

  // Check if access should be blocked
  static isAccessBlocked(): boolean {
    const state = this.getSecurityState()
    return state.isBlocked
  }

  // Reset security state (for legitimate logins)
  static resetSecurityState(): void {
    const resetState: SecurityState = {
      isBlocked: false,
      failedAttempts: 0,
      blockStartTime: null,
      lastAttemptTime: 0
    }
    this.saveSecurityState(resetState)
  }

  // Get time remaining for block (in minutes)
  static getBlockTimeRemaining(): number {
    const state = this.getSecurityState()
    if (!state.isBlocked || !state.blockStartTime) return 0

    const now = Date.now()
    const elapsed = now - state.blockStartTime
    const remaining = this.BLOCK_DURATION - elapsed

    return Math.max(0, Math.ceil(remaining / (60 * 1000))) // Convert to minutes
  }

  // Check if this is a legacy admin path
  static isLegacyAdminPath(pathname: string): boolean {
    return pathname.startsWith('/admin')
  }

  // Log security violation
  static logSecurityViolation(type: 'legacy_path' | 'blocked_access' | 'failed_login', details: any): void {
    const timestamp = new Date().toISOString()
    console.warn(`🚨 SECURITY VIOLATION [${type.toUpperCase()}] at ${timestamp}:`, details)
    
    // In production, you might want to send this to a security monitoring service
    if (typeof window !== 'undefined') {
      try {
        const violations = JSON.parse(localStorage.getItem('security_violations') || '[]')
        violations.push({
          type,
          details,
          timestamp,
          userAgent: navigator.userAgent
        })
        
        // Keep only last 100 violations
        if (violations.length > 100) {
          violations.splice(0, violations.length - 100)
        }
        
        localStorage.setItem('security_violations', JSON.stringify(violations))
      } catch (error) {
        console.error('Error logging security violation:', error)
      }
    }
  }
}
