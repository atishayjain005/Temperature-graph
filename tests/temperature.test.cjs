const { test } = require('node:test');
const assert = require('node:assert/strict');
const { generateSample } = require('../lib/temperature.cjs');
test('sample discloses origin and spans ten complete UTC days across leap day', () => {
  const sample = generateSample(new Date('2024-03-01T23:59:00-08:00'), () => 0);
  assert.equal(sample.source, 'generated-sample');
  assert.equal(sample.unit, '°C');
  assert.equal(sample.data.length, 10);
  assert.equal(new Date(sample.data.at(-1).date).toISOString(), '2024-03-01T00:00:00.000Z');
  assert.ok(sample.data.some(row => new Date(row.date).toISOString().startsWith('2024-02-29')));
  sample.data.forEach((row, i) => {
    assert.equal(row.temperature, 15);
    if (i) assert.equal(row.date - sample.data[i-1].date, 86400000);
  });
});
test('sample temperature stays below the exclusive upper bound', () => {
  assert.ok(generateSample(new Date(), () => 0.99999).data.every(row => row.temperature === 44));
});
