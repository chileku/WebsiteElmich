import axiosClient from "./axiosClient";

const statsService = {
  getStats: async () => {
    const response = await axiosClient.get("/stats");
    return response.data;
  },
  getRevenueByMonth: async (year) => {
    const response = await axiosClient.get("/stats/revenue-by-month", {
      params: { year },
    });
    return response.data;
  },
  getTopProducts: async (limit = 5) => {
    const response = await axiosClient.get("/stats/top-products", {
      params: { limit },
    });
    return response.data;
  },
  getOrderStatusStats: async () => {
    const response = await axiosClient.get("/stats/order-status");
    return response.data;
  },
};

export default statsService;
