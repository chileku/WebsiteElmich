// services/accountService.js
import axiosClient from "./axiosClient";

const accountService = {
  // Lấy danh sách account (có phân trang + search)
  getAll: (params) => {
    return axiosClient.get("/accounts", { params });
  },

  // Tạo tài khoản mới
  create: (data) => {
    return axiosClient.post("/accounts", data);
  },

  // Cập nhật tài khoản
  update: (id, data) => {
    return axiosClient.put(`/accounts/${id}`, data);
  },

  // Xóa tài khoản
  remove: (id) => {
    return axiosClient.delete(`/accounts/${id}`);
  },
};

export default accountService;
