const path = require('node:path');
const os = require('node:os');
const fs = require('node:fs');
const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

const { readJsonArray, writeJsonArray } = require('../src/utils/jsonStore');

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'veeleion-jsonstore-'));
let file;

beforeEach(() => {
  file = path.join(tempDir, `${Date.now()}-${Math.random().toString(16).slice(2)}.json`);
});

test('readJsonArray creates and returns [] for a missing file', async () => {
  const result = await readJsonArray(file);

  assert.deepEqual(result, []);
  assert.deepEqual(JSON.parse(fs.readFileSync(file, 'utf-8')), []);
});

test('readJsonArray returns [] for an empty file', async () => {
  fs.writeFileSync(file, '');

  assert.deepEqual(await readJsonArray(file), []);
});

test('readJsonArray returns [] for non-array JSON', async () => {
  fs.writeFileSync(file, '{"a":1}');

  assert.deepEqual(await readJsonArray(file), []);
});

test('writeJsonArray then readJsonArray round-trips', async () => {
  const data = [{ id: '1', title: 'x' }];

  await writeJsonArray(file, data);

  assert.deepEqual(await readJsonArray(file), data);
});
