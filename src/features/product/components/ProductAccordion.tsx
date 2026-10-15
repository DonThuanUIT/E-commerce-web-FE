import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';
import type { ProductDetail } from '../types/product';

interface ProductAccordionProps {
  product: ProductDetail;
}

/**
 * Editorial Collapsible Accordion for Product Details, Materials, and Reviews.
 */
export const ProductAccordion: React.FC<ProductAccordionProps> = ({
  product,
}) => {
  const [openSection, setOpenSection] = useState<string | null>('design');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="divide-y divide-neutral-200 border-t border-b border-neutral-200">
      {/* 1. Design & Silhouette */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection('design')}
          className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold tracking-wide text-neutral-900 uppercase"
        >
          <span>Thiết kế & Kiểu dáng</span>
          {openSection === 'design' ? (
            <ChevronUp className="h-4 w-4 text-neutral-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-neutral-500" />
          )}
        </button>

        {openSection === 'design' && (
          <div className="space-y-3 pb-5 text-xs leading-relaxed text-neutral-600">
            <p>
              {product.description ||
                'Sản phẩm được thiết kế theo tiêu chuẩn may đo cao cấp với phom dáng chuẩn mực, mang lại vẻ ngoài lịch lãm, hiện đại và trẻ trung.'}
            </p>
            <ul className="list-inside list-disc space-y-1 text-neutral-700">
              <li>Cổ áo và tay áo được dệt bo viền tinh xảo, chống bai dão</li>
              <li>
                Đường chỉ may kép chắc chắn, đều đặn theo tiêu chuẩn xuất khẩu
              </li>
              <li>
                Phù hợp mặc đi làm, dạo phố hoặc các hoạt động thể thao nhẹ
                nhàng
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* 2. Materials & Composition */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection('materials')}
          className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold tracking-wide text-neutral-900 uppercase"
        >
          <span>Chất liệu & Thành phần</span>
          {openSection === 'materials' ? (
            <ChevronUp className="h-4 w-4 text-neutral-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-neutral-500" />
          )}
        </button>

        {openSection === 'materials' && (
          <div className="space-y-2 pb-5 text-xs leading-relaxed text-neutral-600">
            <p>
              <strong>Thành phần cấu tạo:</strong>{' '}
              {product.material || '100% Sợi cotton tự nhiên kết hợp Spandex'}
            </p>
            <p>
              <strong>Hướng dẫn bảo quản:</strong> Giặt máy ở chế độ nhẹ nhàng
              (nhiệt độ dưới 30°C). Tránh ngâm lâu với chất tẩy mạnh. Là ủi ở
              nhiệt độ trung bình.
            </p>
          </div>
        )}
      </div>

      {/* 3. Customer Reviews */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection('reviews')}
          className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold tracking-wide text-neutral-900 uppercase"
        >
          <span>Đánh giá từ khách hàng ({product.reviews.length})</span>
          {openSection === 'reviews' ? (
            <ChevronUp className="h-4 w-4 text-neutral-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-neutral-500" />
          )}
        </button>

        {openSection === 'reviews' && (
          <div className="space-y-4 pb-5">
            {product.reviews.length === 0 ? (
              <p className="text-xs text-neutral-500">
                Chưa có đánh giá nào cho sản phẩm này.
              </p>
            ) : (
              product.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="space-y-1.5 rounded-md bg-neutral-50 p-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < rev.rating ? 'fill-current' : 'text-neutral-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-neutral-400">
                      {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <p className="text-neutral-800">{rev.comment}</p>
                  <p className="text-[10px] font-medium text-emerald-600">
                    ✓ Đã xác thực mua hàng
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
