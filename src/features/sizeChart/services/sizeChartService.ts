import type { ApiResponse, PageResponse } from '../../../shared/types/apiType';
import { staffAxios } from '../../staffAuth/services/staffAxios';
import type {
  SizeChart,
  SizeChartPayload,
  SizeChartQueryParams,
} from '../types/sizeChartType';

/**
 * Service handling Admin Size Chart CRUD endpoints (`/api/v1/admin/size-charts`).
 */
export const sizeChartService = {
  async listSizeCharts(
    params?: SizeChartQueryParams,
    signal?: AbortSignal,
  ): Promise<PageResponse<SizeChart>> {
    const response = await staffAxios.get<ApiResponse<PageResponse<SizeChart>>>(
      '/v1/admin/size-charts',
      { params, signal },
    );

    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(
      response.data?.error?.message || 'Unable to load size charts',
    );
  },

  async getSizeChart(id: string, signal?: AbortSignal): Promise<SizeChart> {
    const response = await staffAxios.get<ApiResponse<SizeChart>>(
      `/v1/admin/size-charts/${id}`,
      { signal },
    );

    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(
      response.data?.error?.message || 'Unable to load size chart detail',
    );
  },

  async createSizeChart(payload: SizeChartPayload): Promise<SizeChart> {
    const response = await staffAxios.post<ApiResponse<SizeChart>>(
      '/v1/admin/size-charts',
      payload,
    );

    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(
      response.data?.error?.message || 'Unable to create size chart',
    );
  },

  async updateSizeChart(
    id: string,
    payload: SizeChartPayload,
  ): Promise<SizeChart> {
    const response = await staffAxios.put<ApiResponse<SizeChart>>(
      `/v1/admin/size-charts/${id}`,
      payload,
    );

    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(
      response.data?.error?.message || 'Unable to update size chart',
    );
  },

  async deleteSizeChart(id: string): Promise<void> {
    const response = await staffAxios.delete<ApiResponse<null>>(
      `/v1/admin/size-charts/${id}`,
    );

    if (response.data && response.data.success) {
      return;
    }

    throw new Error(
      response.data?.error?.message || 'Unable to delete size chart',
    );
  },
};
