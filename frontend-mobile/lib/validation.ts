/**
 * Form validation utilities for authentication
 */

/**
 * Validation result with error message
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate email format.
 * Uses regex to check for valid email structure.
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim().length === 0) {
    return {
      isValid: false,
      error: 'Email is required',
    };
  }

  // Email regex pattern
  // Matches: user@domain.com, user.name@domain.co.uk, etc.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address',
    };
  }

  return { isValid: true };
}

/**
 * Validate password strength.
 * Requirements:
 * - At least 8 characters
 * - Contains at least one letter
 * - Contains at least one number
 */
export function validatePassword(password: string): ValidationResult {
  if (!password || password.length === 0) {
    return {
      isValid: false,
      error: 'Password is required',
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: 'Password must be at least 8 characters',
    };
  }

  // Check for at least one letter
  if (!/[a-zA-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one letter',
    };
  }

  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one number',
    };
  }

  return { isValid: true };
}

/**
 * Validate that password confirmation matches.
 */
export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): ValidationResult {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Passwords do not match',
    };
  }

  return { isValid: true };
}

/**
 * Validate required text field (name, university, major).
 */
export function validateRequired(
  value: string,
  fieldName: string
): ValidationResult {
  if (!value || value.trim().length === 0) {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }

  return { isValid: true };
}

/**
 * Validate all login fields.
 * Returns first error found, or success if all valid.
 */
export function validateLoginForm(email: string, password: string): ValidationResult {
  // Validate email
  const emailResult = validateEmail(email);
  if (!emailResult.isValid) {
    return emailResult;
  }

  // Validate password (just check if not empty for login)
  if (!password || password.length === 0) {
    return {
      isValid: false,
      error: 'Password is required',
    };
  }

  return { isValid: true };
}

/**
 * Validate all registration fields.
 * Returns first error found, or success if all valid.
 */
export function validateRegisterForm(data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}): ValidationResult {
  // Validate name
  const nameResult = validateRequired(data.name, 'Name');
  if (!nameResult.isValid) {
    return nameResult;
  }

  // Validate email
  const emailResult = validateEmail(data.email);
  if (!emailResult.isValid) {
    return emailResult;
  }

  // Validate password
  const passwordResult = validatePassword(data.password);
  if (!passwordResult.isValid) {
    return passwordResult;
  }

  // Validate password match
  const matchResult = validatePasswordMatch(data.password, data.confirmPassword);
  if (!matchResult.isValid) {
    return matchResult;
  }

  return { isValid: true };
}
