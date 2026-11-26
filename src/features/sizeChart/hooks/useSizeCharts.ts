import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sizeChartService } from '../services/sizeChartService';
import type {
  SizeChartPayload,
  SizeChartQueryParams,
} from '../types/sizeChartType';

export const sizeChartKeys = {
  all: ['admin-size-charts'] as const,
  lists: () => [...sizeChartKeys.all, 'list'] as const,
  list: (params: SizeChartQueryParams) =>
    [...sizeChartKeys.lists(), params] as const,
  details: () => [...sizeChartKeys.all, 'detail'] as const,
  detail: (id: string) => [...sizeChartKeys.details(), id] as const,
};

export function useSizeCharts(params: SizeChartQueryParams) {
  return useQuery({
    queryKey: sizeChartKeys.list(params),
    queryFn: ({ signal }) => sizeChartService.listSizeCharts(params, signal),
  });
}

export function useCreateSizeChart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SizeChartPayload) =>
      sizeChartService.createSizeChart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sizeChartKeys.lists() });
    },
  });
}

export function useUpdateSizeChart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SizeChartPayload }) =>
      sizeChartService.updateSizeChart(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sizeChartKeys.lists() });
    },
  });
}

export function useDeleteSizeChart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sizeChartService.deleteSizeChart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sizeChartKeys.lists() });
    },
  });
}
