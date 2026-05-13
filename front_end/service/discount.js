// services/discount.js
import axiosClient from "./axiosClient";

const discountService = {
  // Lấy danh sách discount (có phân trang + search)
  getAll: (params) => {
    return axiosClient.get("/discounts", { params });
  },

  // Lấy chi tiết discount theo ID
  getById: (id) => {
    return axiosClient.get(`/discounts/${id}`);
  },

  // Thêm discount mới (Admin)
  create: (data) => {
    return axiosClient.post("/discounts", data);
  },

  // Cập nhật discount theo ID (Admin)
  update: (id, data) => {
    return axiosClient.put(`/discounts/${id}`, data);
  },

  // Xóa discount theo ID (Admin)
  delete: (id) => {
    return axiosClient.delete(`/discounts/${id}`);
  },
};

export default discountService;
