"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ProductCard from "./productCard";

export default function ProductList({ title, products }) {
  return (
    <div className="max-w-7xl mx-auto py-10 bg-white rounded-2xl p-3 mt-3 ">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <Swiper className="bg-white" slidesPerView={5} spaceBetween={10}>
        {products?.map((item) => (
          <SwiperSlide key={item.id}>
            <ProductCard product={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
