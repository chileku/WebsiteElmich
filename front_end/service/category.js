import axiosClient from "./axiosClient";

const categoryService = {
  // Lấy danh sách category (có phân trang + search)
  getAll: (params) => {
    return axiosClient.get("/categories", { params });
  },

  // Lấy category cha + con
  getParentsWithChildren: () => {
    return axiosClient.get("/categories/getAllParentsWithChildren");
  },

  // Lấy sản phẩm theo slug category
  getProductsBySlug: (slug, params) => {
    return axiosClient.get(`/categories/slug/${slug}/products`, { params });
  },

  // Lấy thông tin category theo slug (kèm children + siblings + parent)
  getBySlug: (slug) => {
    return axiosClient.get(`/categories/slug/${slug}`);
  },

  // Thêm category (Admin)
  create: (data) => {
    return axiosClient.post("/categories", data);
  },

  // Cập nhật category (Admin)
  update: (id, data) => {
    return axiosClient.put(`/categories/${id}`, data);
  },

  // Xóa category (Admin)
  delete: (id) => {
    return axiosClient.delete(`/categories/${id}`);
  },
};

export default categoryService;
