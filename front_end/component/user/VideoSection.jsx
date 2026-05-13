"use client";

import {
  Play,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Youtube,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useRef } from "react";

// Required Swiper CSS
import "swiper/css";
import "swiper/css/navigation";

export default function VideoSection() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const videos = [
    {
      title: "Tết tròn đầy - Nhà thêm sang cùng Bộ hộp mứt Tết Elmich",
      image: "/hqdefault-9ca4a99e-210c-4cc4-92a0-ffe74d970e81.webp", // Giả định dùng tạm ảnh có sẵn
    },
    {
      title: "ĐỒ DÃ NGOẠI ELMICH: CAMPING ĐÚNG CHẤT - CHINH PHỤC MỌI...",
      image: "/maxresdefault-70141a2d-61a1-491f-a507-ece972d7359c.webp",
    },
    {
      title: "Chống dính Ceramic XERADUR 5 là chống dính cao cấp nhất, hoàn...",
      image: "/maxresdefault-11-0eb1c87e-38fa-42d3-870b-866a506ebe8c.webp",
    },
    {
      title: "Highlight sự kiện văn hóa Séc - Việt tại Aeon Mall Hà Đông",
      image: "/maxresdefault-10-37047557-8c02-4924-9e6d-1772c8643cb0.webp",
    },
  ];

  return (
    <div className="bg-white mt-2 px-5 md:px-6 py-8 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-gray-100 max-w-[1280px] mx-auto transition-all mb-8">
      {/* Header phong cách tạp chí giống BlogSection */}
      <div className="flex items-end justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-red-600 rounded-full shadow-sm"></div>
          <div>
            <span className="text-red-600 font-bold tracking-widest text-[10px] md:text-xs uppercase mb-0.5 block">
              Thế giới Elmich
            </span>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight leading-none">
              Video
            </h2>
          </div>
        </div>
      </div>

      <div className="relative group/slider">
        {/* Nút Prev Custom */}
        <button
          ref={prevRef}
          className="absolute -left-4 top-[40%] -translate-y-1/2 w-10 h-10 bg-white/95 backdrop-blur rounded-full flex items-center justify-center text-gray-700 shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 z-20 hover:text-red-600 hover:scale-110 transition-all opacity-0 group-hover/slider:opacity-100 disabled:opacity-0 disabled:scale-90"
        >
          <ChevronLeft className="w-5 h-5 ml-0.5" />
        </button>

        {/* Nút Next Custom (Như trong ảnh) */}
        <button
          ref={nextRef}
          className="absolute -right-4 top-[40%] -translate-y-1/2 w-10 h-10 bg-white/95 backdrop-blur rounded-full flex items-center justify-center text-gray-700 shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 z-20 hover:text-red-600 hover:scale-110 transition-all opacity-0 group-hover/slider:opacity-100 disabled:opacity-0 disabled:scale-90"
        >
          <ChevronRight className="w-5 h-5 mr-0.5" />
        </button>

        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          spaceBetween={16}
          slidesPerView={1.2}
          breakpoints={{
            480: { slidesPerView: 2, spaceBetween: 16 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
          }}
          className="!py-2 !px-1"
        >
          {videos.map((video, idx) => (
            <SwiperSlide key={idx} className="h-auto">
              <div className="group cursor-pointer flex flex-col h-full bg-white rounded-xl transition-all duration-300">
                {/* Thumbnail Container */}
                <div className="relative w-full aspect-[16/9] md:aspect-[4/3] rounded-xl overflow-hidden shadow-sm border border-gray-100/80 mb-3 bg-gray-50">
                  <img
                    src={video.image}
                    alt={video.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Overlay đen bóng mờ khi Hover */}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500"></div>

                  {/* Icon Nút Play */}
                </div>

                {/* Tiêu đề Video */}
                <h3 className="text-sm md:text-[15px] font-bold text-gray-900 leading-snug line-clamp-2 px-1 group-hover:text-red-600 transition-colors">
                  {video.title}
                </h3>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Mobile view More Button */}
      <button className="sm:hidden mt-4 flex items-center justify-center gap-2 w-full bg-red-50 text-red-600 hover:bg-red-100 font-bold py-3.5 rounded-xl transition-colors">
        Xem Kênh Youtube <Youtube className="w-4 h-4" />
      </button>
    </div>
  );
}
