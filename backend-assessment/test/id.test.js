const { test } = require('node:test');
const assert = require('node:assert/strict');

const { createId } = require('../src/utils/id');

test('createId returns unique, non-empty strings', () => {
  const ids = new Set();

  for (let i = 0; i < 1000; i += 1) {
    const id = createId();
    assert.equal(typeof id, 'string');
    assert.ok(id.length > 0);
    ids.add(id);
  }

  assert.equal(ids.size, 1000);
});
