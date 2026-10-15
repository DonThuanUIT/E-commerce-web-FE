import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';

/**
 * Enhanced Home Page directing visitors to the featured Product Detail Page (US-09).
 */
const Home = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 text-center">
      <div className="max-w-2xl space-y-6 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm sm:p-12">
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold tracking-wider text-neutral-800 uppercase">
          ATELIER MAISON • FEATURED RELEASE
        </span>

        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
          Bộ Sưu Tập Thời Trang Nam Cao Cấp
        </h1>

        <p className="text-sm leading-relaxed text-neutral-600">
          Trải nghiệm trang chi tiết sản phẩm thời trang chuẩn phong cách
          Atelier, tích hợp kiểm tra tồn kho thời gian thực và quản lý biến thể
          đa kích cỡ.
        </p>

        <div className="pt-2">
          <Link
            to="/products/ao-polo-the-thao-nam-phoi-vien"
            className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-neutral-800 hover:shadow-md active:scale-95"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Xem Chi Tiết Sản Phẩm (US-09)</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="text-xs text-neutral-400">
          Đường dẫn trực tiếp:{' '}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-neutral-700">
            /products/ao-polo-the-thao-nam-phoi-vien
          </code>
        </p>
      </div>
    </div>
  );
};

export default Home;
