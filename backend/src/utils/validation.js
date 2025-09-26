/**
 * Utility functions for data validation
 */

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  // At least 8 characters
  if (password.length < 8) {
    return false;
  }
  
  // Optional: Add more complex requirements
  // const hasUpperCase = /[A-Z]/.test(password);
  // const hasLowerCase = /[a-z]/.test(password);
  // const hasNumbers = /\d/.test(password);
  // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return true;
};

/**
 * Validate project name
 */
export const validateProjectName = (name) => {
  if (!name || typeof name !== 'string') {
    return false;
  }
  
  // 1-100 characters, no special characters except spaces, hyphens, and underscores
  const nameRegex = /^[a-zA-Z0-9\s\-_]{1,100}$/;
  return nameRegex.test(name.trim());
};

/**
 * Validate URL format
 */
export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate domain name
 */
export const validateDomain = (domain) => {
  if (!domain || typeof domain !== 'string') {
    return false;
  }
  
  // Basic domain validation
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/;
  return domainRegex.test(domain) && domain.length <= 253;
};

/**
 * Sanitize HTML content
 */
export const sanitizeHtml = (html) => {
  if (!html || typeof html !== 'string') {
    return '';
  }
  
  // Basic HTML sanitization - remove script tags and on* attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\s*on\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\s*on\w+\s*=\s*'[^']*'/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
};

/**
 * Validate file size
 */
export const validateFileSize = (size, maxSizeMB = 10) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return size <= maxSizeBytes;
};

/**
 * Validate file type
 */
export const validateFileType = (filename, allowedTypes = []) => {
  if (!filename || !allowedTypes.length) {
    return false;
  }
  
  const extension = filename.toLowerCase().split('.').pop();
  return allowedTypes.includes(extension);
};

/**
 * Validate API key format
 */
export const validateApiKey = (apiKey, prefix = '') => {
  if (!apiKey || typeof apiKey !== 'string') {
    return false;
  }
  
  if (prefix && !apiKey.startsWith(prefix)) {
    return false;
  }
  
  // Basic length check (most API keys are at least 20 characters)
  return apiKey.length >= 20;
};

/**
 * Validate hexadecimal color
 */
export const validateHexColor = (color) => {
  if (!color || typeof color !== 'string') {
    return false;
  }
  
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
};

/**
 * Validate JSON string
 */
export const validateJson = (jsonString) => {
  try {
    JSON.parse(jsonString);
    return true;
  } catch {
    return false;
  }
};