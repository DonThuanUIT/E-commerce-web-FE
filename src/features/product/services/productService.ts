import { axiosInstance } from '../../../config/axios';
import type { ApiResponse } from '../../../shared/types/apiType';
import type { ProductDetail } from '../types/product';

/**
 * Service to interact with Product REST endpoints.
 */
export const productService = {
  /**
   * Fetches product details by slug, including variants with real-time stock calculation.
   *
   * @param slug - The unique product slug identifier
   * @returns Product detail DTO
   */
  async getProductBySlug(slug: string): Promise<ProductDetail> {
    const response = await axiosInstance.get<ApiResponse<ProductDetail>>(
      `/v1/products/${slug}`,
    );

    // If response.data represents an ApiResponse envelope
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(
      response.data?.error?.message || 'Failed to load product details',
    );
  },
};
