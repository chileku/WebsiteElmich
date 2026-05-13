"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import ProductCard from "@/component/user/productCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useParams } from "next/navigation";
import categoryService from "@/service/category";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const SORT_OPTIONS = [
  { label: "Mặc định", value: "default" },
  { label: "Giá tăng dần", value: "price_asc" },
  { label: "Giá giảm dần", value: "price_desc" },
  { label: "Mới nhất", value: "newest" },
];

export default function CategoryPage() {
  const { slug } = useParams();

  // Category info
  const [category, setCategory] = useState(null);

  // Products
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filters
  const [sort, setSort] = useState("default");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [appliedMin, setAppliedMin] = useState("");
  const [appliedMax, setAppliedMax] = useState("");
  const [page, setPage] = useState(1);

  // Mobile sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load category info (children, parent, siblings)
  useEffect(() => {
    if (!slug) return;
    categoryService
      .getBySlug(slug)
      .then((res) => setCategory(res.data?.data || null))
      .catch(() => setCategory(null));
  }, [slug]);

  // Build query params for products
  const buildParams = useCallback(() => {
    const params = { page, limit: 12 };
    if (sort === "price_asc") { params.sortBy = "Price"; params.order = "ASC"; }
    else if (sort === "price_desc") { params.sortBy = "Price"; params.order = "DESC"; }
    else if (sort === "newest") { params.sortBy = "ProductID"; params.order = "DESC"; }
    if (appliedMin) params.minPrice = appliedMin;
    if (appliedMax) params.maxPrice = appliedMax;
    return params;
  }, [page, sort, appliedMin, appliedMax]);

  // Load products
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    categoryService
      .getProductsBySlug(slug, buildParams())
      .then((res) => {
        const result = res.data;
        setProducts(result.data || []);
        setPagination(result.pagination || null);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug, buildParams]);

  const handleApplyFilter = () => {
    setAppliedMin(minPrice);
    setAppliedMax(maxPrice);
    setPage(1);
    setSidebarOpen(false);
  };

  const handleClearFilter = () => {
    setMinPrice("");
    setMaxPrice("");
    setAppliedMin("");
    setAppliedMax("");
    setPage(1);
  };

  const handleSortChange = (val) => {
    setSort(val);
    setPage(1);
  };

  const isParent = category && (!category.ParentID);
  const hasChildren = category?.children?.length > 0;
  const hasSiblings = category?.siblings?.length > 0;

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* ===== Breadcrumb ===== */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-red-600 transition-colors">Trang chủ</Link>
          <span>›</span>
          {category?.parent && (
            <>
              <Link
                href={`/category/${category.parent.Slug}`}
                className="hover:text-red-600 transition-colors"
              >
                {category.parent.CategoryName}
              </Link>
              <span>›</span>
            </>
          )}
          <span className="text-gray-800 font-medium">{category?.CategoryName || slug}</span>
        </nav>
      </div>

      {/* ===== Banner ===== */}
      <div className="max-w-7xl mx-auto px-4 mt-3">
        <Swiper spaceBetween={12} slidesPerView={2} className="rounded-xl overflow-hidden">
          <SwiperSlide><img src="/banner_collec_1.webp" className="rounded-xl w-full object-cover h-[120px]" /></SwiperSlide>
          <SwiperSlide><img src="/banner_collec_2.webp" className="rounded-xl w-full object-cover h-[120px]" /></SwiperSlide>
          <SwiperSlide><img src="/banner_collec_3.webp" className="rounded-xl w-full object-cover h-[120px]" /></SwiperSlide>
        </Swiper>
      </div>

      {/* ===== Category title + subcategory chips ===== */}
      <div className="max-w-7xl mx-auto px-4 mt-5">
        <h1 className="text-xl font-bold text-gray-900 mb-3">
          {category?.CategoryName || "Danh mục sản phẩm"}
        </h1>

        {/* Nếu có danh mục con → hiển thị chips con */}
        {hasChildren && (
          <div className="flex flex-wrap gap-2 mb-4">
            <Link
              href={`/category/${slug}`}
              className="px-4 py-1.5 rounded-full text-sm font-medium bg-red-600 text-white"
            >
              Tất cả
            </Link>
            {category.children.map((child) => (
              <Link
                key={child.CategoryID}
                href={`/category/${child.Slug}`}
                className="px-4 py-1.5 rounded-full text-sm font-medium border border-gray-300 text-gray-700 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
              >
                {child.CategoryName}
              </Link>
            ))}
          </div>
        )}

        {/* Nếu là danh mục con → hiển thị chips anh em (siblings) */}
        {!hasChildren && hasSiblings && (
          <div className="flex flex-wrap gap-2 mb-4">
            <Link
              href={`/category/${category?.parent?.Slug}`}
              className="px-4 py-1.5 rounded-full text-sm font-medium border border-gray-300 text-gray-700 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
            >
              Tất cả {category?.parent?.CategoryName}
            </Link>
            {category.siblings.map((sibling) => (
              <Link
                key={sibling.CategoryID}
                href={`/category/${sibling.Slug}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  sibling.Slug === slug
                    ? "bg-red-600 text-white border-red-600"
                    : "border-gray-300 text-gray-700 hover:bg-red-600 hover:text-white hover:border-red-600"
                }`}
              >
                {sibling.CategoryName}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ===== Sort bar ===== */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3 rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-700">Sắp xếp:</span>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSortChange(opt.value)}
                className={`px-3 py-1.5 rounded-md text-sm border transition-all ${
                  sort === opt.value
                    ? "bg-red-600 text-white border-red-600"
                    : "border-gray-300 text-gray-600 hover:border-red-400 hover:text-red-600"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 hover:border-red-400 hover:text-red-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zM6 12a1 1 0 011-1h10a1 1 0 010 2H7a1 1 0 01-1-1zm4 6a1 1 0 011-1h4a1 1 0 010 2h-4a1 1 0 01-1-1z" />
            </svg>
            Bộ lọc
            {(appliedMin || appliedMax) && (
              <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
            )}
          </button>

          {pagination && (
            <span className="text-sm text-gray-500 hidden sm:block">
              {pagination.totalItems} sản phẩm
            </span>
          )}
        </div>
      </div>

      {/* ===== Main Content ===== */}
      <div className="max-w-7xl mx-auto px-4 mt-4">
        <div className="flex gap-5">
          {/* ===== Sidebar (Desktop) ===== */}
          <aside className="hidden lg:block w-[240px] flex-shrink-0">
            <FilterPanel
              minPrice={minPrice}
              maxPrice={maxPrice}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
              onApply={handleApplyFilter}
              onClear={handleClearFilter}
              appliedMin={appliedMin}
              appliedMax={appliedMax}
            />
          </aside>

          {/* ===== Product Grid ===== */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl h-64 animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mb-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-lg font-medium">Không tìm thấy sản phẩm</p>
                <p className="text-sm mt-1">Thử thay đổi bộ lọc hoặc chọn danh mục khác</p>
                {(appliedMin || appliedMax) && (
                  <button
                    onClick={handleClearFilter}
                    className="mt-4 px-4 py-2 rounded-lg border border-red-500 text-red-600 text-sm hover:bg-red-50 transition"
                  >
                    Xóa bộ lọc giá
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.ProductID} product={product} />
                ))}
              </div>
            )}

            {/* ===== Pagination ===== */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  «
                </button>
                {Array.from({ length: pagination.totalPages }).map((_, i) => {
                  const p = i + 1;
                  const isActive = page === p;
                  const show = p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1;
                  const showDots = !show && (p === 2 || p === pagination.totalPages - 1);
                  if (showDots) return <span key={p} className="text-gray-400 text-sm">…</span>;
                  if (!show) return null;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 flex items-center justify-center rounded-md border text-sm transition-all ${
                        isActive ? "bg-red-600 text-white border-red-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  disabled={page === pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  »
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== Mobile Sidebar Drawer ===== */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative ml-auto w-[280px] h-full bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b">
              <h3 className="font-bold text-gray-900">Bộ lọc</h3>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <FilterPanel
                minPrice={minPrice}
                maxPrice={maxPrice}
                setMinPrice={setMinPrice}
                setMaxPrice={setMaxPrice}
                onApply={handleApplyFilter}
                onClear={handleClearFilter}
                appliedMin={appliedMin}
                appliedMax={appliedMax}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== Filter Panel Component ===== */
function FilterPanel({ minPrice, maxPrice, setMinPrice, setMaxPrice, onApply, onClear, appliedMin, appliedMax }) {
  const hasActive = appliedMin || appliedMax;
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm sticky top-6">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wide text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zM6 12a1 1 0 011-1h10a1 1 0 010 2H7a1 1 0 01-1-1zm4 6a1 1 0 011-1h4a1 1 0 010 2h-4a1 1 0 01-1-1z" />
        </svg>
        Khoảng Giá
      </h3>

      <div className="space-y-3">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Từ</span>
          <input
            type="number"
            min="0"
            placeholder="0đ"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-colors"
          />
        </div>
        
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Đến </span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-colors"
          />
        </div>
      </div>

      {/* Quick price ranges */}
      <div className="mt-4 flex flex-wrap gap-2">
        {[
          { label: "Dưới 200K", min: "", max: "200000" },
          { label: "Từ 200K - 500K", min: "200000", max: "500000" },
          { label: "Từ 500K - 1M", min: "500000", max: "1000000" },
          { label: "Mức giá trên 1M", min: "1000000", max: "" },
        ].map((r) => (
          <button
            key={r.label}
            onClick={() => { setMinPrice(r.min); setMaxPrice(r.max); }}
            className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
              minPrice === r.min && maxPrice === r.max
                ? "bg-red-50 text-red-600 border-red-200 shadow-sm"
                : "bg-gray-50/50 border-gray-100 text-gray-600 hover:border-red-200 hover:text-red-500 hover:bg-white"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="mt-5 flex gap-2">
        <button
          onClick={onApply}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2.5 rounded-lg shadow-sm transition-all"
        >
          Áp dụng
        </button>
        {hasActive && (
          <button
            onClick={onClear}
            className="px-4 py-2.5 text-sm font-semibold border border-gray-200 bg-gray-50 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all"
          >
            Hủy
          </button>
        )}
      </div>

      {hasActive && (
        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-xs font-medium text-red-700 leading-relaxed">
          Đang áp dụng bộ lọc:<br/>
          {appliedMin ? `Tối thiểu: ${Number(appliedMin).toLocaleString("vi-VN")}đ` : ""}
          {appliedMin && appliedMax ? <br/> : ""}
          {appliedMax ? `Tối đa: ${Number(appliedMax).toLocaleString("vi-VN")}đ` : ""}
        </div>
      )}
    </div>
  );
}
