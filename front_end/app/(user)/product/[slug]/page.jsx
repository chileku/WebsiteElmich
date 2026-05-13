"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProductService from "@/service/product";
import { useCartStore } from "@/store/cartstore";
import { getProductPricing } from "@/lib/pricing";
import ProductInfo from "@/component/user/productInfo";

/* ─────────────────────────────────────────
   Skeleton loader
───────────────────────────────────────── */
function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded-lg ${className}`}
      style={{ animation: "shimmer 1.5s infinite" }}
    />
  );
}

function ProductSkeleton() {
  return (
    <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12">
      <div>
        <Skeleton className="aspect-square w-full rounded-3xl" />
        <div className="flex gap-3 mt-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="w-20 h-20 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-14 w-full rounded-2xl" />
        <div className="flex gap-3">
          <Skeleton className="h-14 flex-1 rounded-2xl" />
          <Skeleton className="h-14 w-40 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Star rating display
───────────────────────────────────────── */
function Stars({ score = 5 }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < score ? "text-amber-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   Policy badge
───────────────────────────────────────── */
const policies = [
  {
    icon: "/img_poli_1a.webp",
    title: "Giao hàng 4h",
    sub: "Nội thành, miễn phí từ 190K",
  },
  { icon: "/img_poli_2a.webp", title: "Đổi trả 30 ngày", sub: "Dễ dàng, nhanh chóng" },
  { icon: "/img_poli_3a.webp", title: "Bảo hành 24 tháng", sub: "Chính hãng toàn quốc" },
];

function PolicyCard({ icon, title, sub }) {
  return (
    <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-3.5 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
        <img src={icon} alt={title} className="w-6 h-6 object-contain" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Feature list items
───────────────────────────────────────── */
const features = [
  "An toàn tuyệt đối theo tiêu chuẩn Châu Âu SGS",
  "Chống dính Ceramic thế hệ mới",
  "Bền 101.000 lần chà rửa",
  "Dùng được trên mọi loại bếp",
  "Thiết kế bo viền Elmich Châu Âu",
];

/* ─────────────────────────────────────────
   Main page
───────────────────────────────────────── */
export default function ProductDetail() {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSticky, setIsSticky] = useState(false);
  const { slug } = useParams();
  const addToCart = useCartStore((state) => state.addToCart);
  const FILE_URL = "http://localhost:5000/";
  const DEFAULT_IMAGE = "/no-image.png";
  const [selectedImage, setSelectedImage] = useState(DEFAULT_IMAGE);
  const [thumbIndex, setThumbIndex] = useState(0);
  const ctaRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await ProductService.getBySlug(slug);
        setProduct(res.data);
        const firstImage = res.data?.ProductImages?.[0]?.ImagePath;
        setSelectedImage(firstImage ? `${FILE_URL}${firstImage}` : DEFAULT_IMAGE);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchData();
  }, [slug]);

  // Sticky bar observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (ctaRef.current) observer.observe(ctaRef.current);
    return () => observer.disconnect();
  }, [loading]);

  const images = product?.ProductImages || [];
  const { price, finalPrice, discountPercent, hasDiscount } = getProductPricing(product);
  const saving = Math.max(0, price - finalPrice);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ ...product, quantityToAdd: quantity, Image: selectedImage, finalPrice });
  };

  return (
    <>
      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .shimmer { animation: shimmer 1.5s infinite; }
      `}</style>

      <div className="min-h-screen bg-gradient-to-b from-[#f8f8f8] to-[#f0f0f0]">
        {/* ── Breadcrumb ── */}
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500">
            <Link href="/" className="hover:text-red-500 transition-colors">Trang chủ</Link>
            <span className="text-gray-300">/</span>
            <Link href="/products" className="hover:text-red-500 transition-colors">Sản phẩm</Link>
            {product && (
              <>
                <span className="text-gray-300">/</span>
                <span className="text-gray-800 font-medium line-clamp-1 max-w-xs">
                  {product.ProductName}
                </span>
              </>
            )}
          </nav>
        </div>

        {/* ── Main card ── */}
        <div className="max-w-7xl mx-auto px-4 pb-10">
          <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] p-6 lg:p-10">
            {loading ? (
              <ProductSkeleton />
            ) : (
              <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-14">
                {/* ─── LEFT: Gallery ─── */}
                <div className="flex flex-col gap-4">
                  {/* Main image */}
                  <div className="relative aspect-square overflow-hidden rounded-3xl border border-gray-100 bg-[#fafafa] group">
                    <img
                      src={selectedImage}
                      alt="product"
                      className="absolute inset-0 w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105 z-0"
                    />
                    <img
                      src="/image_tag_all.webp"
                      alt="theme"
                      className="absolute inset-0 w-full h-full pointer-events-none z-10"
                    />
                    {hasDiscount && (
                      <div className="absolute top-4 left-4 z-20">
                        <div className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg shadow-red-200">
                          -{discountPercent}% OFF
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {images.length > 0 && (
                    <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
                      {images.map((img, idx) => {
                        const src = `${FILE_URL}${img.ImagePath}`;
                        const isActive = selectedImage === src;
                        return (
                          <button
                            key={img.ProductImageID || img.ImageID || `${img.ImagePath}-${idx}`}
                            onClick={() => { setSelectedImage(src); setThumbIndex(idx); }}
                            className={`shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-xl border-2 overflow-hidden transition-all duration-200 ${isActive
                                ? "border-red-500 shadow-md shadow-red-100 scale-105"
                                : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
                              }`}
                          >
                            <img
                              src={src}
                              className="w-full h-full object-contain bg-white p-1"
                              alt=""
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* ─── RIGHT: Info ─── */}
                <div className="flex flex-col gap-5">
                  {/* Product name */}
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-snug">
                      {product?.ProductName}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 mt-2.5">
                      <Stars score={5} />
                      <span className="text-sm text-gray-500">(128 đánh giá)</span>
                      <span className="h-4 w-px bg-gray-300" />
                      <span className="text-sm text-gray-500">Đã bán <strong className="text-gray-700">2.5K</strong></span>
                      <span className="h-4 w-px bg-gray-300" />
                      <span className="text-xs text-gray-400">Mã SP: {product?.ProductID}</span>
                    </div>
                  </div>

                  {/* Price block */}
                  <div className="bg-gradient-to-br from-[#fff5f5] to-[#fff0f0] border border-red-100 rounded-2xl p-5">
                    <div className="flex items-end gap-3 flex-wrap">
                      <span className="text-4xl font-extrabold text-[#ed2124] tracking-tight">
                        {finalPrice.toLocaleString()}
                        <span className="text-2xl">₫</span>
                      </span>
                      {hasDiscount && (
                        <span className="text-gray-400 line-through text-xl mb-0.5">
                          {price.toLocaleString()}₫
                        </span>
                      )}
                    </div>
                    {hasDiscount && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center gap-1 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                          🔥 Tiết kiệm {saving.toLocaleString()}₫
                        </span>
                        <span className="text-xs text-gray-500">so với giá gốc</span>
                      </div>
                    )}
                  </div>

                  {/* Vouchers */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                      <span className="text-red-500">🎟</span> Voucher áp dụng:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Giảm 120K", "Giảm 200K", "Giảm 300K", "Giảm 10%"].map((v) => (
                        <span
                          key={v}
                          className="text-xs px-3 py-1.5 rounded-lg bg-white border border-red-200 text-red-500 font-medium cursor-pointer hover:bg-red-50 transition-colors shadow-sm"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2.5">Số lượng:</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                        <button
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-xl font-light"
                        >
                          −
                        </button>
                        <span className="w-12 text-center font-semibold text-gray-800 text-base">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity((q) => Math.min(product?.AvailableQuantity || 0, q + 1))}
                          className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors text-xl font-light"
                          disabled={(product?.AvailableQuantity || 0) <= quantity}
                        >
                          +
                        </button>
                      </div>
                      <span className={`text-sm ${(product?.AvailableQuantity || 0) > 0 ? "text-gray-400" : "text-red-500 font-bold"}`}>
                        {(product?.AvailableQuantity || 0) > 0 ? `Còn hàng (còn ${product.AvailableQuantity})` : "Hết hàng"}
                      </span>
                    </div>
                  </div>

                  {/* CTA buttons */}
                  <div ref={ctaRef} className="flex gap-3 flex-col sm:flex-row">
                    <button 
                      disabled={(product?.AvailableQuantity || 0) <= 0}
                      className={`flex-1 relative overflow-hidden bg-gradient-to-r from-[#ed2124] to-rose-500 hover:from-red-600 hover:to-rose-600 text-white py-4 rounded-2xl font-bold text-base transition-all duration-300 shadow-lg shadow-red-200 hover:shadow-red-300 hover:-translate-y-0.5 active:translate-y-0 group ${(product?.AvailableQuantity || 0) <= 0 ? "opacity-50 grayscale cursor-not-allowed" : ""}`}
                    >
                      <span className="relative z-10">
                        {(product?.AvailableQuantity || 0) <= 0 ? "HẾT HÀNG" : "MUA NGAY"}
                        <div className="text-xs font-normal opacity-80 mt-0.5">Giao hàng tận nơi</div>
                      </span>
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                    </button>

                    <button
                      onClick={handleAddToCart}
                      disabled={(product?.AvailableQuantity || 0) <= 0}
                      className={`flex-1 sm:flex-none sm:px-8 border-2 border-red-500 text-red-500 py-4 rounded-2xl font-semibold text-base transition-all duration-300 hover:bg-red-500 hover:text-white hover:-translate-y-0.5 active:translate-y-0 hover:shadow-lg hover:shadow-red-200 ${(product?.AvailableQuantity || 0) <= 0 ? "opacity-50 grayscale cursor-not-allowed" : ""}`}
                    >
                      🛒 Thêm vào giỏ
                    </button>
                  </div>

                  {/* Policy cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {policies.map((p) => (
                      <PolicyCard key={p.title} {...p} />
                    ))}
                  </div>

                  {/* Feature list */}
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Đặc điểm nổi bật:</p>
                    <ul className="space-y-2">
                      {features.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="mt-0.5 w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                            ✓
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Product Info section */}
          <div className="mt-6">
            <ProductInfo
              title={product?.ProductName}
              description={product?.Description}
            />
          </div>
        </div>

        {/* ── Sticky bottom CTA (appears when main CTA scrolls out) ── */}
        {isSticky && !loading && product && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-2xl px-4 py-3 flex items-center gap-3 max-w-7xl mx-auto animate-fade-in-up">
            <img
              src={selectedImage}
              alt="product"
              className="w-12 h-12 rounded-xl object-contain bg-gray-50 border border-gray-100 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 line-clamp-1">{product?.ProductName}</p>
              <p className="text-red-500 font-bold text-base">{finalPrice.toLocaleString()}₫</p>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={(product?.AvailableQuantity || 0) <= 0}
              className={`shrink-0 border-2 border-red-500 text-red-500 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-red-500 hover:text-white transition-all ${(product?.AvailableQuantity || 0) <= 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              + Giỏ hàng
            </button>
            <button 
              disabled={(product?.AvailableQuantity || 0) <= 0}
              className={`shrink-0 bg-gradient-to-r from-[#ed2124] to-rose-500 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-md hover:shadow-red-200 transition-all ${(product?.AvailableQuantity || 0) <= 0 ? "opacity-50 grayscale cursor-not-allowed" : ""}`}
            >
              {(product?.AvailableQuantity || 0) <= 0 ? "Hết hàng" : "Mua ngay"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
