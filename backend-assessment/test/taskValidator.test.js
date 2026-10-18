const { test } = require('node:test');
const assert = require('node:assert/strict');

const {
  validateTaskPayload,
  validateTaskUpdate,
} = require('../src/modules/tasks/utils/taskValidator');
const HttpError = require('../src/utils/httpError');

const isBadRequest = (error) => error instanceof HttpError && error.statusCode === 400;

test('validateTaskPayload accepts a valid payload with defaults', () => {
  assert.deepEqual(validateTaskPayload({ title: 'Write docs' }), {
    title: 'Write docs',
    status: 'todo',
    completed: false,
  });
});

test('validateTaskPayload accepts a done status', () => {
  assert.deepEqual(validateTaskPayload({ title: 'Ship it', status: 'done' }), {
    title: 'Ship it',
    status: 'done',
    completed: true,
  });
});

test('validateTaskPayload derives status from completed', () => {
  assert.equal(validateTaskPayload({ title: 'x', completed: true }).status, 'done');
  assert.equal(validateTaskPayload({ title: 'x', completed: false }).status, 'todo');
});

test('validateTaskPayload rejects a missing title', () => {
  assert.throws(() => validateTaskPayload({}), isBadRequest);
});

test('validateTaskPayload rejects a non-string title', () => {
  assert.throws(() => validateTaskPayload({ title: 123 }), isBadRequest);
});

test('validateTaskPayload rejects an empty title', () => {
  assert.throws(() => validateTaskPayload({ title: '   ' }), isBadRequest);
});

test('validateTaskPayload rejects a too-long title', () => {
  assert.throws(() => validateTaskPayload({ title: 'a'.repeat(600) }), isBadRequest);
});

test('validateTaskPayload rejects an invalid status', () => {
  assert.throws(() => validateTaskPayload({ title: 'x', status: 'weird' }), isBadRequest);
});

test('validateTaskUpdate rejects an update with nothing to change', () => {
  assert.throws(() => validateTaskUpdate({}), isBadRequest);
});

test('validateTaskUpdate trims the title', () => {
  assert.equal(validateTaskUpdate({ title: '  New  ' }).title, 'New');
});

test('validateTaskUpdate rejects a too-long title', () => {
  assert.throws(() => validateTaskUpdate({ title: 'a'.repeat(600) }), isBadRequest);
});
