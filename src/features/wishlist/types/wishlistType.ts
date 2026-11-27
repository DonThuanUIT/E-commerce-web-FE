/**
 * Item in customer's wishlist.
 */
export interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  minPrice: number | null;
  categoryName: string;
  categorySlug: string;
  primaryImageUrl: string | null;
  inStock: boolean;
  addedAt: string;
}

/**
 * Status of a specific product in customer's wishlist.
 */
export interface WishlistStatus {
  productId: string;
  isWishlisted: boolean;
}
