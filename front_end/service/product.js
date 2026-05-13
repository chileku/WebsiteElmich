// services/productService.js
import axiosClient from "./axiosClient";

const productService = {
  // ---------------- Public ----------------
  getAll: (params) => axiosClient.get("/products", { params }),
  getById: (id) => axiosClient.get(`/products/${id}`),
  getBySlug: (slug) => axiosClient.get(`/products/slug/${slug}`),

  // ---------------- Admin ----------------
  // Tạo sản phẩm mới + nhiều ảnh
  // `data` phải là FormData, append('images', file) cho file
  create: (data) =>
    axiosClient.post("/products", data),

  // Thêm ảnh riêng lẻ cho sản phẩm
  // productId: ID sản phẩm, data: FormData chứa field "image"
  createImage: (productId, data) =>
    axiosClient.post(`/upload/products/${productId}/images`, data),

  // Lấy danh sách ảnh theo productId
  getProductImages: (productId) =>
    axiosClient.get(`/upload/products/${productId}/images`),

  // Xóa ảnh theo ProductImageID
  deleteProductImage: (imageId) =>
    axiosClient.delete(`/upload/images/${imageId}`),

  // Cập nhật sản phẩm (JSON)
  update: (id, data) => axiosClient.put(`/products/${id}`, data),

  // Xóa sản phẩm
  delete: (id) => axiosClient.delete(`/products/${id}`),
};

export default productService;
