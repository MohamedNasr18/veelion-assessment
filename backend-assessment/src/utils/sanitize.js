function stripHtmlTags(input) {
  if (typeof input !== 'string') {
    return input;
  }

  // Remove HTML tags
  return input.replace(/<[^>]*>/g, '');
}

function sanitizeString(input, maxLength = 1000) {
  if (typeof input !== 'string') {
    return input;
  }

  let sanitized = stripHtmlTags(input);

  sanitized = sanitized.trim();

  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

function sanitizeTaskInput(data) {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const sanitized = { ...data };

  if (sanitized.title) {
    sanitized.title = sanitizeString(sanitized.title, 500);
  }

  return sanitized;
}

function sanitizeActivityInput(data) {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const sanitized = { ...data };

  if (sanitized.action) {
    sanitized.action = sanitizeString(sanitized.action, 200);
  }

  if (sanitized.info) {
    sanitized.info = sanitizeString(sanitized.info, 1000);
  }

  return sanitized;
}

module.exports = {
  stripHtmlTags,
  sanitizeString,
  sanitizeTaskInput,
  sanitizeActivityInput,
};
