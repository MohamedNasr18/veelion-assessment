const requestCounts = new Map();

function cleanupOldEntries() {
  const now = Date.now();
  const fiveMinutesAgo = now - 5 * 60 * 1000;
  
  for (const [key, data] of requestCounts.entries()) {
    if (data.resetTime < fiveMinutesAgo) {
      requestCounts.delete(key);
    }
  }
}

setInterval(cleanupOldEntries, 10 * 60 * 1000);

function rateLimiter(options = {}) {
  const maxRequests = options.maxRequests || 100;
  const windowMs = options.windowMs || 60 * 1000; 

  return function (req, res, next) {
    const identifier = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();

    let record = requestCounts.get(identifier);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      requestCounts.set(identifier, record);
      return next();
    }

    record.count++;

    if (record.count > maxRequests) {
      const remainingTime = Math.ceil((record.resetTime - now) / 1000);
      
      res.set('X-RateLimit-Limit', maxRequests);
      res.set('X-RateLimit-Remaining', 0);
      res.set('X-RateLimit-Reset', record.resetTime);
      res.set('Retry-After', remainingTime);
      
      return res.status(429).json({
        error: {
          message: `Too many requests. Please try again in ${remainingTime} seconds.`,
        },
      });
    }

    // rate limit headers
    res.set('X-RateLimit-Limit', maxRequests);
    res.set('X-RateLimit-Remaining', maxRequests - record.count);
    res.set('X-RateLimit-Reset', record.resetTime);

    next();
  };
}

module.exports = rateLimiter;
