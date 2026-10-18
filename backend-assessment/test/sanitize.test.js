const { test } = require('node:test');
const assert = require('node:assert/strict');

const {
  stripHtmlTags,
  sanitizeString,
  sanitizeTaskInput,
  sanitizeActivityInput,
} = require('../src/utils/sanitize');

test('stripHtmlTags removes tags but keeps the text', () => {
  assert.equal(stripHtmlTags('<b>hi</b>'), 'hi');
  assert.equal(stripHtmlTags('a<script>alert(1)</script>b'), 'aalert(1)b');
});

test('stripHtmlTags returns non-strings unchanged', () => {
  assert.equal(stripHtmlTags(null), null);
  assert.equal(stripHtmlTags(42), 42);
});

test('sanitizeString trims and caps the length', () => {
  assert.equal(sanitizeString('  hello  '), 'hello');
  assert.equal(sanitizeString('abcdef', 3), 'abc');
});

test('sanitizeString returns non-strings unchanged', () => {
  assert.equal(sanitizeString(undefined), undefined);
  assert.equal(sanitizeString(123), 123);
});

test('sanitizeTaskInput strips html and caps the title at 500', () => {
  assert.equal(sanitizeTaskInput({ title: '<b>hi</b>' }).title, 'hi');
  assert.equal(sanitizeTaskInput({ title: 'x'.repeat(600) }).title.length, 500);
});

test('sanitizeActivityInput caps action at 200 and info at 1000', () => {
  const result = sanitizeActivityInput({
    action: 'a'.repeat(300),
    info: 'b'.repeat(1200),
  });

  assert.equal(result.action.length, 200);
  assert.equal(result.info.length, 1000);
});
