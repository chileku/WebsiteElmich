"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartstore";
import axiosClient from "@/service/axiosClient";
import Link from "next/link";

function PaymentResultInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("loading"); // loading, success, failed
  const [message, setMessage] = useState("");
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const partnerCode = searchParams.get("partnerCode");
        const orderId = searchParams.get("orderId");
        const requestId = searchParams.get("requestId");
        const amount = searchParams.get("amount");
        const orderInfo = searchParams.get("orderInfo");
        const orderType = searchParams.get("orderType");
        const transId = searchParams.get("transId");
        const resultCode = searchParams.get("resultCode");
        const momoMessage = searchParams.get("message");
        const payType = searchParams.get("payType");
        const responseTime = searchParams.get("responseTime");
        const extraData = searchParams.get("extraData");
        const signature = searchParams.get("signature");

        if (!signature || !resultCode) {
          setStatus("failed");
          setMessage("Dữ liệu trả về không hợp lệ.");
          return;
        }

        const payload = {
          partnerCode, orderId, requestId, amount, orderInfo, orderType,
          transId, resultCode, message: momoMessage, payType, responseTime, extraData, signature
        };

        const res = await axiosClient.post("/payment/verify", payload);
        
        if (resultCode === "0") {
          setStatus("success");
          clearCart();
          setMessage("Thanh toán thành công!");
        } else {
          setStatus("failed");
          setMessage(res.data?.message || momoMessage || "Thanh toán thất bại.");
        }

      } catch (err) {
        setStatus("failed");
        setMessage("Lỗi xác minh thanh toán.");
      }
    };

    verifyPayment();
  }, [searchParams, clearCart]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4">
             <div className="w-10 h-10 border-4 border-gray-200 border-t-[#2A9DCC] rounded-full animate-spin"></div>
             <p className="text-gray-600 font-medium">Đang xác minh thanh toán...</p>
          </div>
        )}
        
        {status === "success" && (
           <div className="flex flex-col items-center gap-4">
             <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
               <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
               </svg>
             </div>
             <h2 className="text-2xl font-bold text-gray-900">Thanh toán thành công</h2>
             <p className="text-gray-500 text-sm mt-2">{message}</p>
             <Link href="/" className="mt-6 w-full inline-block bg-[#2A9DCC] hover:bg-[#238bb5] text-white font-semibold py-3 px-4 rounded-xl transition">
               Quay về trang chủ
             </Link>
           </div>
        )}

        {status === "failed" && (
           <div className="flex flex-col items-center gap-4">
             <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
               <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
               </svg>
             </div>
             <h2 className="text-2xl font-bold text-gray-900">Thanh toán thất bại</h2>
             <p className="text-gray-500 text-sm mt-2">{message}</p>
             <Link href="/checkout" className="mt-6 w-full inline-block bg-white border border-[#2A9DCC] text-[#2A9DCC] hover:bg-gray-50 font-semibold py-3 px-4 rounded-xl transition">
               Quay lại giỏ hàng
             </Link>
           </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentResult() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Đang tải...</div>}>
      <PaymentResultInner />
    </Suspense>
  )
}
