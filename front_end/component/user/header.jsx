"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import categoryService from "@/service/category";
import authService from "@/service/auth";
import productService from "@/service/product";
import { logoutClient } from "@/lib/auth-cookie";
import { useCartStore } from "@/store/cartstore";

const FALLBACK_MEGA_MENU = [
  {
    CategoryID: "cat-binh-giu-nhiet",
    CategoryName: "Bình giữ nhiệt",
    Slug: "binh-giu-nhiet",
    children: [
      { CategoryID: "sub-1", CategoryName: "Bình giữ nhiệt văn phòng", Slug: "binh-giu-nhiet-van-phong" },
      { CategoryID: "sub-2", CategoryName: "Bình giữ nhiệt gia đình", Slug: "binh-giu-nhiet-gia-dinh" },
      { CategoryID: "sub-3", CategoryName: "Bình giữ nhiệt thể thao", Slug: "binh-giu-nhiet-the-thao" },
      { CategoryID: "sub-4", CategoryName: "Bình giữ nhiệt trẻ em", Slug: "binh-giu-nhiet-tre-em" },
      { CategoryID: "sub-5", CategoryName: "Bình giữ nhiệt dã ngoại", Slug: "binh-giu-nhiet-da-ngoai" },
      { CategoryID: "sub-6", CategoryName: "Cốc giữ nhiệt", Slug: "coc-giu-nhiet" },
    ],
  },
  { CategoryID: "cat-hop-com", CategoryName: "Hộp cơm giữ nhiệt", Slug: "hop-com-giu-nhiet", children: [] },
  { CategoryID: "cat-hop-bao-quan", CategoryName: "Hộp bảo quản", Slug: "hop-bao-quan", children: [] },
  { CategoryID: "cat-do-sinh-hoat", CategoryName: "Đồ dùng sinh hoạt", Slug: "do-dung-sinh-hoat", children: [] },
  { CategoryID: "cat-noi-chao", CategoryName: "Nồi / chảo", Slug: "noi-chao", children: [] },
  {
    CategoryID: "cat-dung-cu-bep",
    CategoryName: "Dụng cụ nấu ăn và phụ kiện nhà bếp",
    Slug: "dung-cu-nau-an-va-phu-kien-nha-bep",
    children: [],
  },
  { CategoryID: "cat-am-sieu-toc", CategoryName: "Ấm đun nước siêu tốc", Slug: "am-dun-nuoc-sieu-toc", children: [] },
  { CategoryID: "cat-bep-tu", CategoryName: "Bếp từ / Bếp hồng ngoại", Slug: "bep-tu-bep-hong-ngoai", children: [] },
  { CategoryID: "cat-may-xay", CategoryName: "Máy xay sinh tố", Slug: "may-xay-sinh-to", children: [] },
  { CategoryID: "cat-may-ep", CategoryName: "Máy ép trái cây", Slug: "may-ep-trai-cay", children: [] },
  { CategoryID: "cat-may-hut-bui", CategoryName: "Máy hút bụi", Slug: "may-hut-bui", children: [] },
  { CategoryID: "cat-dien-gia-dung", CategoryName: "Điện gia dụng", Slug: "dien-gia-dung", children: [] },
  { CategoryID: "cat-do-tre-em", CategoryName: "Đồ dùng trẻ em", Slug: "do-dung-tre-em", children: [] },
  { CategoryID: "cat-pha-le-thuy-tinh", CategoryName: "Pha lê và thủy tinh", Slug: "pha-le-va-thuy-tinh", children: [] },
];

