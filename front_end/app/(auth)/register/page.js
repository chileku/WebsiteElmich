"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import accountService from "@/service/account";
import { toast } from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    FullName: "",
    Username: "",
    Phone: "",
    Email: "",
    Password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Kiểm tra cơ bản
    if (!formData.FullName || !formData.Username || !formData.Email || !formData.Password) {
      setError("Vui lòng điền đầy đủ các thông tin bắt buộc.");
      return;
    }

    setLoading(true);
    try {
      const response = await accountService.create(formData);
      if (response.data.success) {
        toast.success("Đăng ký tài khoản thành công!");
        router.push("/login");
      } else {
        setError(response.data.message || "Đăng ký thất bại.");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/bg_custom.webp')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-md bg-black/40 backdrop-blur-xl 
                      rounded-3xl p-8 text-white shadow-2xl"
      >
        {/* Title */}
        <h2 className="text-3xl font-semibold text-center mb-6">
          Đăng ký tài khoản
        </h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-xl mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Họ tên */}
          <input
            type="text"
            name="FullName"
            placeholder="Họ tên"
            value={formData.FullName}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-full 
                       bg-white/20 placeholder-white/70 
                       focus:outline-none focus:ring-2 focus:ring-white"
            required
          />

          {/* Username */}
          <input
            type="text"
            name="Username"
            placeholder="Tên đăng nhập"
            value={formData.Username}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-full 
                       bg-white/20 placeholder-white/70 
                       focus:outline-none focus:ring-2 focus:ring-white"
            required
          />

          {/* Số điện thoại */}
          <input
            type="tel"
            name="Phone"
            placeholder="Số điện thoại"
            value={formData.Phone}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-full 
                       bg-white/20 placeholder-white/70 
                       focus:outline-none focus:ring-2 focus:ring-white"
          />

          {/* Email */}
          <input
            type="email"
            name="Email"
            placeholder="E-mail"
            value={formData.Email}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-full 
                       bg-white/20 placeholder-white/70 
                       focus:outline-none focus:ring-2 focus:ring-white"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="Password"
            placeholder="Mật khẩu"
            value={formData.Password}
            onChange={handleChange}
            className="w-full mb-2 px-5 py-3 rounded-full 
                       bg-white/20 placeholder-white/70 
                       focus:outline-none focus:ring-2 focus:ring-white"
            required
          />

          {/* Button register */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ED2124] hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed
                             py-3 rounded-full font-semibold 
                             transition duration-300"
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/40"></div>
          <span className="px-3 text-sm text-white/80">Hoặc đăng nhập qua</span>
          <div className="flex-1 h-px bg-white/40"></div>
        </div>

        {/* Social */}
        <div className="flex gap-4 mb-6">
          <button
            className="flex-1 bg-blue-600 hover:bg-blue-700 
                             py-2 rounded-md transition"
          >
            Facebook
          </button>

          <button
            className="flex-1 bg-red-500 hover:bg-red-600 
                             py-2 rounded-md transition"
          >
            Google
          </button>
        </div>

        {/* Login button */}
        <Link href="/login">
          <button
            className="w-full bg-white/20 hover:bg-white/30 
                           py-3 rounded-full font-medium mb-3 transition"
          >
            Đã có tài khoản? Đăng nhập
          </button>
        </Link>

        <Link
          href="/"
          className="w-full block text-center bg-white/10 hover:bg-white/20 
             py-3 rounded-full font-medium transition"
        >
          Quay về trang chủ
        </Link>
      </div>
    </div>
  );
}
