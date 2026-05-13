"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import authService from "@/service/auth";
import { setAuthCookie } from "@/lib/auth-cookie";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const u = username.trim();
    if (!u || !password) {
      setError("Vui lòng nhập tên đăng nhập và mật khẩu.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await authService.login({ username: u, password });
      if (!data?.success || !data.token) {
        setError(data?.message || "Đăng nhập thất bại.");
        return;
      }

      localStorage.setItem("token", data.token);
      setAuthCookie(data.token);

      const role = data.user?.Role ?? data.user?.role;
      if (role === 1) {
        router.push("/admin");
      } else {
        router.push("/");
      }
      router.refresh();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Không thể kết nối máy chủ. Hãy thử lại.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/bg_custom.webp')" }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div
        className="relative z-10 w-full max-w-md bg-black/40 backdrop-blur-xl 
                      rounded-3xl p-8 text-white shadow-2xl"
      >
        <h2 className="text-3xl font-semibold text-center mb-6">Đăng nhập</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? (
            <p className="text-sm text-red-300 bg-red-500/20 rounded-lg px-4 py-2">
              {error}
            </p>
          ) : null}

          <input
            type="text"
            name="username"
            autoComplete="username"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-5 py-3 rounded-full 
                     bg-white/20 placeholder-white/70 
                     focus:outline-none focus:ring-2 focus:ring-white"
          />

          <input
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-3 rounded-full 
                     bg-white/20 placeholder-white/70 
                     focus:outline-none focus:ring-2 focus:ring-white"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ED2124] hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed
                           py-3 rounded-full font-semibold 
                           transition duration-300"
          >
            {loading ? "Đang đăng nhập…" : "Đăng nhập"}
          </button>
        </form>

        <p className="text-center text-sm mt-3 text-white/80 cursor-pointer hover:underline">
          Quên mật khẩu?
        </p>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/40"></div>
          <span className="px-3 text-sm text-white/80">Hoặc đăng nhập qua</span>
          <div className="flex-1 h-px bg-white/40"></div>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            type="button"
            className="flex-1 bg-blue-600 hover:bg-blue-700 
                             py-2 rounded-md transition"
          >
            Facebook
          </button>

          <button
            type="button"
            className="flex-1 bg-red-500 hover:bg-red-600 
                             py-2 rounded-md transition"
          >
            Google
          </button>
        </div>

        <h3 className="text-2xl font-semibold text-center mb-4">Đăng ký</h3>

        <div className="border border-white/50 rounded-lg p-4 text-sm text-center text-white/80 mb-4">
          Tạo tài khoản để quản lý đơn hàng, và các thông tin thanh toán, gửi
          hàng một cách đơn giản hơn.
        </div>

        <Link
          href="/register"
          className="w-full block text-center bg-white/20 hover:bg-white/30 
                           py-3 rounded-full font-medium mb-3 transition"
        >
          Tạo tài khoản
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