function CategorySidebar({ categories, activeCategory, setActiveCategory, onClose }) {
  return (
    <aside className="w-full lg:w-[280px] lg:min-w-[280px] bg-gray-100 border-r border-gray-200">
      <ul className="py-2">
        {categories.map((category) => {
          const isActive = String(activeCategory?.CategoryID) === String(category.CategoryID);
          return (
            <li key={category.CategoryID} className="relative">
              <div
                onMouseEnter={() => setActiveCategory(category)}
                className={`flex items-center justify-between transition-all duration-200 ${isActive ? "bg-white" : "hover:bg-white"
                  }`}
              >
                <Link
                  href={`/category/${category.Slug}`}
                  onClick={onClose}
                  className={`flex-1 px-5 py-3 font-semibold block ${isActive ? "text-red-600" : "text-gray-800 hover:text-red-600"
                    }`}
                >
                  {category.CategoryName}
                </Link>
                {(category.children || []).length > 0 && (
                  <span className={`pr-4 text-xs ${isActive ? "text-red-600" : "text-gray-400"}`}>▶</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

function SubCategoryGrid({ category, onClose }) {
  const children = category?.children || [];
  return (
    <section className="flex-1 p-6 lg:p-8 bg-white">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-900">{category?.CategoryName || "Danh mục"}</h3>
        <Link
          href={`/category/${category?.Slug}`}
          onClick={onClose}
          className="text-sm text-red-600 hover:underline font-medium"
        >
          Xem tất cả ›
        </Link>
      </div>
      {children.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-4">
          {children.map((child) => (
            <Link
              key={child.CategoryID}
              href={`/category/${child.Slug}`}
              onClick={onClose}
              className="text-sm text-gray-700 hover:text-red-600 transition-colors duration-200"
            >
              {child.CategoryName}
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">Danh mục này hiện chưa có nhóm sản phẩm con.</p>
      )}
    </section>
  );
}

function MegaMenu({ categories }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categories[0] || null);
  const [mobileOpenMap, setMobileOpenMap] = useState({});

  useEffect(() => {
    if (!activeCategory && categories.length) setActiveCategory(categories[0]);
  }, [categories, activeCategory]);

  const toggleMobileCategory = (id) => {
    setMobileOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsMenuOpen(true)}
      onMouseLeave={() => setIsMenuOpen(false)}
    >
      <button
        type="button"
        onClick={() => {
          if (window.innerWidth < 1024) {
            setIsMenuOpen((prev) => !prev);
          } else {
            setIsMenuOpen(false);
            window.location.href = '/category/all';
          }
        }}
        className="flex items-center gap-2 py-3 px-5 bg-red-700 hover:bg-red-800 transition rounded-md font-semibold"
      >
        <span>☰</span> Tất cả sản phẩm
      </button>

      {/* Desktop mega menu */}
      <div
        className={`hidden lg:block absolute left-0 top-full mt-1 w-[min(1180px,calc(100vw-2rem))] bg-white text-black shadow-2xl rounded-lg border border-gray-100 z-50 transition-all duration-200 ${isMenuOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1"
          }`}
      >
        <div className="flex min-h-[420px]">
          <CategorySidebar
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            onClose={() => setIsMenuOpen(false)}
          />
          <SubCategoryGrid category={activeCategory} onClose={() => setIsMenuOpen(false)} />
        </div>
      </div>

      {/* Mobile accordion menu */}
      <div
        className={`lg:hidden absolute left-0 top-full mt-1 w-[calc(100vw-2rem)] max-h-[70vh] overflow-auto bg-white text-black shadow-xl rounded-lg border border-gray-100 z-50 transition-all duration-200 ${isMenuOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1"
          }`}
      >
        <div className="p-2">
          {/* Link Xem tất cả sản phẩm cho Mobile */}
          <div className="border-b border-gray-100">
            <Link
              href="/category/all"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-3 text-left font-bold text-red-600 hover:text-red-700"
            >
              Tất cả sản phẩm
            </Link>
          </div>
          {categories.map((category) => {
            const isOpen = !!mobileOpenMap[category.CategoryID];
            const hasChildren = (category.children || []).length > 0;
            return (
              <div key={category.CategoryID} className="border-b border-gray-100">
                <div className="flex items-center">
                  <Link
                    href={`/category/${category.Slug}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 px-3 py-3 text-left font-semibold text-gray-800 hover:text-red-600"
                  >
                    {category.CategoryName}
                  </Link>
                  {hasChildren && (
                    <button
                      type="button"
                      onClick={() => toggleMobileCategory(category.CategoryID)}
                      className="px-3 py-3 text-gray-500"
                    >
                      <span className={`inline-block transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>▾</span>
                    </button>
                  )}
                </div>
                {isOpen && hasChildren && (
                  <div className="pb-3 px-3 grid grid-cols-1 gap-2">
                    <Link
                      href={`/category/${category.Slug}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-sm font-medium text-red-600 hover:underline"
                    >
                      → Xem tất cả {category.CategoryName}
                    </Link>
                    {category.children.map((child) => (
                      <Link
                        key={child.CategoryID}
                        href={`/category/${child.Slug}`}
                        className="text-sm text-gray-600 hover:text-red-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {child.CategoryName}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // === SEARCH STATE ===
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Cart count (mounted pattern tránh SSR hydration mismatch với Zustand persist)
  const [mounted, setMounted] = useState(false);
  const cartTotal = useCartStore((s) => s.getTotalItems());
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getParentsWithChildren();
        if (res?.data?.data) {
          setCategories(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi lấy category:", error);
      }
    };

    fetchCategories();
  }, []);

  // === SEARCH EFFECT (DEBOUNCED) ===
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        // Truyền parameter tìm kiếm
        const res = await productService.getAll({
          keyword: searchQuery,
          limit: 6, // Hiển thị tối đa 6 kết quả trên thanh tìm kiếm
        });
        setSearchResults(res.data?.data || []);
        setShowSearchDropdown(true);
      } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    let cancelled = false;

    const loadUser = async () => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        setUser(null);
        setAuthLoading(false);
        return;
      }

      setAuthLoading(true);
      try {
        const res = await authService.getInfo();
        if (!cancelled && res.data?.success && res.data?.user) {
          setUser(res.data.user);
        }
      } catch {
        if (!cancelled) {
          localStorage.removeItem("token");
          clearAuthCookie();
          setUser(null);
        }
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    };

    loadUser();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  async function handleLogout() {
    setUser(null);
    await logoutClient(router);
  }

  return (
    <>
      <header className="w-full border-0 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="hidden lg:block w-1/6">
              <a href="/" className="block">
                <img
                  src="/logo.webp"
                  alt="Elmich chính hãng"
                  className="h-12 object-contain"
                />
              </a>
            </div>

            {/* Right content */}
            <div className="flex items-center justify-end w-full lg:w-5/6 gap-6">
              {/* Search */}
              <div className="relative w-full max-w-md">
                <form
                  className="relative w-full"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      router.push(`/search?keyword=${encodeURIComponent(searchQuery)}`);
                      setShowSearchDropdown(false);
                    }
                  }}
                >
                  <input
                    type="text"
                    placeholder="Nhập tên sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      if (searchQuery.trim()) setShowSearchDropdown(true);
                    }}
                    onBlur={() => {
                      // Delay ẩn dropdown để click link được nhận diện
                      setTimeout(() => setShowSearchDropdown(false), 200);
                    }}
                    className="
                      w-full
                      border border-gray-200
                      rounded-lg
                      px-4 py-2.5
                      focus:outline-none
                      focus:ring-2
                      focus:ring-red-500/50
                      focus:border-red-500
                      text-sm
                      transition-all
                    "
                  />
                  <button
                    type="submit"
                    className="
                      absolute right-2 top-1/2 -translate-y-1/2
                      text-gray-400 hover:text-red-600 p-1.5
                    "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                      />
                    </svg>
                  </button>
                </form>

                {/* Dropdown Hiển Thị Kết Quả Tìm Kiếm */}
                {showSearchDropdown && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-[420px] overflow-y-auto z-[60]">
                    {isSearching ? (
                      <div className="p-5 text-center flex flex-col items-center gap-2">
                        <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-gray-500">Đang tìm kiếm...</span>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <ul className="py-2">
                        {searchResults.map((product) => {
                          const imageUrl = product.ProductImages?.length
                            ? `http://localhost:5000/${product.ProductImages[0].ImagePath}`
                            : "/no-image.png";
                          // Giá hiển thị ưu tiên giá đã Discount (nếu có logic tính sẵn)
                          // Giả sử backend trả về "FinalPrice"
                          const displayPrice = product.FinalPrice || product.Price;

                          return (
                            <li key={product.ProductID}>
                              <Link
                                href={`/product/${product.Slug}`}
                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors group"
                                onClick={() => setShowSearchDropdown(false)}
                              >
                                <img
                                  src={imageUrl}
                                  alt={product.ProductName}
                                  className="w-12 h-12 object-cover rounded-md border border-gray-100"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-red-600 transition-colors">
                                    {product.ProductName}
                                  </p>
                                  <p className="text-red-600 text-sm font-bold mt-0.5">
                                    {Number(displayPrice).toLocaleString("vi-VN")}đ
                                  </p>
                                </div>
                              </Link>
                            </li>
                          );
                        })}
                        <li className="px-4 py-3 border-t border-gray-50 text-center">
                          <button
                            onClick={() => router.push(`/search?keyword=${encodeURIComponent(searchQuery)}`)}
                            className="text-xs font-semibold text-red-600 hover:text-red-700 uppercase tracking-wide"
                          >
                            Xem tất cả kết quả cho "{searchQuery}"
                          </button>
                        </li>
                      </ul>
                    ) : (
                      <div className="p-6 text-center text-sm text-gray-500">
                        Không tìm thấy sản phẩm nào khớp với "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Hotline */}
              <a
                href="tel:1900636925"
                className="hidden xl:flex items-center gap-2 text-sm"
              >
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                    />
                  </svg>
                </span>
                <div>
                  <p className="text-sm text-gray-500">Hotline</p>
                  <p className="text-base font-semibold">1900636925</p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:cskh@elmich.vn"
                className="hidden xl:flex items-center gap-2 text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>

                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-base font-semibold">cskh@elmich.vn</p>
                </div>
              </a>

              {/* Account */}
              <div className="relative group hidden lg:block">
                <div className="flex items-center gap-2">
                  <div className="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  </div>

                  <div className="text-sm text-left font-semibold min-w-0 max-w-[200px]">
                    {authLoading ? (
                      <p className="text-gray-400 text-xs">…</p>
                    ) : user ? (
                      <>
                        <Link
                          href="/profile"
                          className="truncate text-gray-900 hover:text-red-600 transition-colors cursor-pointer block"
                          title={user.FullName}
                        >
                          {user.FullName || user.Username || "Tài khoản"}
                        </Link>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="text-red-600 hover:underline font-medium"
                        >
                          Đăng xuất
                        </button>
                      </>
                    ) : (
                      <>
                        <p>
                          <Link
                            href="/login"
                            className="text-gray-900 hover:text-red-600 transition-colors duration-200"
                          >
                            Đăng nhập
                          </Link>
                        </p>

                        <p>
                          <Link
                            href="/register"
                            className="text-gray-900 hover:text-red-600 transition-colors duration-200"
                          >
                            Đăng ký
                          </Link>
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Cart */}
              <a
                href="/cart"
                className="
            relative
            flex items-center
            gap-2
            px-3 py-2
            rounded-lg
            hover:bg-gray-100
          "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>

                <span
                  className={`
              absolute -top-1 -right-1
              bg-red-600 text-white
              text-xs
              w-5 h-5
              rounded-full
              flex items-center justify-center
              transition-all duration-200
              ${mounted && cartTotal > 0 ? "opacity-100 scale-100" : "opacity-0 scale-0"}
            `}
                >
                  {mounted ? (cartTotal > 99 ? "99+" : cartTotal) : 0}
                </span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* MENU */}
      <div className="w-full bg-red-600 text-white">
        <div className="max-w-7xl mx-auto flex items-center gap-8 px-4">
          <MegaMenu categories={categories.length ? categories : FALLBACK_MEGA_MENU} />

          {/* MENU NGANG LOAD TỪ API */}
          <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
            {categories.slice(0, 5).map((parent) => {
              const hasChildren = parent.children && parent.children.length > 0;

              return (
                <div key={parent.CategoryID} className="relative group/nav-item">
                  {/* Mục danh mục cha */}
                  <Link
                    href={`/category/${parent.Slug}`}
                    className="flex items-center gap-1 px-3 py-2 rounded-full transition-all duration-200 hover:bg-red-700 whitespace-nowrap"
                  >
                    {parent.CategoryName}
                    {hasChildren && <span className="text-[10px]">▾</span>}
                  </Link>

                  {/* Dropdown danh mục con hiển thị khi hover */}
                  {hasChildren && (
                    <div className="absolute left-0 top-full pt-2 opacity-0 invisible translate-y-2 group-hover/nav-item:opacity-100 group-hover/nav-item:visible group-hover/nav-item:translate-y-0 transition-all duration-300 z-[70]">
                      <ul className="bg-white text-gray-800 shadow-xl rounded-lg border border-gray-100 py-2 min-w-[220px]">
                        {parent.children.map((child) => (
                          <li key={child.CategoryID}>
                            <Link
                              href={`/category/${child.Slug}`}
                              className="block px-4 py-2.5 hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                              {child.CategoryName}
                            </Link>
                          </li>
                        ))}
                        <li className="border-t border-gray-50 mt-1">
                          <Link
                            href={`/category/${parent.Slug}`}
                            className="block px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                          >
                            Xem tất cả {parent.CategoryName} →
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
