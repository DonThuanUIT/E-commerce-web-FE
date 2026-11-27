import { axiosInstance } from '../../../config/axios';
import type { ApiResponse } from '../../../shared/types/apiType';
import type { WishlistItem, WishlistStatus } from '../types/wishlistType';

export const wishlistService = {
  /**
   * Retrieves all items in the customer's wishlist.
   */
  async getWishlist(): Promise<WishlistItem[]> {
    const response =
      await axiosInstance.get<ApiResponse<WishlistItem[]>>('/v1/wishlist');
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    return [];
  },

  /**
   * Checks if a product is in the customer's wishlist.
   */
  async checkStatus(productId: string): Promise<boolean> {
    const response = await axiosInstance.get<ApiResponse<WishlistStatus>>(
      `/v1/wishlist/${productId}/status`,
    );
    if (response.data && response.data.success && response.data.data) {
      return response.data.data.isWishlisted;
    }
    return false;
  },

  /**
   * Adds a product to the customer's wishlist (idempotent).
   */
  async add(productId: string): Promise<void> {
    await axiosInstance.put(`/v1/wishlist/${productId}`);
  },

  /**
   * Removes a product from the customer's wishlist (idempotent).
   */
  async remove(productId: string): Promise<void> {
    await axiosInstance.delete(`/v1/wishlist/${productId}`);
  },
};
