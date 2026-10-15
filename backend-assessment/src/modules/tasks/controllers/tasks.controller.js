const tasksService = require('../services/tasks.service');
const { validateTaskPayload, validateTaskUpdate } = require('../utils/taskValidator');

async function listTasks(req, res) {
  const { page, limit } = req.query;
  const result = await tasksService.getAllTasks({ page, limit });
  
  if (result.pagination) {
    return res.status(200).json({
      data: result.data,
      pagination: result.pagination,
    });
  }
  
  res.status(200).json({ data: result.data });
}

async function getTask(req, res) {
  const task = await tasksService.getTaskById(req.params.id);
  res.status(200).json({ data: task });
}

async function createTask(req, res) {
  const validatedData = validateTaskPayload(req.body);
  const task = await tasksService.createTask(validatedData);
  res.status(201).json({ data: task });
}

async function patchTask(req, res) {
  const validatedUpdates = validateTaskUpdate(req.body);
  const task = await tasksService.updateTask(req.params.id, validatedUpdates);
  res.status(200).json({ data: task });
}

async function removeTask(req, res) {
  await tasksService.deleteTask(req.params.id);
  res.status(204).send();
}

module.exports = {
  listTasks,
  getTask,
  createTask,
  patchTask,
  removeTask,
};
