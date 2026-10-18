const path = require('node:path');
const os = require('node:os');
const fs = require('node:fs');
const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'veeleion-activity-'));
const dataDir = path.join(tempDir, 'data');
fs.mkdirSync(dataDir, { recursive: true });

process.chdir(tempDir);

const activityService = require('../src/modules/activity/services/activity.service');
const HttpError = require('../src/utils/httpError');

const ACTIVITY_FILE = path.join(dataDir, 'activity.json');
const isBadRequest = (error) => error instanceof HttpError && error.statusCode === 400;

beforeEach(() => {
  fs.writeFileSync(ACTIVITY_FILE, '[]\n');
});

test('createNewActivity rejects a non-object', async () => {
  await assert.rejects(activityService.createNewActivity(null), isBadRequest);
  await assert.rejects(activityService.createNewActivity(42), isBadRequest);
});

test('createNewActivity rejects input with no action or info', async () => {
  await assert.rejects(activityService.createNewActivity({}), isBadRequest);
});

test('createNewActivity rejects an action longer than 200', async () => {
  await assert.rejects(
    activityService.createNewActivity({ action: 'a'.repeat(300) }),
    isBadRequest
  );
});

test('createNewActivity rejects info longer than 1000', async () => {
  await assert.rejects(
    activityService.createNewActivity({ info: 'b'.repeat(1200) }),
    isBadRequest
  );
});

test('createNewActivity builds a record with a uuid and an iso date', async () => {
  const record = await activityService.createNewActivity({ action: 'login' });

  assert.match(record.id, /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  assert.ok(!Number.isNaN(Date.parse(record.when)));
  assert.equal(record.action, 'login');

  const all = await activityService.getAllActivity();
  assert.equal(all.data.length, 1);
  assert.equal(all.data[0].id, record.id);
});

test('getAllActivity paginates and reports totals', async () => {
  for (let i = 0; i < 5; i += 1) {
    await activityService.createNewActivity({ action: `action-${i}` });
  }

  const page = await activityService.getAllActivity({ page: '2', limit: '2' });

  assert.equal(page.data.length, 2);
  assert.deepEqual(page.pagination, {
    page: 2,
    limit: 2,
    total: 5,
    totalPages: 3,
    hasNext: true,
    hasPrev: true,
  });
});

test('getAllActivity first page has no previous page', async () => {
  for (let i = 0; i < 3; i += 1) {
    await activityService.createNewActivity({ action: `a-${i}` });
  }

  const page = await activityService.getAllActivity({ page: '1', limit: '2' });

  assert.equal(page.pagination.hasPrev, false);
  assert.equal(page.pagination.hasNext, true);
});
