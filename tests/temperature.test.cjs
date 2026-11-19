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
const { parseSample } = require('../lib/temperature.cjs');
test('invalid response shapes, dates and values are rejected before charting', () => {
  for (const data of [null, {}, {data:null}, {data:[null]}, {data:[{date:0,temperature:'20'}]}, {data:[{date:1e99,temperature:20}]}]) {
    assert.throws(() => parseSample(data));
  }
  assert.deepEqual(parseSample({data:[]}).data, []);
});
test('out-of-order data is sorted without modifying the response', () => {
  const data = [{date:2,temperature:10},{date:1,temperature:20}];
  assert.equal(parseSample({data}).data[0].date, 1);
  assert.equal(data[0].date, 2);
});
