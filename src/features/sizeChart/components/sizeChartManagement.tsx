import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  Pencil,
  Plus,
  RefreshCw,
  Ruler,
  Search,
  Trash2,
  X,
  XCircle,
} from 'lucide-react';
import { ApiRequestError } from '../../../shared/api/apiRequestError';
import { Can } from '../../staffAuth/components/can';
import {
  useCreateSizeChart,
  useDeleteSizeChart,
  useSizeCharts,
  useUpdateSizeChart,
} from '../hooks/useSizeCharts';
import type { SizeChart, SizeChartPayload } from '../types/sizeChartType';
import { SizeChartFormModal } from './sizeChartFormModal';

interface ToastState {
  type: 'success' | 'error';
  message: string;
}

/**
 * Admin Size Charts Management console (`/admin/size-charts`).
 */
export const SizeChartManagement: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') ?? '0') || 0;
  const size = Number(searchParams.get('size') ?? '20') || 20;
  const keyword = searchParams.get('keyword') ?? '';

  const [searchInput, setSearchInput] = useState(keyword);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChart, setEditingChart] = useState<SizeChart | null>(null);
  const [deletingChart, setDeletingChart] = useState<SizeChart | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const { data, isLoading, isError, error, refetch } = useSizeCharts({
    keyword: keyword || undefined,
    page,
    size,
  });

  const createMutation = useCreateSizeChart();
  const updateMutation = useUpdateSizeChart();
  const deleteMutation = useDeleteSizeChart();

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 4000);
  };

  const extractErrorMessage = (err: unknown, fallback: string): string => {
    if (err instanceof ApiRequestError) return err.message || fallback;
    if (err instanceof Error) return err.message;
    return fallback;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      next.set('keyword', searchInput.trim());
    } else {
      next.delete('keyword');
    }
    next.set('page', '0');
    setSearchParams(next);
  };

  const handlePageChange = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(nextPage));
    setSearchParams(next);
  };

  const handleFormSubmit = async (payload: SizeChartPayload) => {
    try {
      if (editingChart) {
        await updateMutation.mutateAsync({ id: editingChart.id, payload });
        showToast('success', 'Size chart updated successfully.');
      } else {
        await createMutation.mutateAsync(payload);
        showToast('success', 'Size chart created successfully.');
      }
      setIsModalOpen(false);
      setEditingChart(null);
    } catch (err) {
      showToast(
        'error',
        extractErrorMessage(err, 'Failed to save size chart.'),
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingChart) return;
    try {
      await deleteMutation.mutateAsync(deletingChart.id);
      showToast('success', 'Size chart deleted.');
      setDeletingChart(null);
    } catch (err) {
      showToast(
        'error',
        extractErrorMessage(err, 'Failed to delete size chart.'),
      );
    }
  };

  const charts = data?.items ?? [];

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-8">
      {toast && (
        <div className="fixed right-4 bottom-4 z-50 max-w-sm">
          <div
            role="status"
            className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-xs font-medium shadow-lg ${
              toast.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-rose-200 bg-rose-50 text-rose-800'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-widest text-gray-400 uppercase">
            Catalog Configuration
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
            Size Charts
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure body measurement ranges for garment types to power size
            recommendations.
          </p>
        </div>

        <Can perform="product:write">
          <button
            type="button"
            onClick={() => {
              setEditingChart(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-xs font-semibold tracking-wider text-white uppercase transition hover:bg-neutral-800 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>New Size Chart</span>
          </button>
        </Can>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search size charts by name..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pr-4 pl-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black focus:bg-white focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold tracking-wider text-gray-700 uppercase hover:bg-gray-50 cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xs">
        {isLoading ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-12 animate-pulse rounded-lg bg-gray-100"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 text-center">
            <p className="text-sm font-medium text-rose-700">
              {extractErrorMessage(error, 'Failed to load size charts.')}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : charts.length === 0 ? (
          <div className="p-12 text-center">
            <Ruler className="mx-auto h-10 w-10 text-gray-400" />
            <h2 className="mt-3 text-base font-semibold text-gray-900">
              No size charts found
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Create your first size chart or adjust your search query.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 font-mono text-[10px] tracking-wider text-gray-500 uppercase">
                  <tr>
                    <th className="px-6 py-3.5">Chart Name</th>
                    <th className="px-6 py-3.5">Sizes</th>
                    <th className="px-6 py-3.5">Rows</th>
                    <th className="px-6 py-3.5">Last Updated</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {charts.map((chart) => (
                    <tr
                      key={chart.id}
                      className="transition hover:bg-gray-50/70"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {chart.name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {chart.rows.map((r) => (
                            <span
                              key={r.id ?? r.sizeCode}
                              className="rounded border border-gray-200 bg-gray-100 px-2 py-0.5 font-mono text-[11px] font-medium text-gray-800"
                            >
                              {r.sizeCode}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-600">
                        {chart.rows.length}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">
                        {new Date(chart.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Can perform="product:write">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingChart(chart);
                                setIsModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingChart(chart)}
                              className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </Can>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3.5 text-xs text-gray-600">
                <span>
                  Page {data.page + 1} / {data.totalPages} (Total{' '}
                  {data.totalElements} charts)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={data.first}
                    onClick={() => handlePageChange(data.page - 1)}
                    className="rounded border border-gray-300 px-3 py-1 disabled:opacity-40 cursor-pointer"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={data.last}
                    onClick={() => handlePageChange(data.page + 1)}
                    className="rounded border border-gray-300 px-3 py-1 disabled:opacity-40 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {isModalOpen && (
        <SizeChartFormModal
          key={editingChart?.id ?? 'new'}
          isOpen={isModalOpen}
          editingChart={editingChart}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          onClose={() => {
            setIsModalOpen(false);
            setEditingChart(null);
          }}
          onSubmit={handleFormSubmit}
        />
      )}

      {deletingChart && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-2 text-rose-700">
                <AlertTriangle className="h-5 w-5" />
                <h2 className="text-base font-semibold text-gray-900">
                  Delete Size Chart
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDeletingChart(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-6 py-5 text-sm text-gray-600">
              Are you sure you want to delete{' '}
              <strong className="text-gray-900">{deletingChart.name}</strong>?
              Charts currently assigned to products cannot be deleted.
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setDeletingChart(null)}
                disabled={deleteMutation.isPending}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 uppercase hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white uppercase hover:bg-rose-700 disabled:opacity-60 cursor-pointer"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
