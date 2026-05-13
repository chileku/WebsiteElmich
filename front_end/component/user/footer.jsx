"use client";

export default function Footer() {
  return (
    <footer className="bg-white text-[#4C4C4C] text-sm">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Cột 1 */}
        <div className="text-base">
          <img src="/logo.webp" alt="Elmich" className="h-10 mb-4" />

          <p className="mb-2">
            <strong>Elmich Group:</strong> U Hlubku 1570 Ostrava Nova Ves 70900,
            Czech Republic
          </p>

          <p className="mb-2">
            <strong>Văn phòng Việt Nam:</strong> Tầng 17 tòa nhà 319 Bộ Quốc
            Phòng, Số 63 Lê Văn Lương, Hà Nội
          </p>

          <p>
            <strong>Email:</strong> cskh@elmich.vn
          </p>
          <p>
            <strong>Hotline:</strong> 1900 6369 25
          </p>
          <p>
            <strong>Mã số thuế:</strong> 0700525789
          </p>
        </div>

        {/* Cột 2 */}
        <div>
          <h3 className="font-semibold text-xl mb-4">Hướng dẫn - Chính sách</h3>
          <ul className="space-y-2 text-base">
            <li>Hướng dẫn mua hàng</li>
            <li>Chính sách bảo hành</li>
            <li>Chính sách đổi trả</li>
            <li>Chính sách giao hàng</li>
            <li>Chính sách thanh toán</li>
            <li>Chính sách bảo mật</li>
          </ul>
        </div>

        {/* Cột 3 */}
        <div>
          <h3 className="font-semibold text-xl mb-4">Liên hệ - Giới thiệu</h3>
          <ul className="space-y-2 text-base">
            <li>Giới thiệu về ELMICH</li>
            <li>Chứng nhận sản phẩm</li>
            <li>Liên hệ - Hỗ trợ</li>
          </ul>
        </div>

        {/* Cột 4 */}
        <div>
          <h3 className="font-semibold text-xl mb-4">Kết nối với chúng tôi</h3>

          <div className="flex gap-3 mb-6">
            <img src="/facebook.webp" className="w-8 h-8" />
            <img src="/twitter.webp" className="w-8 h-8" />
            <img src="/shopee.webp" className="w-8 h-8" />
          </div>

          <h4 className="font-semibold mb-3">Phương thức thanh toán</h4>
          <div className="flex flex-wrap gap-3">
            {/* <img src="/vnpay.png" className="h-6" />
            <img src="/visa.png" className="h-6" />
            <img src="/mastercard.png" className="h-6" /> */}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300"></div>

      {/* Bottom */}
      <div className="max-w-7xl mx-auto px-6 py-4 text-center text-gray-500">
        Bản quyền thuộc về ELMICH.
      </div>
    </footer>
  );
}
