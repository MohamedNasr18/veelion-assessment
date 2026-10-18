const path = require('node:path');
const os = require('node:os');
const fs = require('node:fs');
const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'veeleion-reports-'));
const dataDir = path.join(tempDir, 'data');
fs.mkdirSync(dataDir, { recursive: true });

process.chdir(tempDir);

const reportsService = require('../src/modules/reports/services/reports.service');

const TASKS_FILE = path.join(dataDir, 'tasks.json');
const ACTIVITY_FILE = path.join(dataDir, 'activity.json');

function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value));
}

function daysAgo(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

beforeEach(() => {
  writeJson(TASKS_FILE, []);
  writeJson(ACTIVITY_FILE, []);
});

test('byStatus always includes todo, in-progress and done', async () => {
  const summary = await reportsService.getTasksSummary();

  assert.deepEqual(Object.keys(summary.byStatus).sort(), ['done', 'in-progress', 'todo']);
  assert.deepEqual(summary.byStatus, { todo: 0, 'in-progress': 0, done: 0 });
});

test('byStatus counts the three known statuses', async () => {
  writeJson(TASKS_FILE, [
    { status: 'todo' },
    { status: 'in-progress' },
    { status: 'done' },
  ]);

  const summary = await reportsService.getTasksSummary();

  assert.deepEqual(summary.byStatus, { todo: 1, 'in-progress': 1, done: 1 });
  assert.equal(summary.total, 3);
});

test('an unknown status falls back to the completed flag', async () => {
  writeJson(TASKS_FILE, [
    { status: 'weird', completed: true },
    { status: 'weird', completed: false },
  ]);

  const summary = await reportsService.getTasksSummary();

  assert.deepEqual(summary.byStatus, { todo: 1, 'in-progress': 0, done: 1 });
});

test('legacy tasks without a status still count', async () => {
  writeJson(TASKS_FILE, [{ completed: true }, { completed: false }]);

  const summary = await reportsService.getTasksSummary();

  assert.deepEqual(summary.byStatus, { todo: 1, 'in-progress': 0, done: 1 });
});

test('recentActivityCount keeps recent items and skips old or invalid ones', async () => {
  writeJson(ACTIVITY_FILE, [
    { when: daysAgo(6) },
    { when: daysAgo(8) },
    { when: 'not-a-date' },
  ]);

  const summary = await reportsService.getTasksSummary();

  assert.equal(summary.recentActivityCount, 1);
});
