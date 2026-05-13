"use client";

import { Calendar, ArrowRight, ChevronRight, Clock, User, Eye } from "lucide-react";

export default function BlogSection() {
  const posts = [
    {
      title: "Cách tôi chảo chống dính Ceramic lần đầu sử dụng đúng chuẩn chuyên gia",
      date: "29/12/2025",
      readTime: "5 phút đọc",
      views: "1.2K lượt xem",
      author: "Admin Elmich",
      image: "/toi-chao-lan-dau.webp",
      description:
        "Bài viết này Elmich sẽ cung cấp một hướng dẫn cách tôi chảo chống dính ceramic chi tiết bảo vệ lớp chống dính bền vững qua nhiều năm sử dụng...",
      category: "MẸO NHÀ BẾP",
    },
    {
      title: "Chảo Chống Dính Bị Tróc Lớp Có Còn An Toàn Lên Bếp?",
      date: "24/12/2025",
      image: "/chao-chong-dnh-bi-troc.webp",
      description: "Nấu nướng là nghệ thuật nhưng chảo tróc lớp sơn Teflon liệu có gây hại sức khỏe...",
      category: "KIẾN THỨC",
    },
    {
      title: "Có Nên Rửa Bằng Máy Rửa Bát Hàng Ngày Không?",
      date: "15/12/2025",
      image: "/cach-rua-chao-chong-dinh.webp",
      description: "Việc rửa chảo chống dính bằng tia nước áp lực cao cùng muối rửa có làm hỏng chảo...",
      category: "TIỆN ÍCH",
    },
    {
      title: "Phủ Ceramic Là Gì Và Tại Sao Lại Phổ Biến Đến Vậy?",
      date: "10/12/2025",
      image: "/99-harmony-pc.webp",
      description: "Giải mã công nghệ chống dính hiện đại nguồn gốc từ thiên nhiên chịu được 500 độ C...",
      category: "CÔNG NGHỆ",
    },
    {
      title: "5 Sai lầm chết người khi dùng chảo chống dính",
      date: "05/12/2025",
      image: "/su-dung-chao-sai-cach.webp",
      description: "Đảo thức ăn bằng muôi Inox, sốc nhiệt bằng nước lạnh là những lỗi hay mắc mắc phải...",
      category: "KINH NGHIỆM",
    },
  ];

  const mainPost = posts[0];
  // Rút gọn chỉ còn 3 bài bên phải để tiết kiệm chiều cao thay vì 4 bài
  const sidePosts = posts.slice(1, 4); 

  return (
    <div className="bg-white mt-8 mb-12 p-5 md:p-6 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-gray-100 max-w-[1280px] mx-auto transition-all">
      {/* Header gọn gàng hơn */}
      <div className="flex items-end justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-red-600 rounded-full shadow-sm"></div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight leading-none pt-1">
              Kinh nghiệm hay
            </h2>
          </div>
        </div>
        <button className="hidden sm:flex items-center gap-1.5 text-gray-500 hover:text-red-600 transition-colors group">
          <span className="font-semibold text-sm">Xem tất cả</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* LEFT - MAIN POST */}
        <div className="lg:col-span-7 group cursor-pointer flex flex-col h-full relative rounded-xl overflow-hidden shadow-md border border-gray-100/50 min-h-[340px]">
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={mainPost.image}
              alt={mainPost.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-900/50 to-transparent"></div>

          {/* Text Content */}
          <div className="relative mt-auto p-5 md:p-6 w-full z-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-sm uppercase">
                {mainPost.category}
              </span>
              <span className="flex items-center gap-1.5 text-gray-300 text-[13px] font-medium">
                <Calendar className="w-3.5 h-3.5 text-red-400" /> {mainPost.date}
              </span>
            </div>
            
            <h3 className="text-xl md:text-2xl font-bold text-white leading-snug group-hover:text-red-400 transition-colors line-clamp-2 mb-2">
              {mainPost.title}
            </h3>
            
            <p className="text-gray-300 text-sm line-clamp-2 opacity-95 font-light leading-relaxed mb-3">
              {mainPost.description}
            </p>

            <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[11px] font-semibold text-gray-300">
              <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                Đọc bài viết <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" /> {mainPost.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {mainPost.readTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT - SIDE POSTS */}
        <div className="lg:col-span-5 flex flex-col gap-3 justify-between h-full">
          {sidePosts.map((post, index) => (
            <div
              key={index}
              className="group flex gap-3.5 items-center bg-gray-50/70 hover:bg-white border text-left border-transparent hover:border-red-100 hover:shadow-md rounded-xl p-2.5 transition-all duration-300 cursor-pointer"
            >
              <div className="relative w-24 h-20 md:w-[110px] md:h-[90px] shrink-0 rounded-lg overflow-hidden shadow-sm">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
              </div>

              <div className="flex-1 min-w-0 pr-1 flex flex-col justify-center">
                <span className="text-red-600 text-[9px] font-extrabold uppercase tracking-wider mb-1 block">
                  {post.category}
                </span>
                <h4 className="text-sm md:text-[14px] font-bold text-gray-900 leading-snug group-hover:text-red-600 transition-colors line-clamp-2 mb-1">
                  {post.title}
                </h4>
                <p className="text-[12px] text-gray-500 line-clamp-1 leading-relaxed mb-1.5">
                  {post.description}
                </p>
                <div className="flex items-center justify-between text-gray-400">
                  <div className="flex items-center gap-1.5 text-[10px] font-medium">
                    <Clock className="w-3 h-3" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-[10px] font-semibold text-gray-500 group-hover:text-red-500 transition-colors">
                    Chi tiết <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <button className="hidden lg:flex items-center justify-center gap-2 w-full text-xs text-gray-500 hover:text-red-600 font-semibold py-1 transition-colors mt-auto">
            Xem thêm bài viết <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
