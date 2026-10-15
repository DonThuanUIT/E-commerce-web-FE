/**
 * Category information associated with a product.
 */
export interface ProductCategoryDetail {
  id: string;
  name: string;
  slug: string;
}

/**
 * Gallery image item for a product.
 */
export interface ProductImageDetail {
  id: string;
  imageUrl: string;
  displayOrder: number;
  isPrimary: boolean;
}

/**
 * Concrete attribute value bound to a variant (e.g. Color: Black (#1A1A1A), Size: M).
 */
export interface ProductAttributeDetail {
  attributeId: string;
  attributeName: string;
  valueId: string;
  value: string;
  colorHex: string | null;
}

/**
 * Variant (SKU) details including stock calculation.
 *
 * `availableStock` is computed as `Math.max(0, onHand - reserved)`.
 * `inStock` is `true` if `availableStock > 0`.
 */
export interface ProductVariantDetail {
  id: string;
  sku: string;
  imageUrl: string | null;
  price: number;
  compareAtPrice: number | null;
  isActive: boolean;
  onHand: number;
  reserved: number;
  availableStock: number;
  inStock: boolean;
  attributes: ProductAttributeDetail[];
}

/**
 * Verified and visible customer review.
 */
export interface ProductReviewDetail {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

/**
 * Comprehensive Product Detail response model (US-09).
 */
export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  material: string | null;
  status: number;
  avgRating: number;
  reviewCount: number;
  soldCount: number;
  basePrice: number;
  category: ProductCategoryDetail;
  images: ProductImageDetail[];
  variants: ProductVariantDetail[];
  reviews: ProductReviewDetail[];
}
