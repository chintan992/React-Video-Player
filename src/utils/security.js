// Security utility functions for frontend-only application

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const validateVideoFile = (file) => {
  // List of allowed video MIME types
  const allowedTypes = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime'
  ];

  // Maximum file size (in bytes) - 500MB
  const maxSize = 500 * 1024 * 1024;

  if (!file) {
    throw new Error('No file provided');
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only video files are allowed.');
  }

  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum size is 500MB.');
  }

  return true;
};

export const secureLocalStorage = {
  setItem: (key, value) => {
    try {
      // Sanitize the key and stringify the value
      const sanitizedKey = sanitizeInput(key);
      const sanitizedValue = typeof value === 'string' 
        ? sanitizeInput(value)
        : JSON.stringify(value);
      
      localStorage.setItem(sanitizedKey, sanitizedValue);
    } catch (error) {
      console.error('Error storing data:', error);
    }
  },

  getItem: (key) => {
    try {
      const sanitizedKey = sanitizeInput(key);
      const value = localStorage.getItem(sanitizedKey);
      
      try {
        // Attempt to parse as JSON
        return JSON.parse(value);
      } catch {
        // If parsing fails, return the raw value
        return value;
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  },

  removeItem: (key) => {
    try {
      const sanitizedKey = sanitizeInput(key);
      localStorage.removeItem(sanitizedKey);
    } catch (error) {
      console.error('Error removing data:', error);
    }
  }
};

// Add security headers through meta tags
export const addSecurityMetaTags = () => {
  const metaTags = [
    {
      'http-equiv': 'Content-Security-Policy',
      content: `
        default-src 'self' * data: blob:;
        script-src 'self' 'unsafe-inline' 'unsafe-eval' *;
        style-src 'self' 'unsafe-inline' *;
        img-src 'self' data: blob: *;
        media-src 'self' blob: *;
        frame-src 'self' *;
        child-src 'self' *;
        connect-src 'self' *;
        font-src 'self' *;
        worker-src 'self' blob: *;
        object-src 'none';
        frame-ancestors 'self';
      `.replace(/\s+/g, ' ').trim()
    },
    {
      'http-equiv': 'X-Content-Type-Options',
      content: 'nosniff'
    },
    {
      name: 'referrer',
      content: 'strict-origin-when-cross-origin'
    }
  ];

  // Remove any existing CSP meta tags
  const existingCSPTags = document.querySelectorAll("meta[http-equiv='Content-Security-Policy']");
  existingCSPTags.forEach(tag => tag.remove());

  // Add the new meta tags
  metaTags.forEach(tagData => {
    const meta = document.createElement('meta');
    Object.entries(tagData).forEach(([key, value]) => {
      meta.setAttribute(key, value);
    });
    document.head.appendChild(meta);
  });
};
