const path = require('node:path');

const { createId } = require('../../../utils/id');
const { readJsonArray, writeJsonArray } = require('../../../utils/jsonStore');
const HttpError = require('../../../utils/httpError');
const { sanitizeActivityInput } = require('../../../utils/sanitize');
const { DATA_DIR, ACTIVITY_FILE, MAX_ACTION_LENGTH, MAX_INFO_LENGTH } = require('../../../utils/constants');

const ACTIVITY_FILE_PATH = path.join(process.cwd(), DATA_DIR, ACTIVITY_FILE);

function buildActivityRecord(data) {
  return {
    id: createId(),
    action: data.action || '',
    info: data.info || '',
    when: new Date().toISOString(),
  };
}

async function getAllActivity(options = {}) {
  const allActivity = await readJsonArray(ACTIVITY_FILE_PATH);
  
  if (!options.page && !options.limit) {
    return {
      data: allActivity,
      total: allActivity.length,
    };
  }

  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedActivity = allActivity.slice(startIndex, endIndex);

  return {
    data: paginatedActivity,
    pagination: {
      page,
      limit,
      total: allActivity.length,
      totalPages: Math.ceil(allActivity.length / limit),
      hasNext: endIndex < allActivity.length,
      hasPrev: page > 1,
    },
  };
}

async function createNewActivity(activityData) {
  if (!activityData || typeof activityData !== 'object') {
    throw new HttpError(400, 'Activity data must be an object.');
  }

  // Sanitize input
  const sanitized = sanitizeActivityInput(activityData);

  if (!sanitized.action && !sanitized.info) {
    throw new HttpError(400, 'Activity must have at least action or info.');
  }

  if (sanitized.action && sanitized.action.length > MAX_ACTION_LENGTH) {
    throw new HttpError(400, `Action cannot exceed ${MAX_ACTION_LENGTH} characters.`);
  }

  if (sanitized.info && sanitized.info.length > MAX_INFO_LENGTH) {
    throw new HttpError(400, `Info cannot exceed ${MAX_INFO_LENGTH} characters.`);
  }

  const activities = await readJsonArray(ACTIVITY_FILE_PATH);
  const newActivity = buildActivityRecord(sanitized);

  activities.push(newActivity);
  await writeJsonArray(ACTIVITY_FILE_PATH, activities);

  return newActivity;
}

module.exports = {
  getAllActivity,
  createNewActivity,
};
