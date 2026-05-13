"use client";
import Link from "next/link";
export default function FeaturedCategories() {
  const categories = [
    { name: "Nồi Chảo Ceramic", image: "/harmony.webp", link: "/category/noichao" },
    { name: "Bình giữ nhiệt", image: "/el8290m01-3-removebg-preview.webp", link: "/category/binh-giu-nhiet" },
    { name: "Máy xay sinh tố", image: "/ble3888dg-01-1-removebg-preview.webp", link: "/category/may-xay" },
    { name: "Máy ép trái cây", image: "/hhmn01-removebg-preview.webp", link: "/category/may-ep" },
    { name: "BST Hera - Milano", image: "/el8267-01-4.webp", link: "/category/hera-milano" },
    {
      name: "Sản phẩm Trimax",
      image: "/38ee36310bcb080f5f959333a59c000a-1687146387246-removebg-preview.webp",
      link: "/category/trimax"
    },
    {
      name: "Bộ dụng cụ nhà bếp",
      image: "/el-8404aw-01-removebg-preview.webp",
      link: "/category/dung-cu-bep"
    },
    {
      name: "Chăm sóc sức khỏe",
      image: "/oie-8452-01-1-removebg-preview.webp",
      link: "/category/suc-khoe"
    },
  ];

  return (
    <section className="max-w-7xl mt-3 rounded-2xl mx-auto px-6 py-10 bg-white">
      <h2 className="text-2xl font-bold mb-6 text-[#4C4C4C]">
        DANH MỤC NỔI BẬT
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-5">
       {categories.map((item, index) => (
          <Link
            key={index}
            href={item.link}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 
                       hover:shadow-lg hover:-translate-y-1 
                       transition-all duration-300 
                       flex flex-col items-center justify-center 
                       text-center p-5 cursor-pointer"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-14 object-contain mb-4"
            />
            <p className="text-sm text-[#4C4C4C] font-medium leading-snug">
              {item.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
