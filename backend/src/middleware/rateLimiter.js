/**
 * Simple in-memory rate limiter
 * In production, use Redis or similar for distributed rate limiting
 */

const requests = new Map();

const WINDOW_SIZE = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // Max requests per window

/**
 * Rate limiting middleware
 */
export const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  // Clean up old entries
  for (const [key, data] of requests.entries()) {
    if (now - data.firstRequest > WINDOW_SIZE) {
      requests.delete(key);
    }
  }
  
  if (!requests.has(ip)) {
    requests.set(ip, {
      count: 1,
      firstRequest: now
    });
    return next();
  }
  
  const requestData = requests.get(ip);
  
  // If window has passed, reset
  if (now - requestData.firstRequest > WINDOW_SIZE) {
    requests.set(ip, {
      count: 1,
      firstRequest: now
    });
    return next();
  }
  
  // Increment count
  requestData.count++;
  
  // Check if limit exceeded
  if (requestData.count > MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Max ${MAX_REQUESTS} requests per ${WINDOW_SIZE/1000/60} minutes.`,
      retryAfter: Math.ceil((WINDOW_SIZE - (now - requestData.firstRequest)) / 1000)
    });
  }
  
  // Add rate limit headers
  res.set({
    'X-RateLimit-Limit': MAX_REQUESTS,
    'X-RateLimit-Remaining': Math.max(0, MAX_REQUESTS - requestData.count),
    'X-RateLimit-Reset': new Date(requestData.firstRequest + WINDOW_SIZE).toISOString()
  });
  
  next();
};