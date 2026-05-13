"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function BannerSlider() {
  return (
    <>
      <div className="w-screen pt-[20]">
        <Swiper spaceBetween={20} slidesPerView={1}>
          <SwiperSlide>
            <img src="/pc_slide_1.jpg" className="w-full rounded-lg" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="/pc_slide_2.jpg" className="w-full rounded-lg" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="/pc_slide_3.jpg" className="w-full rounded-lg" />
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-2 bg-white border border-dashed border-red-400 rounded-xl text-sm">
            <div className="text-green-500 text-sm">
              <img src="/img_poli_1.webp" alt="" />
            </div>
            <div>
              <p className="font-semibold">
                FREESHIP{" "}
                <span className="font-normal">mọi đơn hàng ngày 3/3/2026</span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-white border border-dashed border-red-400 rounded-xl text-sm">
            <div className="text-green-500 text-sm">
              <img src="/img_poli_2.webp" alt="" />
            </div>
            <div>
              <p>Giao hàng 4h nội thành HN/HCM theo nhu cầu.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-white border border-dashed border-red-400 rounded-xl text-sm">
            <div className="text-green-500 text-sm">
              <img src="/img_poli_3.webp" alt="" />
            </div>
            <div>
              <p>Bảo hành chính hãng đến 24 tháng, 1 đổi 1 tới 12 tháng.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-white border border-dashed border-red-400 rounded-xl text-sm">
            <div className="text-green-500 text-sm">
              <img src="/img_poli_1.webp" alt="" />
            </div>
            <div>
              <p>
                Voucher giảm thêm <span className="font-semibold">10%</span> cho
                đơn hàng từ 5 triệu đồng
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
