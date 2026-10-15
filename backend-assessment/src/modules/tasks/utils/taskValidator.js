const HttpError = require('../../../utils/httpError');
const { sanitizeTaskInput } = require('../../../utils/sanitize');
const { MIN_TITLE_LENGTH, MAX_TITLE_LENGTH, TASK_STATUS, VALID_TASK_STATUSES } = require('../../../utils/constants');

function validateTaskPayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new HttpError(400, 'Request body must be an object.');
  }

  const sanitized = sanitizeTaskInput(payload);

  if (typeof sanitized.title !== 'string') {
    throw new HttpError(400, 'Title is required and must be a string.');
  }

  const trimmedTitle = sanitized.title.trim();
  if (!trimmedTitle || trimmedTitle.length < MIN_TITLE_LENGTH) {
    throw new HttpError(400, 'Title cannot be empty.');
  }

  if (trimmedTitle.length > MAX_TITLE_LENGTH) {
    throw new HttpError(400, `Title cannot exceed ${MAX_TITLE_LENGTH} characters.`);
  }

     if (sanitized.status !== undefined) {
    if (!VALID_TASK_STATUSES.includes(sanitized.status)) {
      throw new HttpError(400, `Status must be one of: ${VALID_TASK_STATUSES.join(', ')}`);
    }
    sanitized.completed = sanitized.status === TASK_STATUS.DONE;
  } else if (sanitized.completed !== undefined) {
    if (typeof sanitized.completed !== 'boolean') {
      throw new HttpError(400, 'Completed must be a boolean.');
    }
    sanitized.status = sanitized.completed ? TASK_STATUS.DONE : TASK_STATUS.TODO;
  }

  const status = sanitized.status ?? TASK_STATUS.TODO;

  return {
    title: trimmedTitle,
    status,
    completed: status === TASK_STATUS.DONE,
  };

}

function validateTaskUpdate(updates) {
  if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
    throw new HttpError(400, 'Request body must be an object.');
  }

  const sanitized = sanitizeTaskInput(updates);

  if (sanitized.title !== undefined && typeof sanitized.title !== 'string') {
    throw new HttpError(400, 'Title must be a string.');
  }

  if (sanitized.title !== undefined) {
    sanitized.title = sanitized.title.trim();
    if (sanitized.title.length === 0) {
      throw new HttpError(400, 'Title cannot be empty.');
    }
    if (sanitized.title.length > MAX_TITLE_LENGTH) {
      throw new HttpError(400, `Title cannot exceed ${MAX_TITLE_LENGTH} characters.`);
    }
  }

    if (sanitized.status !== undefined) {
    if (!VALID_TASK_STATUSES.includes(sanitized.status)) {
      throw new HttpError(400, `Status must be one of: ${VALID_TASK_STATUSES.join(', ')}`);
    }
    sanitized.completed = sanitized.status === TASK_STATUS.DONE;
  } else if (sanitized.completed !== undefined) {
    if (typeof sanitized.completed !== 'boolean') {
      throw new HttpError(400, 'Completed must be a boolean.');
    }
    sanitized.status = sanitized.completed ? TASK_STATUS.DONE : TASK_STATUS.TODO;
  }

  if (sanitized.title === undefined && sanitized.status === undefined && sanitized.completed === undefined) {
    throw new HttpError(400, 'Nothing to update - provide title, status, or completed.');
  }

  return sanitized;
}

module.exports = {
  validateTaskPayload,
  validateTaskUpdate,
};
