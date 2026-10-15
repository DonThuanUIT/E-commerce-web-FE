import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import type { ProductDetail } from '../types/product';

/**
 * Custom React Query hook for fetching and caching product details.
 *
 * @param slug - The product slug URL parameter
 */
export function useProductDetail(slug: string | undefined) {
  return useQuery<ProductDetail, Error>({
    queryKey: ['product', slug],
    queryFn: () => {
      if (!slug) {
        throw new Error('Mã định danh sản phẩm (slug) không hợp lệ');
      }
      return productService.getProductBySlug(slug);
    },
    enabled: Boolean(slug),
  });
}
