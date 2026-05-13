"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import authService from "@/service/auth";
import salesInvoiceService from "@/service/salesInvoice";
import { logoutClient } from "@/lib/auth-cookie";
import Link from "next/link";
import {
  User,
  Package,
  Lock,
  LogOut,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  CreditCard,
} from "lucide-react";

const TABS = [
  {
    id: "info",
    label: "Thông tin tài khoản",
    icon: <User className="w-4 h-4" />,
  },
  {
    id: "orders",
    label: "Lịch sử đơn hàng",
    icon: <Package className="w-4 h-4" />,
  },
  { id: "password", label: "Đổi mật khẩu", icon: <Lock className="w-4 h-4" /> },
];

const STATUS_MAP = {
  pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-700" },
  shipping: { label: "Đang giao", color: "bg-purple-100 text-purple-700" },
  done: { label: "Hoàn thành", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-600" },
};

const PAYMENT_STATUS_MAP = {
  "Chưa thanh toán":  { label: "Chưa thanh toán",  color: "bg-orange-100 text-orange-600", },
  "Đã thanh toán":    { label: "Đã thanh toán",    color: "bg-green-100 text-green-700",   },
  "Thanh toán thất bại": { label: "TT thất bại",  color: "bg-red-100 text-red-600",       },
};

export default function ProfilePage() {
  const router = useRouter();
  const [tab, setTab] = useState("info");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Info form
  const [form, setForm] = useState({ FullName: "", Phone: "", Email: "" });
  const [infoMsg, setInfoMsg] = useState(null);
  const [infoSaving, setInfoSaving] = useState(false);

  // Orders
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderPage, setOrderPage] = useState(1);
  const [orderPagination, setOrderPagination] = useState(null);

  // Password
  const [pwForm, setPwForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwMsg, setPwMsg] = useState(null);
  const [pwSaving, setPwSaving] = useState(false);
  const [showPw, setShowPw] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  // Load user
  useEffect(() => {
    setLoading(true);
    authService
      .getInfo()
      .then((res) => {
        const u = res.data?.user;
        setUser(u);
        setForm({
          FullName: u?.FullName || "",
          Phone: u?.Phone || "",
          Email: u?.Email || "",
        });
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, []);

  // Load orders when tab changes
  useEffect(() => {
    if (tab !== "orders") return;
    setOrdersLoading(true);
    salesInvoiceService
      .getMyOrders({ page: orderPage, limit: 3 })
      .then((res) => {
        setOrders(res.data?.data || []);
        setOrderPagination(res.data?.pagination || null);
      })
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [tab, orderPage]);

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setInfoSaving(true);
    setInfoMsg(null);
    try {
      const res = await authService.updateProfile(form);
      setUser(res.data?.user);
      setInfoMsg({ type: "success", text: "Cập nhật thành công!" });
    } catch (err) {
      setInfoMsg({
        type: "error",
        text: err.response?.data?.message || "Có lỗi xảy ra",
      });
    } finally {
      setInfoSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg({ type: "error", text: "Mật khẩu mới không khớp" });
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwMsg({ type: "error", text: "Mật khẩu mới phải tối thiểu 6 ký tự" });
      return;
    }
    setPwSaving(true);
    setPwMsg(null);
    try {
      await authService.changePassword({
        oldPassword: pwForm.oldPassword,
        newPassword: pwForm.newPassword,
      });
      setPwMsg({ type: "success", text: "Đổi mật khẩu thành công!" });
      setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPwMsg({
        type: "error",
        text: err.response?.data?.message || "Có lỗi xảy ra",
      });
    } finally {
      setPwSaving(false);
    }
  };

  const handleLogout = async () => {
    await logoutClient(router, { redirectTo: "/" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Greeting banner */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl p-6 mb-6 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
              {(user?.FullName || user?.Username || "U")[0].toUpperCase()}
            </div>
            <div>
              <p className="text-white/70 text-sm">Xin chào,</p>
              <p className="text-lg font-bold">
                {user?.FullName || user?.Username}
              </p>
              <p className="text-white/70 text-xs">{user?.Email}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium transition"
            >
              <ArrowLeft className="w-4 h-4" /> Về trang chủ
            </Link>
          </div>
        </div>

        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Sidebar */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <ul>
                {TABS.map((t, i) => (
                  <li key={t.id}>
                    <button
                      onClick={() => setTab(t.id)}
                      className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-all ${
                        tab === t.id
                          ? "bg-red-50 text-red-600 border-r-2 border-red-600"
                          : "text-gray-700 hover:bg-gray-50"
                      } ${i !== 0 ? "border-t border-gray-100" : ""}`}
                    >
                      <span>{t.icon}</span>
                      {t.label}
                    </button>
                  </li>
                ))}
                <li className="border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all group"
                  >
                    <span className="text-gray-400 group-hover:text-red-600 transition-colors">
                      <LogOut className="w-4 h-4" />
                    </span>
                    Đăng xuất
                  </button>
                </li>
              </ul>
            </div>
          </aside>

          {/* Main panel */}
          <div className="flex-1 min-w-0">
            {/* TAB: Thông tin cá nhân */}
            {tab === "info" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-red-600">●</span> Thông tin cá nhân
                </h2>
                <form onSubmit={handleSaveInfo} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      label="Họ và tên"
                      value={form.FullName}
                      onChange={(v) => setForm((f) => ({ ...f, FullName: v }))}
                      placeholder="Nhập họ và tên"
                    />
                    <FormField
                      label="Số điện thoại"
                      value={form.Phone}
                      onChange={(v) => setForm((f) => ({ ...f, Phone: v }))}
                      placeholder="Nhập số điện thoại"
                      type="tel"
                    />
                    <FormField
                      label="Email"
                      value={form.Email}
                      onChange={(v) => setForm((f) => ({ ...f, Email: v }))}
                      placeholder="Nhập email"
                      type="email"
                      className="md:col-span-2"
                    />
                  </div>

                  <div className="border-t border-gray-100 pt-4 flex items-center gap-4">
                    <button
                      type="submit"
                      disabled={infoSaving}
                      className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition disabled:opacity-60"
                    >
                      {infoSaving ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                    {infoMsg && (
                      <p
                        className={`text-sm font-medium flex items-center ${infoMsg.type === "success" ? "text-green-600" : "text-red-600"}`}
                      >
                        {infoMsg.type === "success" ? (
                          <CheckCircle2 className="w-4 h-4 mr-1.5 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 mr-1.5 flex-shrink-0" />
                        )}
                        {infoMsg.text}
                      </p>
                    )}
                  </div>
                </form>

                {/* Readonly info */}
                <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Tên đăng nhập</p>
                    <p className="font-medium text-gray-900">
                      {user?.Username}
                    </p>
                  </div>
                  {/* <div>
                    <p className="text-gray-500 mb-1">Vai trò</p>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                        user?.Role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user?.Role === "admin" ? "Quản trị viên" : "Khách hàng"}
                    </span>
                  </div> */}
                </div>
              </div>
            )}

            {/* TAB: Đơn hàng */}
            {tab === "orders" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-red-600">●</span> Lịch sử đơn hàng
                </h2>
                {ordersLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-20 bg-gray-100 rounded-xl animate-pulse"
                      />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="flex flex-col items-center py-16 text-gray-400">
                    <span className="text-gray-300 mb-4 bg-gray-50 p-4 rounded-full">
                      <Package className="w-12 h-12" />
                    </span>
                    <p className="font-medium text-gray-600">
                      Chưa có đơn hàng nào
                    </p>
                    <Link
                      href="/"
                      className="mt-4 px-5 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition"
                    >
                      Mua sắm ngay
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {orders.map((order) => {
                        const status = STATUS_MAP[order.Status] || {
                          label: "Đã đặt",
                          color: "bg-gray-100 text-gray-600",
                        };
                        const payStatus = PAYMENT_STATUS_MAP[order.PaymentStatus] || {
                          label: order.PaymentStatus || "Chưa thanh toán",
                          color: "bg-orange-100 text-orange-600",
                          icon: "💳",
                        };
                        const details = order.SalesInvoiceDetails || [];
                        const account = order.Account;
                        return (
                          <div
                            key={order.SalesInvoiceID}
                            className="border border-gray-200 rounded-xl overflow-hidden hover:border-red-200 transition-all shadow-sm"
                          >
                            {/* Header */}
                            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b border-gray-100">
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-gray-800 text-sm">
                                  Đơn #{order.SalesInvoiceID}
                                </span>
                                <span className="text-gray-400 text-xs">
                                  {new Date(order.EntryDate).toLocaleDateString(
                                    "vi-VN",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}
                                >
                                  {status.label}
                                </span>
                                <span
                                  className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${payStatus.color}`}
                                >
                                  <span>{payStatus.icon}</span>
                                  {payStatus.label}
                                </span>
                              </div>
                            </div>

                            <div className="p-4 grid md:grid-cols-2 gap-4">
                              {/* Thông tin khách hàng */}
                              <div className="space-y-1.5 text-sm">
                                <p className="font-semibold text-gray-700 mb-3 text-xs uppercase tracking-wide flex items-center gap-1.5">
                                  <User className="w-4 h-4 text-gray-400" />{" "}
                                  Thông tin khách hàng
                                </p>
                                <div className="flex gap-2">
                                  <span className="text-gray-500 w-16 flex-shrink-0">
                                    Họ tên:
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    {account?.FullName || "—"}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="text-gray-500 w-16 flex-shrink-0">
                                    SĐT:
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    {account?.Phone || "—"}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="text-gray-500 w-16 flex-shrink-0">
                                    Email:
                                  </span>
                                  <span className="font-medium text-gray-900 break-all">
                                    {account?.Email || "—"}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="text-gray-500 w-16 flex-shrink-0">
                                    Địa chỉ:
                                  </span>
                                  <span className="text-gray-700 text-xs leading-relaxed">
                                    {order.Address || "—"}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="text-gray-500 w-16 flex-shrink-0">
                                    TT:
                                  </span>
                                  <span className="font-medium text-gray-900 flex items-center gap-1.5">
                                    <CreditCard className="w-4 h-4 text-gray-400" />{" "}
                                    {order.PaymentMethod || "—"}
                                  </span>
                                </div>
                              </div>

                              {/* Danh sách sản phẩm */}
                              <div>
                                <p className="font-semibold text-gray-700 mb-3 text-xs uppercase tracking-wide flex items-center gap-1.5">
                                  <Package className="w-4 h-4 text-gray-400" />{" "}
                                  Sản phẩm ({details.length})
                                </p>
                                {details.length === 0 ? (
                                  <p className="text-xs text-gray-400">
                                    Không có chi tiết
                                  </p>
                                ) : (
                                  <div className="space-y-1.5 max-h-32 overflow-auto pr-1">
                                    {details.map((d) => (
                                      <div
                                        key={d.DetailID}
                                        className="flex justify-between items-center text-xs bg-gray-50 rounded-lg px-2.5 py-1.5"
                                      >
                                        <span className="text-gray-700 truncate flex-1 mr-2">
                                          {d.Product?.ProductName ||
                                            `SP #${d.ProductID}`}
                                          <span className="text-gray-400 ml-1">
                                            ×{d.Quantity}
                                          </span>
                                        </span>
                                        <span className="font-semibold text-gray-800 flex-shrink-0">
                                          {Number(
                                            d.TotalPrice || 0,
                                          ).toLocaleString("vi-VN")}
                                          đ
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Footer tổng tiền */}
                            <div className="flex justify-end items-center px-4 py-3 bg-gray-50 border-t border-gray-100">
                              <span className="text-sm text-gray-500 mr-3">
                                Tổng cộng:
                              </span>
                              <span className="font-bold text-red-600 text-base">
                                {Number(order.TotalAmount || 0).toLocaleString(
                                  "vi-VN",
                                )}
                                đ
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination */}
                    {orderPagination && orderPagination.totalPages > 1 && (
                      <div className="flex justify-center gap-2 mt-4">
                        {Array.from({ length: orderPagination.totalPages }).map(
                          (_, i) => (
                            <button
                              key={i}
                              onClick={() => setOrderPage(i + 1)}
                              className={`w-8 h-8 rounded-lg text-sm border transition ${
                                orderPage === i + 1
                                  ? "bg-red-600 text-white border-red-600"
                                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              {i + 1}
                            </button>
                          ),
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* TAB: Đổi mật khẩu */}
            {tab === "password" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-red-600">●</span> Đổi mật khẩu
                </h2>
                <form
                  onSubmit={handleChangePassword}
                  className="space-y-4 max-w-md"
                >
                  <PasswordField
                    label="Mật khẩu hiện tại"
                    value={pwForm.oldPassword}
                    onChange={(v) =>
                      setPwForm((f) => ({ ...f, oldPassword: v }))
                    }
                    show={showPw.old}
                    onToggle={() => setShowPw((s) => ({ ...s, old: !s.old }))}
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  <PasswordField
                    label="Mật khẩu mới"
                    value={pwForm.newPassword}
                    onChange={(v) =>
                      setPwForm((f) => ({ ...f, newPassword: v }))
                    }
                    show={showPw.new}
                    onToggle={() => setShowPw((s) => ({ ...s, new: !s.new }))}
                    placeholder="Tối thiểu 6 ký tự"
                  />
                  <PasswordField
                    label="Xác nhận mật khẩu mới"
                    value={pwForm.confirmPassword}
                    onChange={(v) =>
                      setPwForm((f) => ({ ...f, confirmPassword: v }))
                    }
                    show={showPw.confirm}
                    onToggle={() =>
                      setShowPw((s) => ({ ...s, confirm: !s.confirm }))
                    }
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <div className="pt-2 flex items-center gap-4">
                    <button
                      type="submit"
                      disabled={pwSaving}
                      className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition disabled:opacity-60"
                    >
                      {pwSaving ? "Đang lưu..." : "Đổi mật khẩu"}
                    </button>
                    {pwMsg && (
                      <p
                        className={`text-sm font-medium flex items-center ${pwMsg.type === "success" ? "text-green-600" : "text-red-600"}`}
                      >
                        {pwMsg.type === "success" ? (
                          <CheckCircle2 className="w-4 h-4 mr-1.5 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 mr-1.5 flex-shrink-0" />
                        )}
                        {pwMsg.text}
                      </p>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Sub-components ===== */
function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition"
      />
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
  placeholder,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
