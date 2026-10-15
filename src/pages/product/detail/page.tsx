import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductDetail } from '../../../features/product/hooks/useProductDetail';
import { ImageGallery } from '../../../features/product/components/ImageGallery';
import { VariantSelector } from '../../../features/product/components/VariantSelector';
import { ProductAccordion } from '../../../features/product/components/ProductAccordion';
import { Sparkles, ArrowLeft, RefreshCw } from 'lucide-react';

/**
 * Product Detail Page implementing User Story [US-09].
 *
 * Designed in luxury fashion aesthetic inspired by Figma Atelier lookbook.
 */
export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // If no slug param is present in URL, default to our active seeded product
  const targetSlug = slug || 'ao-polo-the-thao-nam-phoi-vien';
  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useProductDetail(targetSlug);

  // 1. Loading State (Skeleton)
  if (isLoading) {
    return (
      <div className="mx-auto min-h-screen max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-4 w-48 rounded bg-neutral-200" />
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="grid grid-cols-2 gap-4 lg:col-span-7">
              <div className="aspect-3/4 rounded bg-neutral-200" />
              <div className="aspect-3/4 rounded bg-neutral-200" />
              <div className="aspect-3/4 rounded bg-neutral-200" />
              <div className="aspect-3/4 rounded bg-neutral-200" />
            </div>
            <div className="space-y-6 lg:col-span-5">
              <div className="h-8 w-3/4 rounded bg-neutral-200" />
              <div className="h-6 w-1/4 rounded bg-neutral-200" />
              <div className="h-24 w-full rounded bg-neutral-200" />
              <div className="h-12 w-full rounded bg-neutral-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Error State (e.g. 404 Product Not Found)
  if (isError || !product) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
          Không tìm thấy sản phẩm
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          {error?.message ||
            'Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã ngừng kinh doanh.'}
        </p>
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            className="flex items-center gap-2 rounded-md border border-neutral-300 px-4 py-2 text-xs font-semibold text-neutral-800 hover:border-neutral-900"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Thử lại</span>
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Về trang chủ</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Editorial Mini-Header */}
      <header className="border-b border-neutral-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="text-sm font-bold tracking-widest text-neutral-900 uppercase"
          >
            ATELIER MAISON
          </Link>
          <nav className="hidden space-x-8 text-xs font-medium tracking-wider text-neutral-600 uppercase md:flex">
            <span className="cursor-pointer transition-colors hover:text-neutral-900">
              Nam
            </span>
            <span className="cursor-pointer transition-colors hover:text-neutral-900">
              Nữ
            </span>
            <span className="cursor-pointer transition-colors hover:text-neutral-900">
              Phụ kiện
            </span>
            <span className="cursor-pointer transition-colors hover:text-neutral-900">
              Bộ sưu tập mới
            </span>
          </nav>
          <div className="text-xs text-neutral-500">Hỗ trợ 24/7</div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-6 flex items-center space-x-2 text-xs text-neutral-500">
          <Link to="/" className="transition-colors hover:text-neutral-900">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="transition-colors hover:text-neutral-900">
            {product.category.name}
          </span>
          <span>/</span>
          <span className="font-semibold text-neutral-900">{product.name}</span>
        </nav>

        {/* 2-Column Luxury Split Layout */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Column: Image Gallery (cols 7) */}
          <div className="lg:col-span-7">
            <ImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Column: Sticky Variant Selection & Accordion (cols 5) */}
          <div className="space-y-8 lg:col-span-5">
            <div className="sticky top-6 space-y-6">
              <VariantSelector product={product} />
              <ProductAccordion product={product} />
            </div>
          </div>
        </div>

        {/* Complete The Look Section (from Figma) */}
        <section className="mt-20 border-t border-neutral-200 pt-12">
          <div className="flex items-center justify-between pb-6">
            <div>
              <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                Gợi ý phong cách thời trang
              </span>
              <h3 className="text-xl font-bold tracking-tight text-neutral-900">
                Gợi ý phối đồ (Complete The Look)
              </h3>
            </div>
            <button
              type="button"
              className="rounded-md border border-neutral-300 px-4 py-2 text-xs font-medium text-neutral-800 hover:border-neutral-900"
            >
              Xem toàn bộ Capsule
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              {
                title: 'Quần Tây Xếp Ly Cao Cấp',
                category: 'QUẦN ÂU',
                price: '450.000 ₫',
                image:
                  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=500&q=80',
              },
              {
                title: 'Giày Da Oxford Thanh Lịch',
                category: 'GIÀY DA',
                price: '890.000 ₫',
                image:
                  'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=500&q=80',
              },
              {
                title: 'Túi Xách Da Công Sở Tối Giản',
                category: 'PHỤ KIỆN',
                price: '650.000 ₫',
                image:
                  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=500&q=80',
              },
              {
                title: 'Áo Khoác Blazer May Đo',
                category: 'ÁO KHOÁC',
                price: '1.200.000 ₫',
                image:
                  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&q=80',
              },
            ].map((item, idx) => (
              <div key={idx} className="group cursor-pointer space-y-2">
                <div className="aspect-3/4 overflow-hidden rounded-md bg-neutral-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-0.5 text-xs">
                  <p className="text-[10px] tracking-wider text-neutral-400 uppercase">
                    {item.category}
                  </p>
                  <p className="font-medium text-neutral-800">{item.title}</p>
                  <p className="font-semibold text-neutral-900">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Styling Concierge Banner (from Figma) */}
        <section className="mt-16 rounded-xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-white">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold tracking-wider text-neutral-500 uppercase">
                  ATELIER AI STYLING CONCIERGE
                </span>
                <h4 className="text-lg font-bold text-neutral-900">
                  Cần tư vấn về kích cỡ và phối đồ phù hợp?
                </h4>
                <p className="max-w-xl text-xs text-neutral-600">
                  Trợ lý AI của chúng tôi sẽ phân tích số đo vóc dáng và đề xuất
                  kích cỡ vừa vặn nhất cho từng dịp sự kiện của bạn.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="rounded-md bg-neutral-900 px-5 py-3 text-xs font-semibold text-white transition-all hover:bg-neutral-800"
            >
              Tư vấn cùng AI ngay
            </button>
          </div>
        </section>
      </main>

      {/* Luxury Footer */}
      <footer className="mt-24 border-t border-neutral-200 bg-white py-12 text-xs text-neutral-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 ATELIER MAISON. Bảo lưu mọi quyền.</p>
          <div className="flex gap-6">
            <span>Chính sách đổi trả</span>
            <span>Điều khoản dịch vụ</span>
            <span>Bảo mật dữ liệu</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetailPage;
