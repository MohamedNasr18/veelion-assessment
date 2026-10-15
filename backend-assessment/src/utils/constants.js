const DATA_DIR = 'data';
const TASKS_FILE = 'tasks.json';
const ACTIVITY_FILE = 'activity.json';

// Rate limiting
const RATE_LIMIT_MAX_REQUESTS = 100;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; 

const MAX_REQUEST_SIZE = '10mb';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const MIN_TITLE_LENGTH = 1;
const MAX_TITLE_LENGTH = 500;
const MAX_ACTION_LENGTH = 200;
const MAX_INFO_LENGTH = 1000;

// task status values
const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  DONE: 'done',
};

const VALID_TASK_STATUSES = Object.values(TASK_STATUS);

module.exports = {
  DATA_DIR,
  TASKS_FILE,
  ACTIVITY_FILE,
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
  MAX_REQUEST_SIZE,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
  MIN_TITLE_LENGTH,
  MAX_TITLE_LENGTH,
  MAX_ACTION_LENGTH,
  MAX_INFO_LENGTH,
  TASK_STATUS,
  VALID_TASK_STATUSES,
};
