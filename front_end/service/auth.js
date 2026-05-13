import axiosClient from "./axiosClient";

const authService = {
  // Đăng nhập
  login: (data) => {
    return axiosClient.post("/auth/login", data);
  },

  /** Thông tin user đăng nhập — GET /api/auth/me (Bearer token) */
  getInfo: () => axiosClient.get("/auth/me"),
  getMe: () => axiosClient.get("/auth/me"),

  /** Cập nhật thông tin cá nhân */
  updateProfile: (data) => axiosClient.put("/auth/me", data),

  /** Đổi mật khẩu */
  changePassword: (data) => axiosClient.post("/auth/change-password", data),

  // (tuỳ chọn) logout
  logout: () => {
    return axiosClient.post("/auth/logout");
  },
};

export default authService;
