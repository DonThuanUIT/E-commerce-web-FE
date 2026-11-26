import type { SizeChartPayload, SizeChartRow } from '../types/sizeChartType';

export interface SizeChartValidationResult {
  nameError?: string;
  rowsError?: string;
  rowErrors: Record<number, string>;
}

const METRICS: Array<{
  minKey: keyof Omit<SizeChartRow, 'id' | 'sizeCode'>;
  maxKey: keyof Omit<SizeChartRow, 'id' | 'sizeCode'>;
  label: string;
}> = [
  { minKey: 'heightMin', maxKey: 'heightMax', label: 'Height' },
  { minKey: 'weightMin', maxKey: 'weightMax', label: 'Weight' },
  { minKey: 'chestMin', maxKey: 'chestMax', label: 'Chest' },
  { minKey: 'waistMin', maxKey: 'waistMax', label: 'Waist' },
  { minKey: 'hipMin', maxKey: 'hipMax', label: 'Hip' },
];

/**
 * Validates size chart payload matching CNWeb_BE `CreateSizeChartCommand` and `SizeChartServiceImpl`.
 */
export function validateSizeChartPayload(
  payload: SizeChartPayload,
): SizeChartValidationResult {
  const result: SizeChartValidationResult = { rowErrors: {} };

  if (!payload.name.trim()) {
    result.nameError = 'Size chart name is required';
  }

  if (!payload.rows || payload.rows.length === 0) {
    result.rowsError = 'At least one size row is required';
    return result;
  }

  const seenCodes = new Set<string>();

  payload.rows.forEach((row, index) => {
    const code = row.sizeCode.trim().toUpperCase();
    if (!code) {
      result.rowErrors[index] = 'Size code is required';
      return;
    }

    if (seenCodes.has(code)) {
      result.rowErrors[index] = `Duplicate size code "${row.sizeCode.trim()}"`;
      return;
    }
    seenCodes.add(code);

    for (const metric of METRICS) {
      const minVal = row[metric.minKey];
      const maxVal = row[metric.maxKey];

      if ((minVal !== null && minVal < 0) || (maxVal !== null && maxVal < 0)) {
        result.rowErrors[index] = `${metric.label} values must be non-negative`;
        return;
      }

      if (minVal !== null && maxVal !== null && minVal > maxVal) {
        result.rowErrors[index] =
          `${metric.label} min (${minVal}) must not exceed max (${maxVal})`;
        return;
      }
    }
  });

  return result;
}

export function hasSizeChartErrors(res: SizeChartValidationResult): boolean {
  return Boolean(
    res.nameError || res.rowsError || Object.keys(res.rowErrors).length > 0,
  );
}
