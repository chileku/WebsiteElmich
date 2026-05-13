"use client";

import { useCartStore } from "@/store/cartstore";
import Link from "next/link";
import { getProductPricing } from "@/lib/pricing";

export default function CartPage() {
  const { cart, removeFromCart, addToCart, decreaseQuantity, getTotalPrice } =
    useCartStore();

  const totalPrice = getTotalPrice();

  if (cart.length === 0) {
    return (
      <div className="max-w-6xl mt-6 mb-6 mx-auto py-10 bg-white p-3 ">
        <div className="text-center">
          <Link
            href="/"
            className="bg-[#ED2124] text-white px-3 py-2 rounded-lg w-50"
          >
            MUA THÊM
          </Link>
        </div>
        <h2 className="text-lg text-[#4C4C4C] font-semibold mb-6">GIỎ HÀNG</h2>

        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg">
          Không có sản phẩm nào. Quay lại{" "}
          <Link href="/" className="font-semibold underline">
            cửa hàng
          </Link>{" "}
          để tiếp tục mua sắm.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h2 className="text-lg text-[#4C4C4C] font-semibold mb-6 bg-white p-3 rounded-xl">
        GIỎ HÀNG
      </h2>

      <div className="bg-white rounded-xl shadow p-6">
        {/* Header */}
        <div className="grid grid-cols-5 font-semibold border-b border-gray-100 pb-3 mb-4 bg">
          <div className="col-span-2">Sản Phẩm</div>
          <div>Đơn Giá</div>
          <div>Số Lượng</div>
          <div>Tổng</div>
        </div>

        {/* Items */}
        {cart.map((item) => {
          const imageUrl = item.ProductImages?.length
            ? `http://localhost:5000/${item.ProductImages[0].ImagePath}`
            : "/no-image.png";
          console.log(imageUrl);
          const { price, finalPrice, hasDiscount } = getProductPricing(item);

          return (
            <div
              key={item.ProductID}
              className="grid grid-cols-5 items-center border-b border-gray-100 py-4"
            >
              {/* Sản phẩm */}
              <div className="col-span-2 flex items-center gap-4">
                <Link
                  href={`/product/${item.Slug}`}
                  className="flex items-center gap-4 hover:text-[#ED2124] transition-colors"
                >
                  <img
                    src={imageUrl}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <span className="font-medium">{item.ProductName}</span>
                </Link>
              </div>

              {/* Đơn giá */}
              <div>
                <div className="text-red-600 font-semibold">
                  {finalPrice.toLocaleString()}₫
                </div>
                {hasDiscount && (
                  <div className="text-xs text-gray-400 line-through">
                    {price.toLocaleString()}₫
                  </div>
                )}
              </div>

              {/* Số lượng */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => decreaseQuantity(item.ProductID)}
                  className="w-8 h-8 border border-gray-200 font-extrabold text-gray-400 rounded"
                >
                  -
                </button>

                <span>{item.Quantity}</span>

                <button
                  onClick={() => addToCart(item)}
                  className={`w-8 h-8 border border-gray-200 font-extrabold text-gray-400 rounded ${item.Quantity >= item.AvailableQuantity ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={item.Quantity >= item.AvailableQuantity}
                >
                  +
                </button>
              </div>

              {/* Tổng */}
              <div className="flex justify-between items-center">
                <span className="text-red-600 font-semibold">
                  {(finalPrice * item.Quantity).toLocaleString()}₫
                </span>

                <button
                  onClick={() => removeFromCart(item.ProductID)}
                  className="text-red-500 border border-red-500 px-3 py-1 rounded"
                >
                  Xoá
                </button>
              </div>
            </div>
          );
        })}
        {/* Footer - Tổng tiền */}
        <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
          <div className="text-lg font-semibold text-gray-700">
            Tổng thanh toán:
          </div>

          <div className="flex items-center gap-6">
            <span className="text-2xl font-bold text-red-600">
              {totalPrice.toLocaleString()}₫
            </span>

            <Link
              href="/checkout"
              className="bg-[#ED2124] hover:bg-red-700 transition text-white px-6 py-3 rounded-lg font-semibold"
            >
              THANH TOÁN
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
