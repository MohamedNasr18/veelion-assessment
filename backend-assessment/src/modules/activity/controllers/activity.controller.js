const activityService = require('../services/activity.service');

async function listActivity(req, res) {
  const { page, limit } = req.query;
  const result = await activityService.getAllActivity({ page, limit });
  
  if (result.pagination) {
    return res.status(200).json({
      data: result.data,
      pagination: result.pagination,
    });
  }
  
  res.status(200).json({ data: result.data });
}

async function createActivity(req, res) {
  const activityData = req.body || {};
  const newActivity = await activityService.createNewActivity(activityData);
  res.status(201).json({ data: newActivity });
}

module.exports = {
  listActivity,
  createActivity,
};
