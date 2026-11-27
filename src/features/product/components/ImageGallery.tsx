import React, { useState } from 'react';
import { Maximize2, X, Sparkles } from 'lucide-react';
import type { ProductImageDetail } from '../types/product';

interface ImageGalleryProps {
  images: ProductImageDetail[];
  productName: string;
}

// Curated high-resolution fashion fallback images if third-party links are broken
const CURATED_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
];

/**
 * Editorial Luxury Product Image Gallery component (US-09).
 *
 * Implements a primary focal image showcase on top with an interactive
 * thumbnail strip directly underneath, complete with broken-image healing.
 */
export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  productName,
}) => {
  // Sort images by displayOrder ascending
  const sortedImages = [...images].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  const initialPrimary =
    sortedImages.find((img) => img.isPrimary)?.imageUrl ||
    sortedImages[0]?.imageUrl ||
    CURATED_FALLBACK_IMAGES[0];

  const [activeImage, setActiveImage] = useState<string>(initialPrimary);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Fallback if no images provided at all
  if (sortedImages.length === 0) {
    return (
      <div className="flex aspect-3/4 w-full flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 text-neutral-400">
        <Sparkles className="h-8 w-8 text-neutral-300" />
        <span className="mt-2 text-xs font-medium tracking-wider uppercase">
          No images available for this piece
        </span>
      </div>
    );
  }

  const handleThumbnailClick = (imageUrl: string, index: number) => {
    setActiveImage(imageUrl);
    setActiveIndex(index);
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement>,
    index: number,
  ) => {
    const fallbackUrl =
      CURATED_FALLBACK_IMAGES[index % CURATED_FALLBACK_IMAGES.length];
    if (e.currentTarget.src !== fallbackUrl) {
      e.currentTarget.src = fallbackUrl;
      // If the currently active image is the broken one, update activeImage state too
      if (activeImage === e.currentTarget.src) {
        setActiveImage(fallbackUrl);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Information & Fullscreen Trigger */}
      <div className="flex items-center justify-between text-xs tracking-wider text-neutral-500 uppercase">
        <span className="font-semibold text-neutral-800">
          Atelier Artisanal Archive • Milan Edition
        </span>
        <button
          type="button"
          onClick={() => setIsZoomOpen(true)}
          className="flex cursor-pointer items-center gap-1.5 font-medium transition-colors hover:text-neutral-900"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          <span>Phóng to toàn cảnh</span>
        </button>
      </div>

      {/* 2. Primary Focal Image (Khung ảnh chính lớn ở trên) */}
      <div className="group relative aspect-3/4 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-sm">
        <img
          src={activeImage}
          alt={`${productName} - Góc chụp chi tiết`}
          onError={(e) => handleImageError(e, activeIndex)}
          className="h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
        />

        {/* Editorial Caption Tag */}
        <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3.5 py-1 text-xs font-semibold tracking-wide text-neutral-800 shadow-xs backdrop-blur-md">
          {activeIndex === 0
            ? 'Fig. 01 — Góc chụp toàn thân (Full Silhouette)'
            : activeIndex === 1
              ? 'Fig. 02 — Cận cảnh chi tiết dệt (Weave & Texture)'
              : activeIndex === 2
                ? 'Fig. 03 — Góc nghiêng & Độ rủ (Motion & Drape)'
                : `Fig. 0${activeIndex + 1} — Chi tiết thiết kế`}
        </div>

        {/* Quick Zoom Hint on Hover */}
        <button
          type="button"
          onClick={() => setIsZoomOpen(true)}
          className="absolute right-4 bottom-4 flex cursor-pointer items-center gap-1.5 rounded-full bg-neutral-900/80 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-md backdrop-blur-xs transition-opacity duration-300 group-hover:opacity-100 hover:bg-neutral-900"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          <span>Xem chi tiết</span>
        </button>
      </div>

      {/* 3. Thumbnails Strip (Hàng ảnh thu nhỏ bên dưới) */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-medium tracking-wider text-neutral-400 uppercase">
          Chọn góc nhìn ({sortedImages.length} hình ảnh):
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1.5">
          {sortedImages.map((img, idx) => {
            const isSelected =
              activeImage === img.imageUrl || activeIndex === idx;
            return (
              <button
                type="button"
                key={img.id || idx}
                onClick={() => handleThumbnailClick(img.imageUrl, idx)}
                className={`group relative aspect-3/4 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border bg-neutral-100 transition-all duration-200 sm:w-24 ${
                  isSelected
                    ? 'border-neutral-900 ring-2 ring-neutral-900 ring-offset-2'
                    : 'border-neutral-200 opacity-70 hover:border-neutral-400 hover:opacity-100'
                }`}
              >
                <img
                  src={img.imageUrl}
                  alt={`${productName} - Thu nhỏ ${idx + 1}`}
                  onError={(e) => handleImageError(e, idx)}
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
                />
                {isSelected && (
                  <span className="absolute inset-x-0 bottom-0 bg-neutral-900/75 py-0.5 text-center text-[9px] font-medium text-white">
                    Đang xem
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Material & Tailoring Quality Highlight Card */}
      <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50/80 p-4">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold tracking-wide text-neutral-900">
            Bespoke Handcrafted Weave & Finishing
          </h4>
          <p className="text-xs text-neutral-600">
            Mỗi sợi vải được dệt với độ đàn hồi 4 chiều thoáng khí, giữ phom
            dáng chuẩn mực theo thời gian.
          </p>
        </div>
        <span className="text-xs font-semibold text-neutral-900 underline underline-offset-4">
          Tiêu chuẩn dệt may
        </span>
      </div>

      {/* 5. Modal Fullscreen Inspection */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="relative flex max-h-[92vh] max-w-5xl flex-col items-center justify-center overflow-hidden rounded-2xl bg-neutral-950 p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-4 right-4 z-10 flex cursor-pointer items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md transition-colors hover:bg-white/30"
            >
              <X className="h-4 w-4" />
              <span>Đóng (ESC)</span>
            </button>

            <img
              src={activeImage}
              alt={productName}
              className="max-h-[85vh] w-auto max-w-full rounded-lg object-contain shadow-lg"
            />

            <div className="mt-3 flex items-center gap-2 text-xs text-neutral-400">
              <span>{productName}</span>
              <span>•</span>
              <span>Góc nhìn số {activeIndex + 1}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
