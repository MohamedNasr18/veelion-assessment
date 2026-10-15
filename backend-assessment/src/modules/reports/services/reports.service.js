const path = require('node:path');

const { readJsonArray } = require('../../../utils/jsonStore');
const {
  DATA_DIR,
  TASKS_FILE,
  ACTIVITY_FILE,
  TASK_STATUS,
  VALID_TASK_STATUSES,
} = require('../../../utils/constants');

const TASKS_FILE_PATH = path.join(process.cwd(), DATA_DIR, TASKS_FILE);
const ACTIVITY_FILE_PATH = path.join(process.cwd(), DATA_DIR, ACTIVITY_FILE);
const RECENT_ACTIVITY_DAYS = 7;

function resolveStatus(task) {
  if (VALID_TASK_STATUSES.includes(task.status)) return task.status;
  return task.completed ? TASK_STATUS.DONE : TASK_STATUS.TODO;
}

function countByStatus(tasks) {
  const counts = Object.fromEntries(VALID_TASK_STATUSES.map((status) => [status, 0]));

  for (const task of tasks) {
    counts[resolveStatus(task)] += 1;
  }

  return counts;
}

function countRecentActivities(activities, days = RECENT_ACTIVITY_DAYS) {
  const threshold = new Date();
  threshold.setDate(threshold.getDate() - days);

  return activities.filter((activity) => new Date(activity.when) >= threshold).length;
}

async function getTasksSummary() {
  const [tasks, activities] = await Promise.all([
    readJsonArray(TASKS_FILE_PATH),
    readJsonArray(ACTIVITY_FILE_PATH),
  ]);

  return {
    total: tasks.length,
    byStatus: countByStatus(tasks),
    recentActivityCount: countRecentActivities(activities),
  };
}

module.exports = { getTasksSummary };