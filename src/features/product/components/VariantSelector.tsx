import React, { useMemo, useState } from 'react';
import {
  Check,
  Heart,
  Ruler,
  ShoppingBag,
  Sparkles,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import type { ProductDetail, ProductVariantDetail } from '../types/product';

interface VariantSelectorProps {
  product: ProductDetail;
  onAddToCart?: (variant: ProductVariantDetail, quantity: number) => void;
}

/**
 * Currency formatter for Vietnamese Dong (VND) adhering to project specifications.
 */
function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

/**
 * Interactive Variant Selector component implementing User Story [US-09].
 *
 * Provides real-time stock calculation (availableStock = onHand - reserved)
 * and automatically disables out-of-stock combinations matching the Figma Atelier design.
 */
export const VariantSelector: React.FC<VariantSelectorProps> = ({
  product,
  onAddToCart,
}) => {
  // 1. Extract unique colors and sizes from variants
  const colorOptions = useMemo(() => {
    const map = new Map<string, { value: string; colorHex: string | null }>();
    product.variants.forEach((v) => {
      const colorAttr = v.attributes.find((a) => a.attributeName === 'Màu sắc');
      if (colorAttr && !map.has(colorAttr.value)) {
        map.set(colorAttr.value, {
          value: colorAttr.value,
          colorHex: colorAttr.colorHex,
        });
      }
    });
    return Array.from(map.values());
  }, [product.variants]);

  const sizeOptions = useMemo(() => {
    const set = new Set<string>();
    product.variants.forEach((v) => {
      const sizeAttr = v.attributes.find((a) => a.attributeName === 'Kích cỡ');
      if (sizeAttr) set.add(sizeAttr.value);
    });
    return Array.from(set);
  }, [product.variants]);

  // Initial selections: Pick first available in-stock variant or default
  const defaultVariant =
    product.variants.find((v) => v.inStock && v.availableStock > 0) ||
    product.variants[0];

  const initialColor =
    defaultVariant?.attributes.find((a) => a.attributeName === 'Màu sắc')
      ?.value ||
    colorOptions[0]?.value ||
    '';

  const initialSize =
    defaultVariant?.attributes.find((a) => a.attributeName === 'Kích cỡ')
      ?.value ||
    sizeOptions[0] ||
    '';

  const [selectedColor, setSelectedColor] = useState<string>(initialColor);
  const [selectedSize, setSelectedSize] = useState<string>(initialSize);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [addFeedback, setAddFeedback] = useState<string | null>(null);

  // 2. Identify the active variant matching selected color & size
  const activeVariant = useMemo(() => {
    return product.variants.find((v) => {
      const matchColor = v.attributes.some(
        (a) => a.attributeName === 'Màu sắc' && a.value === selectedColor,
      );
      const matchSize = v.attributes.some(
        (a) => a.attributeName === 'Kích cỡ' && a.value === selectedSize,
      );
      return matchColor && matchSize;
    });
  }, [product.variants, selectedColor, selectedSize]);

  // Pricing calculations
  const currentPrice = activeVariant ? activeVariant.price : product.basePrice;
  const comparePrice = activeVariant?.compareAtPrice;
  const isOutOfStock = !activeVariant || activeVariant.availableStock <= 0;

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (isOutOfStock || !activeVariant) return;
    if (onAddToCart) {
      onAddToCart(activeVariant, 1);
    }
    setAddFeedback(
      `Đã thêm ${product.name} (${selectedColor} - Size ${selectedSize}) vào giỏ hàng!`,
    );
    setTimeout(() => setAddFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Information: Collection & Title */}
      <div className="space-y-2 border-b border-neutral-200 pb-5">
        <div className="flex items-center justify-between text-xs tracking-wider text-neutral-500 uppercase">
          <span>{product.category.name} — BỘ SƯU TẬP THU ĐÔNG</span>
          <span className="rounded bg-neutral-100 px-2 py-0.5 text-[11px] font-mono font-medium text-neutral-700">
            MÃ: {activeVariant?.sku || 'ATELIER-01'}
          </span>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
          {product.name}
        </h1>

        {/* Rating & Social Proof */}
        <div className="flex items-center gap-3 text-xs text-neutral-600">
          <div className="flex items-center gap-1 font-semibold text-neutral-900">
            <span className="text-amber-500">★</span>
            <span>{product.avgRating.toFixed(1)}</span>
          </div>
          <span>•</span>
          <span className="underline underline-offset-2">
            {product.reviewCount} Đánh giá từ khách hàng
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-emerald-700">
            <Sparkles className="h-3 w-3" />
            Đã bán {product.soldCount}+
          </span>
        </div>

        {/* Price Display */}
        <div className="flex items-baseline gap-3 pt-2">
          <span className="text-2xl font-bold tracking-tight text-neutral-900">
            {formatVND(currentPrice)}
          </span>
          {comparePrice && comparePrice > currentPrice && (
            <>
              <span className="text-base text-neutral-400 line-through">
                {formatVND(comparePrice)}
              </span>
              <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                Tiết kiệm {formatVND(comparePrice - currentPrice)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* 2. Color Palette Selector */}
      {colorOptions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold tracking-wider text-neutral-900 uppercase">
              BẢNG MÀU:{' '}
              <span className="font-normal text-neutral-600">
                {selectedColor}
              </span>
            </span>
            <span className="text-neutral-400">
              {colorOptions.length} Lựa chọn
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {colorOptions.map((opt) => {
              const isSelected = selectedColor === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedColor(opt.value)}
                  className={`flex items-center gap-2 rounded-md border px-3.5 py-2 text-xs font-medium transition-all ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-300 bg-white text-neutral-800 hover:border-neutral-400'
                  }`}
                >
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-black/20"
                    style={{
                      backgroundColor: opt.colorHex || '#1A1A1A',
                    }}
                  />
                  <span>{opt.value}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Size Selector with Real-time Stock Calculation & Disabling */}
      {sizeOptions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold tracking-wider text-neutral-900 uppercase">
              CHỌN KÍCH CỠ:{' '}
              <span className="font-normal text-neutral-600">
                {selectedSize}
              </span>
            </span>
            <button
              type="button"
              className="flex items-center gap-1 text-neutral-600 underline underline-offset-2 hover:text-neutral-900"
            >
              <Ruler className="h-3.5 w-3.5" />
              <span>Bảng quy đổi kích cỡ</span>
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-5">
            {sizeOptions.map((size) => {
              // Find variant matching current selected color & this size
              const variantForSize = product.variants.find((v) => {
                const matchC = v.attributes.some(
                  (a) =>
                    a.attributeName === 'Màu sắc' && a.value === selectedColor,
                );
                const matchS = v.attributes.some(
                  (a) => a.attributeName === 'Kích cỡ' && a.value === size,
                );
                return matchC && matchS;
              });

              const isSelected = selectedSize === size;
              const stock = variantForSize ? variantForSize.availableStock : 0;
              const isSizeOutOfStock = !variantForSize || stock <= 0;
              const isLowStock = stock > 0 && stock <= 5;

              return (
                <button
                  key={size}
                  type="button"
                  disabled={isSizeOutOfStock}
                  onClick={() => setSelectedSize(size)}
                  title={
                    isSizeOutOfStock
                      ? `Size ${size} màu ${selectedColor} hiện đã hết hàng`
                      : `Size ${size} - Còn ${stock} sản phẩm`
                  }
                  className={`relative flex flex-col items-center justify-center rounded-md border py-3 text-xs font-semibold transition-all ${
                    isSizeOutOfStock
                      ? 'cursor-not-allowed border-dashed border-neutral-300 bg-neutral-100 text-neutral-400 line-through opacity-50'
                      : isSelected
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-300 bg-white text-neutral-800 hover:border-neutral-900'
                  }`}
                >
                  <span>{size}</span>

                  {/* Out of Stock Label */}
                  {isSizeOutOfStock && (
                    <span className="text-[10px] font-normal not-italic text-rose-500">
                      Hết hàng
                    </span>
                  )}

                  {/* Low Stock Badge (Figma "2 left" equivalent) */}
                  {!isSizeOutOfStock && isLowStock && (
                    <span className="absolute -top-2 -right-1 rounded bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-amber-800 shadow-xs">
                      Còn {stock}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Fit Recommendation Note */}
          <div className="flex items-center gap-2 rounded-md bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
            <Check className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>
              <strong>Phom dáng tiêu chuẩn:</strong> Người mẫu cao 178cm mặc
              size M chuẩn phom vừa vặn.
            </span>
          </div>
        </div>
      )}

      {/* Stock Status Notification for Active Variant */}
      {activeVariant && (
        <div className="text-xs">
          {activeVariant.availableStock > 0 ? (
            <p className="flex items-center gap-1.5 font-medium text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Sẵn sàng giao hàng • Còn lại{' '}
              <strong>{activeVariant.availableStock}</strong> sản phẩm trong kho
            </p>
          ) : (
            <p className="flex items-center gap-1.5 font-medium text-rose-600">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Biến thể này tạm thời hết hàng trong kho. Vui lòng chọn màu hoặc
              kích cỡ khác.
            </p>
          )}
        </div>
      )}

      {/* 4. Action Buttons (Add to Cart & Wishlist) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md py-3.5 text-sm font-semibold tracking-wide transition-all ${
              isOutOfStock
                ? 'cursor-not-allowed bg-neutral-200 text-neutral-400'
                : 'bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[0.99]'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>
              {isOutOfStock
                ? 'TẠM HẾT HÀNG'
                : `THÊM VÀO GIỎ HÀNG — ${formatVND(currentPrice)}`}
            </span>
          </button>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={() => setIsWishlisted(!isWishlisted)}
            title="Lưu vào danh sách yêu thích"
            className={`flex h-12 w-12 items-center justify-center rounded-md border transition-all ${
              isWishlisted
                ? 'border-rose-500 bg-rose-50 text-rose-600'
                : 'border-neutral-300 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900'
            }`}
          >
            <Heart
              className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`}
            />
          </button>
        </div>

        {/* Feedback Alert */}
        {addFeedback && (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
            {addFeedback}
          </div>
        )}
      </div>

      {/* 5. Trust Value Proposition Cards (Insured courier & Warranty) */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3.5 text-xs text-neutral-700">
          <Truck className="h-4 w-4 shrink-0 text-neutral-900" />
          <div>
            <p className="font-semibold text-neutral-900">
              GIAO HÀNG HỎA TỐC ĐẢM BẢO
            </p>
            <p className="text-neutral-600">
              Miễn phí giao hàng toàn quốc từ 2-4 ngày làm việc kèm đồng kiểm
              khi nhận.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3.5 text-xs text-neutral-700">
          <ShieldCheck className="h-4 w-4 shrink-0 text-neutral-900" />
          <div>
            <p className="font-semibold text-neutral-900">
              CAM KẾT BẢO HÀNH CHÍNH HÃNG
            </p>
            <p className="text-neutral-600">
              Đổi trả miễn phí trong 15 ngày nếu lỗi sản xuất và hỗ trợ bảo hành
              đường may trọn đời.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
