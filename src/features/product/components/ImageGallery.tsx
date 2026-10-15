import React, { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import type { ProductImageDetail } from '../types/product';

interface ImageGalleryProps {
  images: ProductImageDetail[];
  productName: string;
}

/**
 * Editorial Luxury 2x2 Image Gallery component inspired by Atelier fashion lookbooks.
 *
 * Supports multi-angle inspection with responsive grid layout and interactive focus.
 */
export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  productName,
}) => {
  // Sort images by displayOrder ascending
  const sortedImages = [...images].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );
  const [activeImage, setActiveImage] = useState<string>(
    sortedImages.find((img) => img.isPrimary)?.imageUrl ||
      sortedImages[0]?.imageUrl ||
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
  );
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Fallback if no images
  if (sortedImages.length === 0) {
    return (
      <div className="flex aspect-3/4 w-full items-center justify-center rounded-lg bg-neutral-100 text-neutral-400">
        Chưa có hình ảnh cho sản phẩm này
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Banner & Zoom Control */}
      <div className="flex items-center justify-between text-xs tracking-wider text-neutral-500 uppercase">
        <span className="font-medium text-neutral-800">
          Bộ sưu tập thủ công • Milan Archive
        </span>
        <button
          type="button"
          onClick={() => setIsZoomOpen(true)}
          className="flex items-center gap-1.5 transition-colors hover:text-neutral-900"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          <span>Xem ảnh phóng to</span>
        </button>
      </div>

      {/* Main Focus on Mobile / Desktop 2-column or 2x2 Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sortedImages.map((img, index) => {
          const isSelected = activeImage === img.imageUrl;
          const caption =
            index === 0
              ? 'Fig. 01 — Toàn cảnh phom dáng'
              : index === 1
                ? 'Fig. 02 — Chi tiết chất vải & nút'
                : index === 2
                  ? 'Fig. 03 — Góc nhìn chuyển động'
                  : `Fig. 04 — Phía sau lưng & chiết eo`;

          return (
            <div
              key={img.id || index}
              onClick={() => setActiveImage(img.imageUrl)}
              className={`group relative aspect-3/4 cursor-pointer overflow-hidden rounded-md bg-neutral-100 transition-all ${
                isSelected
                  ? 'ring-2 ring-neutral-900 ring-offset-2'
                  : 'hover:opacity-90'
              }`}
            >
              <img
                src={img.imageUrl}
                alt={`${productName} - ${caption}`}
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                loading={index < 2 ? 'eager' : 'lazy'}
              />

              {/* Editorial Caption Tag */}
              <div className="absolute top-3 left-3 rounded bg-white/85 px-2.5 py-1 text-[11px] font-medium tracking-wide text-neutral-800 backdrop-blur-xs">
                {caption}
              </div>
            </div>
          );
        })}
      </div>

      {/* Material & Tailoring Quality Highlight Card */}
      <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 p-4">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold tracking-wide text-neutral-900">
            Chất liệu dệt may thủ công cao cấp
          </h4>
          <p className="text-xs text-neutral-600">
            Từng thớ vải được xử lý dệt co giãn 4 chiều thoáng khí, đảm bảo phom
            dáng chuẩn xác qua thời gian.
          </p>
        </div>
        <span className="text-xs font-medium text-neutral-900 underline underline-offset-4">
          Chứng chỉ dệt may
        </span>
      </div>

      {/* Modal Zoom Popup */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setIsZoomOpen(false)}
        >
          <div className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-lg bg-white p-2">
            <img
              src={activeImage}
              alt={productName}
              className="max-h-[85vh] w-auto object-contain"
            />
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-4 right-4 rounded-full bg-neutral-900/80 px-3 py-1 text-xs text-white"
            >
              Đóng (ESC)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
