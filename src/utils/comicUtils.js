// Utility functions for handling comic URLs and IDs

/**
 * Encode a comic API URL into a URL-safe ID
 * @param {string} apiUrl - The comic API URL
 * @returns {string} - URL-safe encoded ID
 */
export const encodeComicId = (apiUrl) => {
  if (!apiUrl) return '';
  // Use base64 encoding to create a clean, URL-safe ID
  return btoa(apiUrl).replace(/[+/=]/g, (match) => {
    switch (match) {
      case '+': return '-';
      case '/': return '_';
      case '=': return '';
      default: return match;
    }
  });
};

/**
 * Decode a comic ID back to the original API URL
 * @param {string} comicId - The encoded comic ID
 * @returns {string} - The original API URL
 */
export const decodeComicId = (comicId) => {
  if (!comicId) return '';
  // Convert back from URL-safe base64 to regular base64, then decode
  const base64 = comicId.replace(/[-_]/g, (match) => {
    switch (match) {
      case '-': return '+';
      case '_': return '/';
      default: return match;
    }
  });
  return atob(base64);
};

/**
 * Generate a clean comic URL using the encoded ID
 * @param {string} apiUrl - The comic API URL
 * @returns {string} - Clean URL path
 */
export const getComicUrl = (apiUrl) => {
  const encodedId = encodeComicId(apiUrl);
  return `/comic/${encodedId}`;
};
