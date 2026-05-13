"use client";
import Banner from "@/component/user/banner";
import ProductList from "@/component/user/productTierList";
import ProductByCategory from "@/component/user/productByCategory";
import FeaturedCategories from "@/component/user/featuredCategories";
import BlogSection from "@/component/user/BlogSection";
import VideoSection from "@/component/user/VideoSection";
import productService from "@/service/product";
import categoryService from "@/service/category";
import { useEffect, useState } from "react";
export default function AdminHome() {
  // const products = Array.from({ length: 16 }, (_, index) => {
  //   const oldPrice = Math.floor(Math.random() * 1000000) + 1000000; // 1tr → 2tr

  //   const discountPercent = Math.floor(Math.random() * 40) + 10; // 10% → 50%

  //   const price = Math.floor(oldPrice - (oldPrice * discountPercent) / 100);

  //   return {
  //     id: index + 1,
  //     name: `Bộ Ga Gối Tencel Cao Cấp ${index + 1}`,
  //     price,
  //     oldPrice,
  //     discount: discountPercent,
  //     image: `https://picsum.photos/400/400?random=${index + 1}`,
  //     hoverImage: `https://picsum.photos/400/400?random=${index + 20}`,
  //   };
  // });
  const [productsTielist, setProductsTielist] = useState([]);
  const [chao, setChao] = useState([]); //chảo
  const [binhGN, setBinhGN] = useState([]); //Bình giữ nhiệt
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProductsTielist = async () => {
      try {
        const res = await categoryService.getProductsBySlug("binh-giu-nhiet", {
          limit: 6,
        });
        setProductsTielist(res.data?.data || []);
        setBinhGN(res.data?.data || []);
      } catch (error) {
        console.error("Lỗi lấy sản phẩm bán chạy:", error);
      }
    };

    const fetchProductsChao = async () => {
      try {
        const res = await categoryService.getProductsBySlug("noichao", {
          limit: 6,
        });
        setChao(res.data?.data || []);
      } catch (err) {
        console.warn("Không tìm thấy danh mục 'noi-chao', dùng fallback...");
        try {
          const fallbackRes = await productService.getAll({
            page: 1,
            limit: 8,
            keyword: "chảo",
          });
          setChao(fallbackRes.data?.data || []);
        } catch (innerErr) {
          setChao([]);
        }
      }
    };

    fetchProductsChao();
    fetchProductsTielist();
  }, []);
  return (
    <div className="mb-7">
      <Banner />
      <ProductList title="SẢN PHẨM BÁN CHẠY" products={productsTielist} />
      <FeaturedCategories></FeaturedCategories>
      <ProductByCategory
        title="Bình Giữ Nhiệt"
        products={binhGN}
        slug={"binh-giu-nhiet"}
      />
      <ProductByCategory title="Nồi/chảo" products={chao} slug={"noichao"} />

      {/* <BlogSection />
      <VideoSection /> */}
    </div>
  );
}
