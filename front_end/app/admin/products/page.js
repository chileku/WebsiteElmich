"use client";
import { useState, useEffect } from "react";
import DataTable from "@/component/admin/table";
import productService from "@/service/product";
import categoryService from "@/service/category";
import discountService from "@/service/discount";
import { Pencil, Trash, Plus } from "lucide-react";
import { MenuItem, Select, FormControl } from "@mui/material";
import ProductDescriptionEditor from "@/component/admin/ProductDescriptionEditor";

export default function Products() {
  // === State ===
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); // mới: đang edit
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [selectedParentCat, setSelectedParentCat] = useState("");
  const [selectedChildCat, setSelectedChildCat] = useState("");
  const [formData, setFormData] = useState({
    ProductName: "",
    Price: 0,
    Quantity: 0,
    CategoryID: "",
    DiscountID: "",
    Description: "",
  });
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // === Pagination & Search ===
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(7);
  const [keyword, setKeyword] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDiscount, setFilterDiscount] = useState("");

  // === Fetch data ===
  const fetchData = async (
    page = 1,
    kw = keyword,
    catId = filterCategory,
    discId = filterDiscount,
  ) => {
    setLoading(true);
    try {
      const res = await productService.getAll({
        page,
        limit: pageSize,
        keyword: kw,
        categoryID: catId || undefined,
        discountID: discId || undefined,
      });
      setProducts(res.data?.data || []);
      setCurrentPage(res.data?.pagination?.page || page);
      setTotalPages(res.data?.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      const [catRes, discRes] = await Promise.all([
        categoryService.getAll({ limit: 1000 }),
        discountService.getAll({ limit: 1000 }),
      ]);
      setCategories(catRes.data.data || []);
      setDiscounts(discRes.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData(1, keyword, filterCategory, filterDiscount);
  }, [filterCategory, filterDiscount]);

  useEffect(() => {
    fetchOptions();
  }, []);

  // === Handle create/update product ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const finalCategoryId = selectedChildCat
        ? selectedChildCat
        : selectedParentCat || "";

      if (editingId) {
        // === Update ===
        const payload = {
          ProductName: formData.ProductName,
          Price: formData.Price === "" ? 0 : Number(formData.Price),
          Quantity: formData.Quantity === "" ? 0 : Number(formData.Quantity),
          CategoryID: finalCategoryId === "" ? null : Number(finalCategoryId),
          DiscountID:
            formData.DiscountID === "" ? null : Number(formData.DiscountID),
          Description: formData.Description || "",
        };

        await productService.update(editingId, payload);

        // Backend PUT /products/:id chỉ nhận JSON, ảnh upload xử lý riêng.
        let imageUploadFailed = false;
        if (images.length) {
          try {
            // Thay thế toàn bộ ảnh cũ bằng ảnh mới
            const existingRes =
              await productService.getProductImages(editingId);
            const existingImages = existingRes?.data?.data || [];

            for (const oldImage of existingImages) {
              await productService.deleteProductImage(oldImage.ProductImageID);
            }

            for (const img of images) {
              const imgFd = new FormData();
              imgFd.append("image", img); // backend expects single file field "image"
              await productService.createImage(editingId, imgFd);
            }
          } catch (imgErr) {
            console.error(imgErr);
            imageUploadFailed = true;
          }
        }

        alert(
          imageUploadFailed
            ? "Cập nhật sản phẩm thành công, nhưng upload ảnh thất bại."
            : "Cập nhật sản phẩm thành công!",
        );
      } else {
        // === Create ===
        const fd = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (key === "CategoryID") fd.append("CategoryID", finalCategoryId);
          else fd.append(key, value);
        });
        images.forEach((img) => fd.append("images", img)); // backend expects array field "images"

        await productService.create(fd);
        alert("Tạo sản phẩm thành công!");
      }

      setShowForm(false);
      setEditingId(null);
      setShowDescriptionModal(false);
      setSelectedParentCat("");
      setSelectedChildCat("");
      setFormData({
        ProductName: "",
        Price: 0,
        Quantity: 0,
        CategoryID: "",
        DiscountID: "",
        Description: "",
      });
      setImages([]);
      fetchData(currentPage, keyword, filterCategory, filterDiscount);
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi tạo/cập nhật sản phẩm.");
    } finally {
      setSubmitting(false);
    }
  };

  // === Handle delete product ===
  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await productService.delete(id);
      fetchData(currentPage, keyword, filterCategory, filterDiscount);
    } catch (err) {
      console.error(err);
      alert("Có lỗi khi xóa sản phẩm.");
    }
  };

  // === Handle edit click ===
  const handleEdit = (product) => {
    let parentId = "";
    let childId = "";
    if (product.CategoryID) {
      const cat = categories.find((c) => c.CategoryID === product.CategoryID);
      if (cat) {
        const isChild =
          cat.ParentID &&
          cat.ParentID !== "null" &&
          cat.ParentID !== "NULL" &&
          cat.ParentID !== 0 &&
          cat.ParentID !== "0";
        if (isChild) {
          parentId = cat.ParentID;
          childId = cat.CategoryID;
        } else {
          parentId = cat.CategoryID;
        }
      }
    }
    setSelectedParentCat(parentId);
    setSelectedChildCat(childId);

    setEditingId(product.ProductID);
    setFormData({
      ProductName: product.ProductName,
      Price: product.Price,
      Quantity: product.Quantity,
      CategoryID: product.CategoryID || "",
      DiscountID: product.DiscountID || "",
      Description: product.Description || "",
    });
    setShowDescriptionModal(false);
    setImages([]);
    setShowForm(true);
  };

  // === Table columns ===
  const columns = [
    { label: "STT", render: (_, idx) => idx + 1 },
    { label: "Tên Sản Phẩm", key: "ProductName" },
    { label: "Số lượng thực", key: "Quantity" },
    { label: "Khả dụng", key: "AvailableQuantity" },
    {
      label: "Giá",
      key: "Price",
      render: (row) => Number(row.Price).toLocaleString(),
    },
    {
      label: "Giá Sale",
      key: "FinalPrice",
      render: (row) =>
        row.FinalPrice ? Number(row.FinalPrice).toLocaleString() : "-",
    },
    {
      label: "Ảnh",
      key: "Image",
      render: (product) => {
        const imageUrl = product.ProductImages?.length
          ? `http://localhost:5000/${product.ProductImages[0].ImagePath}`
          : "/no-image.png";
        return (
          <img
            src={imageUrl}
            alt={product.ProductName}
            className="w-16 h-16 object-cover rounded"
          />
        );
      },
    },
  ];

  const actions = [
    {
      label: "Edit",
      icon: Pencil,
      className: "text-blue-500",
      onClick: handleEdit,
    },
    {
      label: "Delete",
      icon: Trash,
      className: "text-red-500",
      onClick: (row) => handleDelete(row.ProductID),
    },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      {/* HEADER & SEARCH */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Quản lý Sản Phẩm</h1>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") fetchData(1, keyword);
            }}
            className="bg-[#1E1E1E] text-gray-200 px-4 py-2 rounded-lg border border-gray-700 outline-none w-[200px]"
          />

          <FormControl sx={{ minWidth: 150 }}>
            <Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              displayEmpty
              size="small"
              sx={{
                bgcolor: "#1E1E1E",
                color: "white",
                ".MuiOutlinedInput-notchedOutline": { borderColor: "#374151" },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4B5563",
                },
              }}
            >
              <MenuItem value="">Tất cả danh mục</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.CategoryID} value={cat.CategoryID}>
                  {cat.CategoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <Select
              value={filterDiscount}
              onChange={(e) => setFilterDiscount(e.target.value)}
              displayEmpty
              size="small"
              sx={{
                bgcolor: "#1E1E1E",
                color: "white",
                ".MuiOutlinedInput-notchedOutline": { borderColor: "#374151" },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4B5563",
                },
              }}
            >
              <MenuItem value="">Tất cả mã giảm giá</MenuItem>
              {discounts.map((disc) => (
                <MenuItem key={disc.DiscountID} value={disc.DiscountID}>
                  {disc.DiscountName || `Giảm ${disc.DiscountRate * 100}%`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 font-semibold transition"
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setShowDescriptionModal(false);
              setSelectedParentCat("");
              setSelectedChildCat("");
              setFormData({
                ProductName: "",
                Price: 0,
                Quantity: 0,
                CategoryID: "",
                DiscountID: "",
                Description: "",
              });
              setImages([]);
            }}
          >
            <Plus className="w-5 h-5" /> Thêm Sản Phẩm
          </button>
        </div>
      </div>

      <div className="bg-[#1E1E1E] rounded-xl shadow-lg border border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Danh sách Sản Phẩm</h2>
        </div>

        {/* SCROLLABLE TABLE CONTENT */}
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
          <DataTable columns={columns} data={products} actions={actions} />
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() =>
              fetchData(
                currentPage - 1,
                keyword,
                filterCategory,
                filterDiscount,
              )
            }
          >
            ← Trước
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`px-3 py-1 rounded ${
                page === currentPage
                  ? "bg-red-600 text-white"
                  : "bg-gray-600 text-white hover:bg-gray-500"
              }`}
              onClick={() =>
                fetchData(page, keyword, filterCategory, filterDiscount)
              }
            >
              {page}
            </button>
          ))}

          <button
            className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() =>
              fetchData(
                currentPage + 1,
                keyword,
                filterCategory,
                filterDiscount,
              )
            }
          >
            Sau →
          </button>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E1E1E] text-gray-300 p-6 rounded-xl w-[400px] shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-white">
              {editingId ? "Cập nhật sản phẩm" : "Thêm Sản Phẩm"}
            </h2>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Tên sản phẩm"
                value={formData.ProductName}
                onChange={(e) =>
                  setFormData({ ...formData, ProductName: e.target.value })
                }
                className="w-full p-2 rounded bg-[#2A2A2A] text-white outline-none"
                required
              />
              <input
                type="number"
                placeholder="Giá"
                value={formData.Price}
                onChange={(e) =>
                  setFormData({ ...formData, Price: e.target.value })
                }
                className="w-full p-2 rounded bg-[#2A2A2A] text-white outline-none"
                required
              />
              <input
                type="number"
                placeholder="Số lượng"
                value={formData.Quantity}
                onChange={(e) =>
                  setFormData({ ...formData, Quantity: e.target.value })
                }
                className="w-full p-2 rounded bg-[#2A2A2A] text-white outline-none"
              />

              {/* Danh Mục Cha */}
              <FormControl fullWidth>
                <Select
                  value={selectedParentCat}
                  onChange={(e) => {
                    setSelectedParentCat(e.target.value);
                    setSelectedChildCat(""); // Reset child khi chọn cha mới
                  }}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected)
                      return (
                        <span style={{ color: "#aaa" }}>
                          -- Danh mục Cha --
                        </span>
                      );
                    const cat = categories.find(
                      (c) => c.CategoryID === selected,
                    );
                    return cat?.CategoryName;
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: { maxHeight: 200, backgroundColor: "#333" },
                    },
                  }}
                  sx={{
                    color: "white",
                    ".MuiSvgIcon-root": { color: "white" },
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {categories
                    .filter(
                      (c) =>
                        !c.ParentID ||
                        c.ParentID === "null" ||
                        c.ParentID === "NULL" ||
                        Number(c.ParentID) === 0,
                    )
                    .map((c) => (
                      <MenuItem
                        key={c.CategoryID}
                        value={c.CategoryID}
                        sx={{ color: "white" }}
                      >
                        {c.CategoryName}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              {/* Danh Mục Con (Chỉ hiển thị nếu danh mục cha có con) */}
              {selectedParentCat &&
                categories.filter(
                  (c) => Number(c.ParentID) === Number(selectedParentCat),
                ).length > 0 && (
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <Select
                      value={selectedChildCat}
                      onChange={(e) => setSelectedChildCat(e.target.value)}
                      displayEmpty
                      renderValue={(selected) => {
                        if (!selected)
                          return (
                            <span style={{ color: "#aaa" }}>
                              -- Danh mục Con (Tùy chọn) --
                            </span>
                          );
                        const cat = categories.find(
                          (c) => c.CategoryID === selected,
                        );
                        return cat?.CategoryName;
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: { maxHeight: 200, backgroundColor: "#333" },
                        },
                      }}
                      sx={{
                        color: "white",
                        ".MuiSvgIcon-root": { color: "white" },
                      }}
                    >
                      <MenuItem value="">
                        <em>-- Mặc định lấy từ danh mục Cha --</em>
                      </MenuItem>
                      {categories
                        .filter(
                          (c) =>
                            Number(c.ParentID) === Number(selectedParentCat),
                        )
                        .map((c) => (
                          <MenuItem
                            key={c.CategoryID}
                            value={c.CategoryID}
                            sx={{ color: "white" }}
                          >
                            {c.CategoryName}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                )}

              <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
                <Select
                  value={formData.DiscountID || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, DiscountID: e.target.value })
                  }
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected)
                      return (
                        <span style={{ color: "#aaa" }}>
                          -- Chọn Discount --
                        </span>
                      );
                    const d = discounts.find((d) => d.DiscountID === selected);
                    return d?.DiscountName || `ID: ${d?.DiscountID}`;
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: { maxHeight: 200, backgroundColor: "#333" },
                    },
                  }}
                  sx={{
                    color: "white",
                    ".MuiSvgIcon-root": { color: "white" },
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {discounts.map((d) => (
                    <MenuItem
                      key={d.DiscountID}
                      value={d.DiscountID}
                      sx={{ color: "white" }}
                    >
                      {d.DiscountName ||
                        `ID: ${d.DiscountID} giảm ${d.DiscountRate * 100}%`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <div className="space-y-1">
                <div className="text-xs text-gray-400">
                  {formData.Description
                    ? "Đã có mô tả (ấn để sửa)"
                    : "Chưa có mô tả (ấn để thêm)"}
                </div>
                <button
                  type="button"
                  onClick={() => setShowDescriptionModal(true)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
                >
                  {formData.Description ? "Sửa mô tả" : "Thêm mô tả"}
                </button>
              </div>

              <input
                type="file"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setImages((prev) => {
                    const existing = new Set(
                      prev.map((f) => f.name + f.size + f.lastModified),
                    );
                    const merged = [...prev];
                    for (const f of files) {
                      const key = f.name + f.size + f.lastModified;
                      if (!existing.has(key)) merged.push(f);
                    }
                    return merged;
                  });
                }}
                className="w-full p-2 rounded bg-[#2A2A2A] text-white outline-none"
              />
              {images.length ? (
                <div className="text-xs text-gray-400">
                  Đã chọn {images.length} ảnh:{" "}
                  {images.map((f) => f.name).join(", ")}
                </div>
              ) : null}

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setImages([]);
                    setEditingId(null);
                    setShowDescriptionModal(false);
                    setSelectedParentCat("");
                    setSelectedChildCat("");
                  }}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition"
                >
                  {submitting
                    ? "Đang xử lý..."
                    : editingId
                      ? "Cập nhật"
                      : "Tạo sản phẩm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal mô tả (rộng hơn) */}
      {showForm && showDescriptionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-[#1E1E1E] text-gray-300 rounded-xl w-[900px] max-w-[95vw] max-h-[85vh] shadow-lg flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-[#1E1E1E] z-30 shrink-0">
              <h2 className="text-lg font-bold text-white">
                {editingId ? "Sửa mô tả sản phẩm" : "Thêm mô tả sản phẩm"}
              </h2>
              <button
                type="button"
                onClick={() => setShowDescriptionModal(false)}
                className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
              >
                Đóng
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 relative bg-[#1E1E1E]">
              <ProductDescriptionEditor
                productId={editingId}
                value={formData.Description}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, Description: val }))
                }
              />
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 p-6 border-t border-gray-800 bg-[#1E1E1E] shrink-0">
              <button
                type="button"
                onClick={() => setShowDescriptionModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                Xong
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
