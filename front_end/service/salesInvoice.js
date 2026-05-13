import axiosClient from "./axiosClient";

const salesInvoiceService = {
  getAll: (params) => axiosClient.get("/salesinvoices", { params }),
  getById: (id) => axiosClient.get(`/salesinvoices/${id}`),
  create: (data) => axiosClient.post("/salesinvoices", data),
  update: (id, data) => axiosClient.put(`/salesinvoices/${id}`, data),
  remove: (id) => axiosClient.delete(`/salesinvoices/${id}`),

  /** Lấy đơn hàng của user đang đăng nhập */
  getMyOrders: (params) => axiosClient.get("/salesinvoices/my", { params }),
};

export default salesInvoiceService;
