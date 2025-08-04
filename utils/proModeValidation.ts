// Pro Mode validation utilities

export interface ValidationResult {
  isValid: boolean
  error?: string
  warnings?: string[]
}

export interface ProModeConfig {
  isUnderMaintenance?: boolean
  maintenanceMessage?: string
  maintenanceEndDate?: string | Date
  showCountdown?: boolean
  durationDays?: number
}

// Validate duration in days
export function validateDuration(days: number): ValidationResult {
  if (typeof days !== 'number') {
    return { isValid: false, error: 'Duration must be a number' }
  }

  if (!Number.isInteger(days)) {
    return { isValid: false, error: 'Duration must be a whole number' }
  }

  if (days < 1) {
    return { isValid: false, error: 'Duration must be at least 1 day' }
  }

  if (days > 365) {
    return { isValid: false, error: 'Duration cannot exceed 365 days' }
  }

  const warnings: string[] = []
  
  if (days > 90) {
    warnings.push('Duration longer than 90 days may affect user experience')
  }

  if (days < 7) {
    warnings.push('Short duration may require frequent updates')
  }

  return { isValid: true, warnings: warnings.length > 0 ? warnings : undefined }
}

// Validate date input
export function validateDate(date: string | Date): ValidationResult {
  let dateObj: Date

  try {
    dateObj = typeof date === 'string' ? new Date(date) : date
  } catch (error) {
    return { isValid: false, error: 'Invalid date format' }
  }

  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: 'Invalid date' }
  }

  const now = new Date()
  const minDate = new Date(now.getTime() + 60 * 1000) // At least 1 minute in the future
  const maxDate = new Date(now.getFullYear() + 2, 11, 31) // Max 2 years in the future

  if (dateObj <= now) {
    return { isValid: false, error: 'Date must be in the future' }
  }

  if (dateObj < minDate) {
    return { isValid: false, error: 'Date must be at least 1 minute in the future' }
  }

  if (dateObj > maxDate) {
    return { isValid: false, error: 'Date cannot be more than 2 years in the future' }
  }

  const warnings: string[] = []
  const daysDiff = Math.ceil((dateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (daysDiff > 180) {
    warnings.push('Date is more than 6 months in the future')
  }

  if (daysDiff < 1) {
    warnings.push('Date is less than 24 hours away')
  }

  return { isValid: true, warnings: warnings.length > 0 ? warnings : undefined }
}

// Validate maintenance message
export function validateMaintenanceMessage(message: string): ValidationResult {
  if (typeof message !== 'string') {
    return { isValid: false, error: 'Message must be a string' }
  }

  const trimmedMessage = message.trim()

  if (trimmedMessage.length === 0) {
    return { isValid: false, error: 'Message cannot be empty' }
  }

  if (trimmedMessage.length < 10) {
    return { isValid: false, error: 'Message must be at least 10 characters long' }
  }

  if (trimmedMessage.length > 500) {
    return { isValid: false, error: 'Message cannot exceed 500 characters' }
  }

  const warnings: string[] = []

  if (trimmedMessage.length > 200) {
    warnings.push('Long messages may not display well on mobile devices')
  }

  if (!/[.!?]$/.test(trimmedMessage)) {
    warnings.push('Consider ending the message with proper punctuation')
  }

  // Check for potentially problematic content
  const problematicPatterns = [
    /\b(never|forever|permanently)\b/i,
    /\b(broken|failed|error)\b/i,
    /\b(sorry|apologize)\b/i
  ]

  for (const pattern of problematicPatterns) {
    if (pattern.test(trimmedMessage)) {
      warnings.push('Consider using more positive language in user-facing messages')
      break
    }
  }

  return { isValid: true, warnings: warnings.length > 0 ? warnings : undefined }
}

// Validate complete Pro Mode configuration
export function validateProModeConfig(config: ProModeConfig): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Validate maintenance message if provided
  if (config.maintenanceMessage !== undefined) {
    const messageValidation = validateMaintenanceMessage(config.maintenanceMessage)
    if (!messageValidation.isValid) {
      errors.push(`Message: ${messageValidation.error}`)
    }
    if (messageValidation.warnings) {
      warnings.push(...messageValidation.warnings.map(w => `Message: ${w}`))
    }
  }

  // Validate end date if provided
  if (config.maintenanceEndDate !== undefined) {
    const dateValidation = validateDate(config.maintenanceEndDate)
    if (!dateValidation.isValid) {
      errors.push(`Date: ${dateValidation.error}`)
    }
    if (dateValidation.warnings) {
      warnings.push(...dateValidation.warnings.map(w => `Date: ${w}`))
    }
  }

  // Validate duration if provided
  if (config.durationDays !== undefined) {
    const durationValidation = validateDuration(config.durationDays)
    if (!durationValidation.isValid) {
      errors.push(`Duration: ${durationValidation.error}`)
    }
    if (durationValidation.warnings) {
      warnings.push(...durationValidation.warnings.map(w => `Duration: ${w}`))
    }
  }

  // Validate boolean fields
  if (config.isUnderMaintenance !== undefined && typeof config.isUnderMaintenance !== 'boolean') {
    errors.push('Maintenance status must be a boolean value')
  }

  if (config.showCountdown !== undefined && typeof config.showCountdown !== 'boolean') {
    errors.push('Countdown display setting must be a boolean value')
  }

  return {
    isValid: errors.length === 0,
    error: errors.length > 0 ? errors.join('; ') : undefined,
    warnings: warnings.length > 0 ? warnings : undefined
  }
}

// Sanitize input values
export function sanitizeProModeConfig(config: ProModeConfig): ProModeConfig {
  const sanitized: ProModeConfig = {}

  if (config.isUnderMaintenance !== undefined) {
    sanitized.isUnderMaintenance = Boolean(config.isUnderMaintenance)
  }

  if (config.maintenanceMessage !== undefined) {
    sanitized.maintenanceMessage = String(config.maintenanceMessage).trim()
  }

  if (config.maintenanceEndDate !== undefined) {
    sanitized.maintenanceEndDate = config.maintenanceEndDate
  }

  if (config.showCountdown !== undefined) {
    sanitized.showCountdown = Boolean(config.showCountdown)
  }

  if (config.durationDays !== undefined) {
    const days = Number(config.durationDays)
    sanitized.durationDays = Number.isInteger(days) ? Math.max(1, Math.min(365, days)) : undefined
  }

  return sanitized
}

// Format validation errors for user display
export function formatValidationError(result: ValidationResult): string {
  if (result.isValid) {
    return ''
  }

  let message = result.error || 'Validation failed'
  
  if (result.warnings && result.warnings.length > 0) {
    message += ` (Warnings: ${result.warnings.join(', ')})`
  }

  return message
}

// Check if configuration changes are safe for production
export function isProductionSafe(config: ProModeConfig): ValidationResult {
  const warnings: string[] = []

  // Check for potentially disruptive changes
  if (config.isUnderMaintenance === false) {
    warnings.push('Enabling Pro Mode will immediately affect all users')
  }

  if (config.durationDays && config.durationDays < 7) {
    warnings.push('Short maintenance periods may require frequent manual updates')
  }

  if (config.maintenanceEndDate) {
    const date = new Date(config.maintenanceEndDate)
    const now = new Date()
    const hoursDiff = (date.getTime() - now.getTime()) / (1000 * 60 * 60)
    
    if (hoursDiff < 1) {
      warnings.push('Changes taking effect within 1 hour may catch users off-guard')
    }
  }

  return {
    isValid: true,
    warnings: warnings.length > 0 ? warnings : undefined
  }
}
