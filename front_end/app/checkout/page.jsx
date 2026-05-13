"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/service/axiosClient";
import authService from "@/service/auth";
import { useCartStore } from "@/store/cartstore";
import { getUserFromToken } from "@/app/lib/auth";

export default function CheckoutPage() {
  const router = useRouter();
  const [payment, setPayment] = useState("cod");
  const [contact, setContact] = useState({
    email: "",
    fullName: "",
    phone: "",
    address: "",
    note: "",
  });
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [provinceCode, setProvinceCode] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [wardCode, setWardCode] = useState("");
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingWards, setIsLoadingWards] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [accountId, setAccountId] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const locationApiBase = useMemo(
    () => process.env.NEXT_PUBLIC_VN_LOCATION_API || "https://provinces.open-api.vn/api/v1",
    [],
  );

  const total = cart.reduce(
    (s, i) =>
      s +
      (Number(i.finalPrice) || Number(i.Price) || 0) *
        (Number(i.Quantity) || 0),
    0,
  );

  const totalItems = cart.reduce((s, i) => s + (Number(i.Quantity) || 0), 0);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const user = getUserFromToken(token);

      if (!user?.id) {
        router.replace("/login?redirect=/checkout");
        return;
      }

      setAccountId(user.id);
    } catch {
      router.replace("/login?redirect=/checkout");
      return;
    } finally {
      setIsCheckingAuth(false);
    }
  }, [router]);

  useEffect(() => {
    const loadProvinces = async () => {
      try {
        setIsLoadingProvinces(true);
        setLocationError("");

        const response = await fetch(`${locationApiBase}/p/`);
        if (!response.ok) throw new Error("Không thể tải danh sách tỉnh thành");

        const data = await response.json();
        setProvinces(Array.isArray(data) ? data : []);
      } catch (error) {
        setLocationError(error.message || "Lỗi tải tỉnh thành");
      } finally {
        setIsLoadingProvinces(false);
      }
    };

    loadProvinces();
  }, [locationApiBase]);

  useEffect(() => {
    if (!provinceCode) {
      setDistricts([]);
      setDistrictCode("");
      setWards([]);
      setWardCode("");
      return;
    }

    const loadDistricts = async () => {
      try {
        setIsLoadingDistricts(true);
        setLocationError("");
        setDistrictCode("");
        setWards([]);
        setWardCode("");

        const response = await fetch(`${locationApiBase}/p/${provinceCode}?depth=2`);
        if (!response.ok) throw new Error("Không thể tải quận huyện");

        const data = await response.json();
        setDistricts(Array.isArray(data?.districts) ? data.districts : []);
      } catch (error) {
        setLocationError(error.message || "Lỗi tải quận huyện");
      } finally {
        setIsLoadingDistricts(false);
      }
    };

    loadDistricts();
  }, [provinceCode, locationApiBase]);

  useEffect(() => {
    if (!districtCode) {
      setWards([]);
      setWardCode("");
      return;
    }

    const loadWards = async () => {
      try {
        setIsLoadingWards(true);
        setLocationError("");
        setWardCode("");

        const response = await fetch(`${locationApiBase}/d/${districtCode}?depth=2`);
        if (!response.ok) throw new Error("Không thể tải phường xã");

        const data = await response.json();
        setWards(Array.isArray(data?.wards) ? data.wards : []);
      } catch (error) {
        setLocationError(error.message || "Lỗi tải phường xã");
      } finally {
        setIsLoadingWards(false);
      }
    };

    loadWards();
  }, [districtCode, locationApiBase]);

  useEffect(() => {
    if (!accountId) return;

    const loadProfile = async () => {
      try {
        const response = await authService.getMe();
        const user = response?.data?.user || {};
        setContact((prev) => ({
          ...prev,
          fullName: prev.fullName || user.FullName || user.fullName || "",
          phone: prev.phone || user.Phone || user.phone || "",
          email: prev.email || user.Email || user.email || "",
        }));
      } catch {
        // Không chặn checkout nếu không lấy được profile
      }
    };

    loadProfile();
  }, [accountId]);

  const getSelectedLocationName = (list, code) => {
    const value = Number(code);
    return list.find((item) => Number(item.code) === value)?.name || "";
  };

  const [orderSuccess, setOrderSuccess] = useState(false);

  const handlePlaceOrder = async () => {
    if (isSubmitting || isCheckingAuth) return;

    setSubmitError("");
    setSubmitSuccess("");

    if (!accountId) {
      router.replace("/login?redirect=/checkout");
      return;
    }

    if (!cart.length) {
      setSubmitError("Giỏ hàng đang trống.");
      return;
    }

    if (
      !contact.email.trim() ||
      !contact.fullName.trim() ||
      !contact.phone.trim() ||
      !contact.address.trim() ||
      !provinceCode ||
      !districtCode ||
      !wardCode
    ) {
      setSubmitError("Vui lòng nhập đầy đủ thông tin nhận hàng (trừ ghi chú).");
      return;
    }

    const provinceName = getSelectedLocationName(provinces, provinceCode);
    const districtName = getSelectedLocationName(districts, districtCode);
    const wardName = getSelectedLocationName(wards, wardCode);
    const fullAddress = [
      contact.address.trim(),
      wardName,
      districtName,
      provinceName,
      contact.note.trim() ? `Ghi chú: ${contact.note.trim()}` : "",
    ]
      .filter(Boolean)
      .join(", ");

    const details = cart.map((item) => {
      const quantity = Number(item.Quantity) || 0;
      const unitPrice = Number(item.FinalPrice || item.finalPrice || item.Price) || 0;
      return {
        ProductID: item.ProductID,
        Quantity: quantity,
        UnitPrice: unitPrice,
        TotalPrice: unitPrice * quantity,
      };
    });

    const payload = {
      AccountID: accountId,
      TotalAmount: total,
      Address: fullAddress,
      PaymentMethod: payment === "vnpay" ? "VNPAY" : payment === "momo" ? "MoMo" : "COD",
      PaymentStatus: "Chưa thanh toán",
      Status: "pending",
      details,
    };

    try {
      setIsSubmitting(true);
      const response = await axiosClient.post("/salesinvoices", payload);

      if (payment === "momo") {
        try {
          const invData = response.data?.data || response.data || {};
          const orderId = invData.SalesInvoiceID || invData.salesInvoiceID || invData.id || invData.SalesInvoiceId;
          if (!orderId) throw new Error("Thanh toán thất bại: Không tìm thấy ID đơn hàng trong log trả về. Dữ liệu: " + JSON.stringify(response.data));
          
          const momoRes = await axiosClient.post("/payment/momo", {
            orderId: orderId.toString(),
            amount: total,
            orderInfo: `Thanh toan hoa don ${orderId} tai cua hang`
          });
          
          if (momoRes.data?.payUrl) {
            // Chưa xoá giỏ hàng ngay mà redirect qua MoMo 
            window.location.href = momoRes.data.payUrl;
            return;
          }
        } catch (momoErr) {
          const errMsg = momoErr.response?.data?.message || momoErr.message || "Lỗi không xác định";
          setSubmitError(`Lỗi khởi tạo thanh toán MoMo: ${errMsg}. Đơn hàng đã được lưu.`);
          setIsSubmitting(false);
          return;
        }
      }

      // Xóa giỏ hàng (Áp dụng cho COD/VNPAY)
      clearCart();

      // Hiện overlay thành công rồi redirect về trang chủ sau 2.5 giây
      setOrderSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 2500);
    } catch (error) {
      setSubmitError(error?.response?.data?.error || error?.response?.data?.message || "Không thể tạo đơn hàng. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="w-full flex justify-center">
      {/* ===== Success Overlay ===== */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-4 max-w-sm mx-4 text-center animate-[fadeInScale_0.4s_ease]">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Đặt hàng thành công!</h2>
            <p className="text-gray-500 text-sm">
              Đơn hàng của bạn đã được tiếp nhận và đang chờ xử lý.
              <br />Chúng tôi sẽ liên hệ xác nhận sớm nhất.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin" />
              Đang chuyển về trang chủ...
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* LEFT */}
        <div className="Main w-[840px] p-3 border-r border-[#D9D9D9] pr-12">
          <div className="logo w-full">
            <img src="/checkout_logo.webp" className="h-[88px]" alt="" />
          </div>

          <div className="content grid grid-cols-2 gap-7">
            {/* LEFT FORM */}
            <div>
              <h2 className="text-xl font-semibold mt-[21px]">
                Thông tin nhận đơn hàng
              </h2>

              <input
                type="email"
                value={contact.email}
                onChange={(e) =>
                  setContact((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full m-[6px] p-3 border border-[#D9D9D9] rounded-sm"
                placeholder="Email"
              />
              <input
                type="text"
                value={contact.fullName}
                onChange={(e) =>
                  setContact((prev) => ({ ...prev, fullName: e.target.value }))
                }
                className="w-full m-[6px] p-3 border border-[#D9D9D9] rounded-sm"
                placeholder="Họ và Tên"
              />
              <input
                type="tel"
                value={contact.phone}
                onChange={(e) =>
                  setContact((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="w-full m-[6px] p-3 border border-[#D9D9D9] rounded-sm"
                placeholder="Số điện thoại"
              />
              <input
                type="text"
                value={contact.address}
                onChange={(e) =>
                  setContact((prev) => ({ ...prev, address: e.target.value }))
                }
                className="w-full m-[6px] p-3 border border-[#D9D9D9] rounded-sm"
                placeholder="Địa chỉ"
              />

              <select
                value={provinceCode}
                onChange={(e) => setProvinceCode(e.target.value)}
                disabled={isLoadingProvinces}
                className="w-full m-[6px] p-3 border border-[#D9D9D9] rounded-sm bg-white"
              >
                <option value="">
                  {isLoadingProvinces ? "Đang tải tỉnh thành..." : "Chọn Tỉnh thành"}
                </option>
                {provinces.map((province) => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
              </select>

              <select
                value={districtCode}
                onChange={(e) => setDistrictCode(e.target.value)}
                disabled={!provinceCode || isLoadingDistricts}
                className="w-full m-[6px] p-3 border border-[#D9D9D9] rounded-sm bg-white"
              >
                <option value="">
                  {!provinceCode
                    ? "Chọn tỉnh thành trước"
                    : isLoadingDistricts
                      ? "Đang tải quận huyện..."
                      : "Chọn Quận huyện"}
                </option>
                {districts.map((district) => (
                  <option key={district.code} value={district.code}>
                    {district.name}
                  </option>
                ))}
              </select>

              <select
                value={wardCode}
                onChange={(e) => setWardCode(e.target.value)}
                disabled={!districtCode || isLoadingWards}
                className="w-full m-[6px] p-3 border border-[#D9D9D9] rounded-sm bg-white"
              >
                <option value="">
                  {!districtCode
                    ? "Chọn quận huyện trước"
                    : isLoadingWards
                      ? "Đang tải phường xã..."
                      : "Chọn Phường xã"}
                </option>
                {wards.map((ward) => (
                  <option key={ward.code} value={ward.code}>
                    {ward.name}
                  </option>
                ))}
              </select>

              {locationError ? (
                <p className="m-[6px] text-sm text-red-500">{locationError}</p>
              ) : null}

              <textarea
                value={contact.note}
                onChange={(e) =>
                  setContact((prev) => ({ ...prev, note: e.target.value }))
                }
                className="w-full m-[6px] p-3 border border-[#D9D9D9] rounded-sm"
                placeholder="Ghi chú"
              />
              {submitError ? (
                <p className="m-[6px] text-sm text-red-500">{submitError}</p>
              ) : null}
              {submitSuccess ? (
                <p className="m-[6px] text-sm text-green-600">{submitSuccess}</p>
              ) : null}
            </div>

            {/* PAYMENT */}
            <div>
              <h2 className="text-xl font-semibold mt-[21px]">Vận chuyển</h2>

              <div className="bg-[#D1ECF1] w-full m-[6px] p-3 border border-[#D9D9D9] rounded-sm text-[#545454]">
                Vui lòng nhập thông tin
              </div>

              <div className="bg-white rounded-xl shadow p-4">
                <h2 className="text-lg font-semibold mb-4">Thanh toán</h2>

                <div className="space-y-2">
                  {[
                    
                    {
                      value: "momo",
                      label: "Thanh toán qua ví MoMo",
                      img: "/download.png",
                    },

                    {
                      value: "cod",
                      label: "Nhận hàng thanh toán (COD)",
                    },
                  ].map((item) => (
                    <label
                      key={item.value}
                      className="flex items-center justify-between border border-[#D9D9D9] rounded-lg p-3 cursor-pointer hover:bg-gray-50 text-[#545454]"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          value={item.value}
                          checked={payment === item.value}
                          onChange={(e) => setPayment(e.target.value)}
                        />
                        <span>{item.label}</span>
                      </div>

                      {item.img ? (
                        <img src={item.img} className="h-6" />
                      ) : (
                        <span>💵</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="border-t border-[#D9D9D9] mt-6">
            <div className="flex justify-end gap-4 text-[14px] text-[#2A9DCC] pt-3">
              <p>Chính sách đổi trả và hoàn tiền</p>
              <p>Chính sách bảo mật</p>
              <p>Điều khoản sử dụng</p>
            </div>

            <p className="text-end text-[14px] mt-4 text-[#737373]">
              Liên hệ hỗ trợ đặt hàng:
              <span className="text-red-500 font-semibold"> 0901570440</span>
            </p>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="sidebar w-[409px] bg-[#FAFAFA] min-h-screen">
          <div className="py-5 px-7 text-[#333] text-[19px] font-semibold border-b border-[#D9D9D9]">
            <h2>Đơn hàng ({totalItems} sản phẩm)</h2>
          </div>

          <div className="p-6">
            {cart.map((item) => (
              <div
                key={item.ProductID}
                className="flex items-center justify-between border-b border-[#D9D9D9]  pb-4 mb-4"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={
                        item.ProductImages?.[0]
                          ? `http://localhost:5000/${item.ProductImages[0].ImagePath}`
                          : "/product-demo.png"
                      }
                      className="w-[50px] h-[50px] object-cover border border-[#D9D9D9]  rounded"
                    />

                    <span className="absolute -top-2 -right-2 bg-[#2A9DCC] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {item.Quantity}
                    </span>
                  </div>

                  <p className="text-sm text-[#333] w-[180px]">
                    {item.ProductName}
                  </p>
                </div>

                <p className="text-sm text-[#333]">
                  {Number(
                    item.FinalPrice || item.finalPrice || item.Price,
                  ).toLocaleString()}
                  ₫
                </p>
              </div>
            ))}

            {/* discount */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Nhập mã giảm giá"
                className="flex-1 p-3 border border-[#D9D9D9] rounded"
              />
              <button className="bg-[#2A9DCC] text-white px-4 rounded">
                Áp dụng
              </button>
            </div>

            {/* price */}
            <div className="text-sm text-[#555] space-y-2 border-b border-[#D9D9D9]  pb-4">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>{total.toLocaleString()}₫</span>
              </div>

              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span>-</span>
              </div>
            </div>

            {/* total */}
            <div className="flex justify-between items-center py-4">
              <span className="text-[16px] text-[#333] font-medium">
                Tổng cộng
              </span>
              <span className="text-[20px] text-[#2A9DCC] font-semibold">
                {total.toLocaleString()}₫
              </span>
            </div>

            {/* actions */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => router.push("/cart")}
                className="text-sm text-[#333] border border-[#CCCCCC] bg-[#F0F0F0] px-4 py-2 rounded hover:bg-gray-100"
              >
                ← Quay về giỏ hàng
              </button>

              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting || isCheckingAuth}
                className="bg-[#2A9DCC] text-white px-6 py-3 rounded font-semibold hover:bg-[#238bb5] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isCheckingAuth
                  ? "Đang kiểm tra đăng nhập..."
                  : isSubmitting
                    ? "ĐANG XỬ LÝ..."
                    : "ĐẶT HÀNG"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
