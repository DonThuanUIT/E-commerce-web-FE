import React, { useEffect } from 'react';
import { X, Ruler, Info, CheckCircle2 } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

interface SizeRow {
  size: string;
  chest: string;
  waist: string;
  height: string;
  weight: string;
  fitAdvice: string;
}

const SIZE_CHART_DATA: SizeRow[] = [
  {
    size: 'S',
    chest: '88 - 92 cm',
    waist: '74 - 78 cm',
    height: '160 - 168 cm',
    weight: '50 - 60 kg',
    fitAdvice: 'Phù hợp người dáng thanh mảnh hoặc thích mặc ôm sát',
  },
  {
    size: 'M',
    chest: '93 - 96 cm',
    waist: '79 - 83 cm',
    height: '168 - 174 cm',
    weight: '60 - 68 kg',
    fitAdvice: 'Kích cỡ tiêu chuẩn, chuẩn phom may đo Atelier',
  },
  {
    size: 'L',
    chest: '97 - 102 cm',
    waist: '84 - 88 cm',
    height: '173 - 178 cm',
    weight: '68 - 76 kg',
    fitAdvice: 'Thoải mái phần ngực và bắp tay, tôn dáng vai',
  },
  {
    size: 'XL',
    chest: '103 - 108 cm',
    waist: '89 - 94 cm',
    height: '176 - 185 cm',
    weight: '76 - 85 kg',
    fitAdvice: 'Dành cho phom người vạm vỡ hoặc thích mặc rộng rãi',
  },
];

/**
 * Size & Fit Guide Modal component.
 *
 * Provides a comprehensive tailoring size conversion chart,
 * anatomical measurement guide, and fit advice in Atelier Luxury style.
 */
export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  productName,
}) => {
  // Support closing with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-900">
              <Ruler className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-neutral-900 uppercase">
                Bảng Quy Đổi Kích Cỡ & Chọn Size
              </h3>
              <p className="text-xs text-neutral-500">
                Hướng dẫn đo chuẩn Atelier Maison • {productName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="space-y-6 overflow-y-auto px-6 py-5">
          {/* Section 1: Size Measurement Table */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider text-neutral-900 uppercase">
                Thông Số Kích Cỡ (Đơn Vị: CM / KG)
              </span>
              <span className="text-[11px] font-medium text-neutral-400">
                Độ co giãn 4 chiều
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-neutral-200">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold uppercase">Size</th>
                    <th className="px-4 py-3 font-semibold uppercase">
                      Vòng Ngực
                    </th>
                    <th className="px-4 py-3 font-semibold uppercase">
                      Vòng Eo
                    </th>
                    <th className="px-4 py-3 font-semibold uppercase">
                      Chiều Cao Gợi Ý
                    </th>
                    <th className="px-4 py-3 font-semibold uppercase">
                      Cân Nặng Gợi Ý
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {SIZE_CHART_DATA.map((row) => (
                    <tr
                      key={row.size}
                      className="transition-colors hover:bg-neutral-50/80"
                    >
                      <td className="px-4 py-3 font-bold text-neutral-900">
                        {row.size}
                      </td>
                      <td className="px-4 py-3 text-neutral-600">
                        {row.chest}
                      </td>
                      <td className="px-4 py-3 text-neutral-600">
                        {row.waist}
                      </td>
                      <td className="px-4 py-3 text-neutral-600">
                        {row.height}
                      </td>
                      <td className="px-4 py-3 text-neutral-600">
                        {row.weight}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: How to Measure */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4">
            <h4 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-neutral-900 uppercase">
              <Info className="h-3.5 w-3.5 text-neutral-700" />
              <span>Cách Lấy Số Đo Cơ Thể Chuẩn Xác</span>
            </h4>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="space-y-1 rounded-lg bg-white p-3 shadow-xs">
                <span className="text-[11px] font-bold text-neutral-800">
                  1. Vòng ngực (Chest)
                </span>
                <p className="text-[11px] leading-relaxed text-neutral-600">
                  Dùng thước dây vòng quanh phần nở nhất của ngực, giữ thước dây
                  thẳng song song với mặt sàn.
                </p>
              </div>

              <div className="space-y-1 rounded-lg bg-white p-3 shadow-xs">
                <span className="text-[11px] font-bold text-neutral-800">
                  2. Vòng eo (Waist)
                </span>
                <p className="text-[11px] leading-relaxed text-neutral-600">
                  Đo quanh phần hẹp nhất của eo tự nhiên (khoảng trên rốn
                  2-3cm), thả lỏng cơ thể khi đo.
                </p>
              </div>

              <div className="space-y-1 rounded-lg bg-white p-3 shadow-xs">
                <span className="text-[11px] font-bold text-neutral-800">
                  3. Chiều dài lưng (Length)
                </span>
                <p className="text-[11px] leading-relaxed text-neutral-600">
                  Đo từ điểm cao nhất của đường nối vai - cổ áo thẳng đứng xuống
                  đến mép gấu áo mong muốn.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Silhouette & Fit Recommendation */}
          <div className="flex items-start gap-3 rounded-xl border border-neutral-900/10 bg-neutral-900/5 p-4 text-xs text-neutral-800">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-neutral-900" />
            <div className="space-y-1">
              <span className="font-semibold text-neutral-900">
                Gợi ý phom dáng (Fit Recommendation):
              </span>
              <p className="text-neutral-600">
                Mẫu áo Polo được thiết kế theo phom dáng **Tailored Slim-Fit**
                hiện đại, ôm nhẹ phần ngực và vai để tôn dáng. Nếu bạn phân vân
                giữa 2 kích cỡ hoặc muốn mặc rộng rãi thoải mái (Regular Fit),
                chúng tôi khuyến nghị bạn nên chọn lớn hơn 1 size.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end border-t border-neutral-100 bg-neutral-50 px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg bg-neutral-900 px-5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-neutral-800"
          >
            Đã hiểu, quay lại chọn size
          </button>
        </div>
      </div>
    </div>
  );
};
