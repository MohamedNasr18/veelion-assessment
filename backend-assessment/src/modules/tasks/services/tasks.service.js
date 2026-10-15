const path = require('node:path');

const { createId } = require('../../../utils/id');
const { readJsonArray, writeJsonArray } = require('../../../utils/jsonStore');
const HttpError = require('../../../utils/httpError');
const { DATA_DIR, TASKS_FILE, TASK_STATUS } = require('../../../utils/constants');

const TASKS_FILE_PATH = path.join(process.cwd(), DATA_DIR, TASKS_FILE);

function buildTaskRecord(payload) {
  const now = new Date().toISOString();

  return {
    id: createId(),
    title: payload.title,
    status: payload.status || TASK_STATUS.TODO,
    completed: payload.status === TASK_STATUS.DONE,
    createdAt: now,
    updatedAt: now,
  };
}

async function getAllTasks(options = {}) {
  const allTasks = await readJsonArray(TASKS_FILE_PATH);
  
  // If no pagination, return all
  if (!options.page && !options.limit) {
    return {
      data: allTasks,
      total: allTasks.length,
    };
  }

  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedTasks = allTasks.slice(startIndex, endIndex);

  return {
    data: paginatedTasks,
    pagination: {
      page,
      limit,
      total: allTasks.length,
      totalPages: Math.ceil(allTasks.length / limit),
      hasNext: endIndex < allTasks.length,
      hasPrev: page > 1,
    },
  };
}

async function getTaskById(taskId) {
  const tasks = await readJsonArray(TASKS_FILE_PATH);
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    throw new HttpError(404, 'Task not found.');
  }

  return task;
}

async function createTask(payload) {
  const tasks = await readJsonArray(TASKS_FILE_PATH);
  const newTask = buildTaskRecord(payload);

  tasks.push(newTask);
  await writeJsonArray(TASKS_FILE_PATH, tasks);

  return newTask;
}

async function updateTask(taskId, updates) {
  const tasks = await readJsonArray(TASKS_FILE_PATH);
  const taskIndex = tasks.findIndex((item) => item.id === taskId);

  if (taskIndex === -1) {
    throw new HttpError(404, 'Task not found.');
  }

  const existingTask = tasks[taskIndex];
  const updatedTask = {
    ...existingTask,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  tasks[taskIndex] = updatedTask;
  await writeJsonArray(TASKS_FILE_PATH, tasks);

  return updatedTask;
}

async function deleteTask(taskId) {
  const tasks = await readJsonArray(TASKS_FILE_PATH);
  const taskIndex = tasks.findIndex((item) => item.id === taskId);

  if (taskIndex === -1) {
    throw new HttpError(404, 'Task not found.');
  }

  const [removedTask] = tasks.splice(taskIndex, 1);
  await writeJsonArray(TASKS_FILE_PATH, tasks);

  return removedTask;
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
