"use client";
import { useCartStore } from "@/store/cartstore";
import Link from "next/link";
import { getProductPricing } from "@/lib/pricing";
export default function ProductCard({ product }) {
  if (!product) return null;

  const imageUrl = product.ProductImages?.length
    ? `http://localhost:5000/${product.ProductImages[0].ImagePath}`
    : "/no-image.png";

  const addToCart = useCartStore((state) => state.addToCart);

  const { price, finalPrice, discountPercent, hasDiscount } =
    getProductPricing(product);

  return (
    <div
      className="relative bg-white rounded-2xl border border-gray-200
                 shadow-sm hover:shadow-lg
                 transition-all duration-300
                 group overflow-hidden"
    >
      {/* Sale badge chỉ hiển thị khi có giảm giá */}
      {hasDiscount && (
        <div className="absolute top-3 right-3 z-20">
          <div
            className="bg-linear-to-r from-[#ED2124] to-red-500
                       text-white text-xs font-semibold
                       px-3 py-1 rounded-full shadow-md"
          >
            -{discountPercent}%
          </div>
        </div>
      )}

      {/* Ảnh */}
      <Link href={`/product/${product.Slug}`}>
        <div className="relative aspect-square overflow-hidden">
          <img
            src={imageUrl || "/no-image.png"}
            alt={product.ProductName}
            className="w-full h-full object-contain bg-white
             transition-transform duration-500
             group-hover:scale-105"
          />

          <img
            src="/image_tag_all.webp"
            alt="frame"
            className="absolute inset-0 w-full h-full
                     pointer-events-none z-10"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 relative">
        <h3
          className="text-sm text-gray-700 font-medium
                     line-clamp-2 min-h-10.5"
        >
          {product.ProductName}
        </h3>

        {/* Giá */}
        <div className="mt-2">
          <p className="text-[#ED2124] font-bold text-base">
            {finalPrice.toLocaleString()}₫
          </p>

          {hasDiscount && (
            <p className="text-gray-400 line-through text-sm">
              {price.toLocaleString()}₫
            </p>
          )}
        </div>

        {/* Nút giỏ hàng */}
        <div className="absolute right-4 bottom-4">
          <button
            className="w-9 h-9 flex items-center justify-center
                       bg-[#ED2124] hover:bg-red-700
                       transition-all duration-300
                       rounded-lg shadow-md
                       hover:scale-110 active:scale-95"
            onClick={() =>
              addToCart({
                ...product,
                finalPrice,
              })
            }
          >
            <img src="/add-cart.webp" className="w-5 h-5" alt="add cart" />
          </button>
        </div>
      </div>
    </div>
  );
}
