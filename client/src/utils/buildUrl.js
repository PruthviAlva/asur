/**
 * Safely appends pagination params to any URL
 * Handles both:
 *   /anime?q=naruto  → appends &page=2&limit=24
 *   /anime           → appends ?page=2&limit=24
 *
 * @param {string} endpoint - The base URL (may already have query params)
 * @param {number} page     - Page number
 * @param {number} limit    - Items per page
 * @returns {string}        - Complete URL with pagination
 */

export const buildUrl = (endpoint, page = 1, limit = 24) => {
    const seperator = endpoint.includes('?') ? '&' : '?';
    return `${endpoint}${seperator}limit=${limit}&page=${page}`
}