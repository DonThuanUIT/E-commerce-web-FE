import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import type { WishlistItem } from '../types/wishlistType';

function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export const WishlistGrid: React.FC = () => {
  const { items, isLoading, isError, error, refetch, removeFromWishlist } =
    useWishlist();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleRemove = async (productId: string, productName: string) => {
    try {
      setRemovingId(productId);
      await removeFromWishlist(productId);
      setToastMessage(`Đã xóa "${productName}" khỏi danh sách yêu thích.`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch {
      setToastMessage('Không thể xóa sản phẩm. Vui lòng thử lại.');
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setRemovingId(null);
    }
  };

  // 1. Loading Skeleton
  if (isLoading) {
    return (
      <div className="mx-auto min-h-screen max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-6 w-48 rounded bg-neutral-200" />
          <div className="h-4 w-96 rounded bg-neutral-200" />
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-3/4 rounded-lg bg-neutral-200" />
                <div className="h-4 w-3/4 rounded bg-neutral-200" />
                <div className="h-4 w-1/2 rounded bg-neutral-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. Error State
  if (isError) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
          <Heart className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-neutral-900">
          Không thể tải danh sách yêu thích
        </h2>
        <p className="mt-2 text-xs text-neutral-500">
          {error instanceof Error
            ? error.message
            : 'Đã xảy ra lỗi kết nối. Vui lòng thử lại.'}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-6 flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Thử lại</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Header */}
      <header className="border-b border-neutral-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-medium text-neutral-600 transition-colors hover:text-neutral-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Tiếp tục mua sắm</span>
          </Link>
          <span className="text-sm font-bold tracking-widest text-neutral-900 uppercase">
            ATELIER MAISON
          </span>
          <div className="w-20" />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Title & Count */}
        <div className="mb-8 border-b border-neutral-200 pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-neutral-400 uppercase">
            <Heart className="h-3.5 w-3.5 fill-current text-rose-500" />
            <span>BỘ SƯU TẬP CỦA BẠN</span>
          </div>
          <div className="mt-2 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-baseline">
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
              Danh Sách Yêu Thích
            </h1>
            <span className="text-xs text-neutral-500">
              {items.length} thiết kế đã lưu
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Lưu giữ những trang phục may đo tinh tuyển để hoàn thiện tủ đồ của
            bạn.
          </p>
        </div>

        {/* Feedback Alert */}
        {toastMessage && (
          <div className="mb-6 rounded-md border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-800">
            {toastMessage}
          </div>
        )}

        {/* 3. Empty State */}
        {items.length === 0 ? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 p-8 text-center sm:p-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
              <Heart className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-neutral-900">
              Danh sách yêu thích của bạn đang trống
            </h3>
            <p className="mt-2 max-w-md text-xs leading-relaxed text-neutral-500">
              Bạn chưa lưu sản phẩm nào. Hãy khám phá các bộ sưu tập thời trang
              mới nhất và nhấn vào biểu tượng trái tim để lưu lại xem sau.
            </p>
            <Link
              to="/products/ao-polo-the-thao-nam-phoi-vien"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-6 py-3 text-xs font-semibold text-white shadow-sm transition-all hover:bg-neutral-800 active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              <span>Khám phá sản phẩm ngay</span>
            </Link>
          </div>
        ) : (
          /* 4. Product Grid */
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {items.map((item: WishlistItem) => {
              const isRemoving = removingId === item.id;
              const displayPrice = item.minPrice || item.basePrice;

              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col justify-between space-y-3"
                >
                  {/* Image Container */}
                  <div className="relative aspect-3/4 overflow-hidden rounded-md bg-neutral-100">
                    <img
                      src={
                        item.primaryImageUrl ||
                        'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={item.name}
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Remove Button */}
                    <button
                      type="button"
                      disabled={isRemoving}
                      onClick={() => handleRemove(item.id, item.name)}
                      title="Xóa khỏi danh sách yêu thích"
                      className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-600 shadow-xs backdrop-blur-xs transition-all hover:bg-rose-50 hover:text-rose-600 active:scale-95"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    {/* Stock Status Tag */}
                    <div className="absolute bottom-2.5 left-2.5">
                      {item.inStock ? (
                        <span className="rounded bg-emerald-600/90 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
                          Còn hàng
                        </span>
                      ) : (
                        <span className="rounded bg-rose-600/90 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
                          Tạm hết hàng
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-1">
                    <span className="text-[10px] tracking-wider text-neutral-400 uppercase">
                      {item.categoryName || 'THỜI TRANG'}
                    </span>
                    <Link
                      to={`/products/${item.slug}`}
                      className="block truncate text-xs font-semibold text-neutral-900 transition-colors hover:text-neutral-600"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs font-bold text-neutral-900">
                      {formatVND(displayPrice)}
                    </p>
                  </div>

                  {/* CTA: View / Buy */}
                  <Link
                    to={`/products/${item.slug}`}
                    className="flex w-full items-center justify-center gap-1.5 rounded border border-neutral-900 bg-white py-2 text-xs font-semibold text-neutral-900 transition-all hover:bg-neutral-900 hover:text-white"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>Xem & Chọn Size</span>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
