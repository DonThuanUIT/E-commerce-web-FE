import { axiosInstance } from '../../../config/axios';
import type { ApiResponse } from '../../../shared/types/apiType';
import type {
  CreateAddressPayload,
  CustomerAddress,
  UpdateAddressPayload,
} from '../types/addressType';

/**
 * Service handling customer delivery address REST endpoints (`/api/v1/customer-addresses`).
 */
export const addressService = {
  async getAddresses(signal?: AbortSignal): Promise<CustomerAddress[]> {
    const response = await axiosInstance.get<ApiResponse<CustomerAddress[]>>(
      '/v1/customer-addresses',
      { signal },
    );

    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(
      response.data?.error?.message || 'Unable to load delivery addresses',
    );
  },

  async createAddress(payload: CreateAddressPayload): Promise<CustomerAddress> {
    const response = await axiosInstance.post<ApiResponse<CustomerAddress>>(
      '/v1/customer-addresses',
      payload,
    );

    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(
      response.data?.error?.message || 'Unable to create delivery address',
    );
  },

  async updateAddress(
    id: string,
    payload: UpdateAddressPayload,
  ): Promise<CustomerAddress> {
    const response = await axiosInstance.put<ApiResponse<CustomerAddress>>(
      `/v1/customer-addresses/${id}`,
      payload,
    );

    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(
      response.data?.error?.message || 'Unable to update delivery address',
    );
  },

  async deleteAddress(id: string): Promise<void> {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      `/v1/customer-addresses/${id}`,
    );

    if (response.data && response.data.success) {
      return;
    }

    throw new Error(
      response.data?.error?.message || 'Unable to delete delivery address',
    );
  },

  async setDefaultAddress(id: string): Promise<CustomerAddress> {
    const response = await axiosInstance.patch<ApiResponse<CustomerAddress>>(
      `/v1/customer-addresses/${id}/default`,
    );

    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(
      response.data?.error?.message || 'Unable to set default address',
    );
  },
};
