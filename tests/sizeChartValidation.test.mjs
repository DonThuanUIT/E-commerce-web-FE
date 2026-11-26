import assert from 'node:assert/strict';
import test from 'node:test';
import {
  hasSizeChartErrors,
  validateSizeChartPayload,
} from '../src/features/sizeChart/utils/sizeChartValidation.ts';

test('validateSizeChartPayload accepts valid size chart rows', () => {
  const res = validateSizeChartPayload({
    name: 'Polo Shirt',
    rows: [
      {
        sizeCode: 'S',
        heightMin: 155,
        heightMax: 165,
        weightMin: 48,
        weightMax: 56,
        chestMin: 80,
        chestMax: 88,
        waistMin: null,
        waistMax: null,
        hipMin: null,
        hipMax: null,
      },
    ],
  });
  assert.equal(hasSizeChartErrors(res), false);
});

test('validateSizeChartPayload rejects min > max and duplicate sizeCode', () => {
  const rangeRes = validateSizeChartPayload({
    name: 'Polo Shirt',
    rows: [
      {
        sizeCode: 'S',
        heightMin: 170,
        heightMax: 160,
        weightMin: null,
        weightMax: null,
        chestMin: null,
        chestMax: null,
        waistMin: null,
        waistMax: null,
        hipMin: null,
        hipMax: null,
      },
    ],
  });
  assert.equal(hasSizeChartErrors(rangeRes), true);
  assert.ok(rangeRes.rowErrors[0]);

  const dupRes = validateSizeChartPayload({
    name: 'Polo Shirt',
    rows: [
      {
        sizeCode: 'M',
        heightMin: null,
        heightMax: null,
        weightMin: null,
        weightMax: null,
        chestMin: null,
        chestMax: null,
        waistMin: null,
        waistMax: null,
        hipMin: null,
        hipMax: null,
      },
      {
        sizeCode: 'm',
        heightMin: null,
        heightMax: null,
        weightMin: null,
        weightMax: null,
        chestMin: null,
        chestMax: null,
        waistMin: null,
        waistMax: null,
        hipMin: null,
        hipMax: null,
      },
    ],
  });
  assert.equal(hasSizeChartErrors(dupRes), true);
  assert.ok(dupRes.rowErrors[1]);
});
