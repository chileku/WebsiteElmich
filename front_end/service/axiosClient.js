import axios from "axios";
import { clearAuthCookie } from "@/lib/auth-cookie";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api",
  // Không set Content-Type mặc định để axios có thể tự gán đúng
  // (đặc biệt với FormData multipart/form-data có boundary).
});

// Request interceptor: gắn token vào header
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: khi token hết hạn (401) → tự đăng xuất
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Xóa token
      try { localStorage.removeItem("token"); } catch {}
      clearAuthCookie();

      // Redirect về trang login (dùng window.location để không cần router)
      if (typeof window !== "undefined") {
        const current = window.location.pathname;
        // Không redirect nếu đã ở trang login/register
        if (!current.startsWith("/login") && !current.startsWith("/register")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;

