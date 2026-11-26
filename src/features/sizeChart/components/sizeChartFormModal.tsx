import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import type {
  SizeChart,
  SizeChartPayload,
  SizeChartRow,
} from '../types/sizeChartType';
import {
  hasSizeChartErrors,
  type SizeChartValidationResult,
  validateSizeChartPayload,
} from '../utils/sizeChartValidation';

interface SizeChartFormModalProps {
  isOpen: boolean;
  editingChart: SizeChart | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: SizeChartPayload) => Promise<void>;
}

const createEmptyRow = (sizeCode = ''): Omit<SizeChartRow, 'id'> => ({
  sizeCode,
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
});

const parseNullableInt = (val: string): number | null => {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

/**
 * Modal with dynamic measurement rows table for creating/editing a garment size chart.
 */
export const SizeChartFormModal: React.FC<SizeChartFormModalProps> = ({
  isOpen,
  editingChart,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const isEditing = Boolean(editingChart);
  const [name, setName] = useState(editingChart?.name ?? '');
  const [rows, setRows] = useState<Omit<SizeChartRow, 'id'>[]>(() =>
    editingChart && editingChart.rows.length > 0
      ? editingChart.rows.map((r) => ({
          sizeCode: r.sizeCode,
          heightMin: r.heightMin,
          heightMax: r.heightMax,
          weightMin: r.weightMin,
          weightMax: r.weightMax,
          chestMin: r.chestMin,
          chestMax: r.chestMax,
          waistMin: r.waistMin,
          waistMax: r.waistMax,
          hipMin: r.hipMin,
          hipMax: r.hipMax,
        }))
      : [
          createEmptyRow('S'),
          createEmptyRow('M'),
          createEmptyRow('L'),
          createEmptyRow('XL'),
        ],
  );
  const [validation, setValidation] = useState<SizeChartValidationResult>({
    rowErrors: {},
  });

  if (!isOpen) return null;

  const updateRowField = (
    index: number,
    field: keyof Omit<SizeChartRow, 'id'>,
    value: string,
  ) => {
    setRows((prev) =>
      prev.map((row, idx) => {
        if (idx !== index) return row;
        if (field === 'sizeCode') {
          return { ...row, sizeCode: value };
        }
        return { ...row, [field]: parseNullableInt(value) };
      }),
    );
    setValidation((prev) => {
      const nextRowErrors = { ...prev.rowErrors };
      delete nextRowErrors[index];
      return { ...prev, rowsError: undefined, rowErrors: nextRowErrors };
    });
  };

  const handleAddRow = () => {
    setRows((prev) => [...prev, createEmptyRow('')]);
  };

  const handleRemoveRow = (index: number) => {
    setRows((prev) => prev.filter((_, idx) => idx !== index));
    setValidation((prev) => ({ ...prev, rowErrors: {} }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: SizeChartPayload = {
      name: name.trim(),
      rows: rows.map((r) => ({
        ...r,
        sizeCode: r.sizeCode.trim(),
      })),
    };

    const result = validateSizeChartPayload(payload);
    if (hasSizeChartErrors(result)) {
      setValidation(result);
      return;
    }

    await onSubmit(payload);
  };

  const renderNumberInput = (
    index: number,
    field: keyof Omit<SizeChartRow, 'id' | 'sizeCode'>,
    value: number | null,
    placeholder: string,
  ) => (
    <input
      type="number"
      min={0}
      value={value ?? ''}
      onChange={(e) => updateRowField(index, field, e.target.value)}
      placeholder={placeholder}
      className="w-16 rounded border border-gray-300 px-2 py-1 text-center font-mono text-xs text-gray-900 focus:border-black focus:outline-none"
    />
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-chart-modal-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col rounded-xl border border-gray-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <p className="font-mono text-[10px] tracking-widest text-gray-400 uppercase">
              {isEditing ? 'Modify Specification' : 'New Specification'}
            </p>
            <h2
              id="size-chart-modal-title"
              className="text-lg font-semibold text-gray-900"
            >
              {isEditing ? 'Edit Size Chart' : 'Create Size Chart'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            <div>
              <label
                htmlFor="size-chart-name"
                className="mb-1.5 block text-[11px] font-semibold tracking-wider text-gray-700 uppercase"
              >
                Size Chart Name
              </label>
              <input
                id="size-chart-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setValidation((prev) => ({ ...prev, nameError: undefined }));
                }}
                placeholder="e.g. Polo Shirt (Uniqlo Standard)"
                className={`w-full max-w-md rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 focus:border-black focus:outline-none ${
                  validation.nameError ? 'border-rose-400' : 'border-gray-300'
                }`}
              />
              {validation.nameError && (
                <p className="mt-1 text-xs text-rose-600">
                  {validation.nameError}
                </p>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold tracking-wider text-gray-700 uppercase">
                    Measurement Ranges
                  </h3>
                  <p className="text-xs text-gray-500">
                    Leave optional measurement bounds blank if not applicable to
                    this garment type.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Size Row</span>
                </button>
              </div>

              {validation.rowsError && (
                <p className="mb-2 text-xs text-rose-600">
                  {validation.rowsError}
                </p>
              )}

              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="bg-gray-50 font-mono text-[10px] tracking-wider text-gray-500 uppercase">
                    <tr>
                      <th className="border-b border-gray-200 px-3 py-2.5">
                        Size
                      </th>
                      <th className="border-b border-gray-200 px-3 py-2.5 text-center">
                        Height (cm)
                      </th>
                      <th className="border-b border-gray-200 px-3 py-2.5 text-center">
                        Weight (kg)
                      </th>
                      <th className="border-b border-gray-200 px-3 py-2.5 text-center">
                        Chest (cm)
                      </th>
                      <th className="border-b border-gray-200 px-3 py-2.5 text-center">
                        Waist (cm)
                      </th>
                      <th className="border-b border-gray-200 px-3 py-2.5 text-center">
                        Hip (cm)
                      </th>
                      <th className="border-b border-gray-200 px-3 py-2.5 text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {rows.map((row, index) => (
                      <React.Fragment key={index}>
                        <tr className="bg-white">
                          <td className="px-3 py-2.5">
                            <input
                              type="text"
                              value={row.sizeCode}
                              onChange={(e) =>
                                updateRowField(
                                  index,
                                  'sizeCode',
                                  e.target.value,
                                )
                              }
                              placeholder="M"
                              className="w-16 rounded border border-gray-300 px-2 py-1 font-mono text-xs font-semibold text-gray-900 uppercase focus:border-black focus:outline-none"
                            />
                          </td>
                          <td className="px-2 py-2.5">
                            <div className="flex items-center justify-center gap-1">
                              {renderNumberInput(
                                index,
                                'heightMin',
                                row.heightMin,
                                'Min',
                              )}
                              <span className="text-gray-400">-</span>
                              {renderNumberInput(
                                index,
                                'heightMax',
                                row.heightMax,
                                'Max',
                              )}
                            </div>
                          </td>
                          <td className="px-2 py-2.5">
                            <div className="flex items-center justify-center gap-1">
                              {renderNumberInput(
                                index,
                                'weightMin',
                                row.weightMin,
                                'Min',
                              )}
                              <span className="text-gray-400">-</span>
                              {renderNumberInput(
                                index,
                                'weightMax',
                                row.weightMax,
                                'Max',
                              )}
                            </div>
                          </td>
                          <td className="px-2 py-2.5">
                            <div className="flex items-center justify-center gap-1">
                              {renderNumberInput(
                                index,
                                'chestMin',
                                row.chestMin,
                                'Min',
                              )}
                              <span className="text-gray-400">-</span>
                              {renderNumberInput(
                                index,
                                'chestMax',
                                row.chestMax,
                                'Max',
                              )}
                            </div>
                          </td>
                          <td className="px-2 py-2.5">
                            <div className="flex items-center justify-center gap-1">
                              {renderNumberInput(
                                index,
                                'waistMin',
                                row.waistMin,
                                'Min',
                              )}
                              <span className="text-gray-400">-</span>
                              {renderNumberInput(
                                index,
                                'waistMax',
                                row.waistMax,
                                'Max',
                              )}
                            </div>
                          </td>
                          <td className="px-2 py-2.5">
                            <div className="flex items-center justify-center gap-1">
                              {renderNumberInput(
                                index,
                                'hipMin',
                                row.hipMin,
                                'Min',
                              )}
                              <span className="text-gray-400">-</span>
                              {renderNumberInput(
                                index,
                                'hipMax',
                                row.hipMax,
                                'Max',
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-right">
                            <button
                              type="button"
                              disabled={rows.length <= 1}
                              onClick={() => handleRemoveRow(index)}
                              className="rounded p-1 text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent cursor-pointer"
                              aria-label="Remove size row"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                        {validation.rowErrors[index] && (
                          <tr className="bg-rose-50/70">
                            <td
                              colSpan={7}
                              className="px-3 py-1.5 text-xs text-rose-700"
                            >
                              {validation.rowErrors[index]}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold tracking-wider text-gray-700 uppercase hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-black px-5 py-2 text-xs font-semibold tracking-wider text-white uppercase hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting
                ? 'Saving...'
                : isEditing
                  ? 'Save Changes'
                  : 'Create Size Chart'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
