"use client";

import { useEffect, useState } from "react";
import DataTable from "@/component/admin/table";
import salesInvoiceService from "@/service/salesInvoice";
import { Eye, Pencil } from "lucide-react";

const STATUS_MAP = {
  pending:   { label: "Chờ xác nhận", color: "bg-yellow-500/20 text-yellow-500" },
  confirmed: { label: "Đã xác nhận",   color: "bg-blue-500/20 text-blue-500" },
  shipping:  { label: "Đang giao",       color: "bg-purple-500/20 text-purple-500" },
  done:      { label: "Hoàn thành",      color: "bg-green-500/20 text-green-500" },
  cancelled: { label: "Đã hủy",         color: "bg-red-500/20 text-red-500" },
};

const PAYMENT_STATUS_MAP = {
  "Chưa thanh toán":     { label: "Chưa TT",     color: "bg-orange-500/20 text-orange-400" },
  "Đã thanh toán":       { label: "Đã TT",         color: "bg-green-500/20 text-green-400"  },
  "Thanh toán thất bại": { label: "TT thất bại", color: "bg-red-500/20 text-red-400"    },
};

export default function AdminSalesInvoice() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // PAGINATION & SEARCH
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const limit = 10;

  // MODAL STATES
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [newPaymentStatus, setNewPaymentStatus] = useState("");

  const fetchData = async (page = 1, searchKw = keyword) => {
    try {
      setLoading(true);
      const res = await salesInvoiceService.getAll({ 
        page, 
        limit, 
        keyword: searchKw,
        status: filterStatus,
        paymentMethod: filterPaymentMethod,
        paymentStatus: filterPaymentStatus,
        startDate,
        endDate
      });
      setInvoices(res.data?.data || []);
      setCurrentPage(res.data?.pagination?.currentPage || 1);
      setTotalPages(res.data?.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, keyword);
  }, [keyword, filterStatus, filterPaymentMethod, filterPaymentStatus, startDate, endDate]);

  const handleUpdateStatus = async () => {
    try {
      await salesInvoiceService.update(selectedInvoice.SalesInvoiceID, {
        Status: newStatus,
        PaymentStatus: newPaymentStatus,
      });
      await fetchData(currentPage, keyword);
      setIsEditing(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const columns = [
    { label: "Mã ĐH", render: (row) => `#${row.SalesInvoiceID}` },
    {
      label: "Khách hàng",
      render: (row) => (
        <div>
          <p className="font-semibold">{row.Account?.FullName || "Khách"}</p>
          <p className="text-xs text-gray-500">{row.Account?.Email}</p>
          <p className="text-xs text-gray-500">{row.Account?.Phone}</p>
        </div>
      ),
    },
    {
      label: "Ngày Đặt",
      render: (row) => new Date(row.EntryDate).toLocaleDateString("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
      }),
    },
    {
      label: "Hình thức",
      render: (row) => <span className="font-medium">{row.PaymentMethod || "COD"}</span>,
    },
    {
      label: "Trạng thái",
      render: (row) => {
        const s = STATUS_MAP[row.Status] || { label: row.Status || "Mới", color: "bg-gray-500/20 text-gray-300" };
        return (
          <span className={`px-2 py-1 rounded text-xs font-semibold ${s.color}`}>
            {s.label}
          </span>
        );
      },
    },
    {
      label: "TT Thanh toán",
      render: (row) => {
        const ps = PAYMENT_STATUS_MAP[row.PaymentStatus] || { label: row.PaymentStatus || "Chưa TT", color: "bg-orange-500/20 text-orange-400" };
        return (
          <span className={`px-2 py-1 rounded text-xs font-semibold ${ps.color}`}>
            {ps.label}
          </span>
        );
      },
    },
    {
      label: "Tổng Tiền",
      render: (row) => (
        <span className="font-bold text-red-500">
          {Number(row.TotalAmount || 0).toLocaleString("vi-VN")}đ
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: "View",
      icon: Eye,
      className: "text-blue-500",
      onClick: (row) => {
        setSelectedInvoice(row);
        setIsViewing(true);
      },
    },
    {
      label: "Edit Status",
      icon: Pencil,
      className: "text-yellow-500",
      onClick: (row) => {
        setSelectedInvoice(row);
        setNewStatus(row.Status || "pending");
        setNewPaymentStatus(row.PaymentStatus || "Chưa thanh toán");
        setIsEditing(true);
      },
    },
  ];

  if (loading && invoices.length === 0) return <div className="text-gray-300">Loading...</div>;

  return (
    <div>
      {/* HEADER & CUSTOM SEARCH (Since standard DataTable search isn't wired) */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Quản lý Đơn Hàng</h1>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4 mb-6 bg-[#1E1E1E] p-4 rounded-xl border border-gray-800">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs text-gray-500 mb-1 uppercase font-semibold">Tìm kiếm</label>
          <input
            type="text"
            placeholder="Tìm tên, SĐT khách hàng..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full bg-[#2A2A2A] text-gray-200 px-4 py-2 rounded-lg border border-gray-700 outline-none focus:border-red-500 transition"
          />
        </div>

        {/* Status */}
        <div className="w-[160px]">
          <label className="block text-xs text-gray-500 mb-1 uppercase font-semibold">Trạng thái</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-[#2A2A2A] text-gray-200 px-3 py-2 rounded-lg border border-gray-700 outline-none focus:border-red-500"
          >
            <option value="">Tất cả</option>
            {Object.entries(STATUS_MAP).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>

        {/* Payment Method */}
        <div className="w-[160px]">
          <label className="block text-xs text-gray-500 mb-1 uppercase font-semibold">Hình thức</label>
          <select
            value={filterPaymentMethod}
            onChange={(e) => setFilterPaymentMethod(e.target.value)}
            className="w-full bg-[#2A2A2A] text-gray-200 px-3 py-2 rounded-lg border border-gray-700 outline-none focus:border-red-500"
          >
            <option value="">Tất cả</option>
            <option value="COD">COD</option>
            <option value="VNPAY">VNPAY</option>
            <option value="MOMO">MOMO</option>
          </select>
        </div>

        {/* Payment Status */}
        <div className="w-[160px]">
          <label className="block text-xs text-gray-500 mb-1 uppercase font-semibold">TT Thanh toán</label>
          <select
            value={filterPaymentStatus}
            onChange={(e) => setFilterPaymentStatus(e.target.value)}
            className="w-full bg-[#2A2A2A] text-gray-200 px-3 py-2 rounded-lg border border-gray-700 outline-none focus:border-red-500"
          >
            <option value="">Tất cả</option>
            {Object.entries(PAYMENT_STATUS_MAP).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div className="flex gap-2 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1 uppercase font-semibold">Từ ngày</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-[#2A2A2A] text-gray-200 px-3 py-1.5 rounded-lg border border-gray-700 outline-none focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1 uppercase font-semibold">Đến ngày</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-[#2A2A2A] text-gray-200 px-3 py-1.5 rounded-lg border border-gray-700 outline-none focus:border-red-500"
            />
          </div>
          <button 
            onClick={() => {
              setKeyword("");
              setFilterStatus("");
              setFilterPaymentMethod("");
              setFilterPaymentStatus("");
              setStartDate("");
              setEndDate("");
            }}
            className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition text-sm"
          >
            Reset
          </button>
        </div>
      </div>

      <DataTable
        title="Danh sách đơn hàng"
        columns={columns}
        data={invoices}
        actions={actions}
      />

      {/* PAGINATION */}
      {totalPages > 0 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => fetchData(currentPage - 1, keyword)}
            className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
          >
            ← Trước
          </button>

          {[...Array(totalPages)].map((_, idx) => {
            const page = idx + 1;
            return (
              <button
                key={page}
                onClick={() => fetchData(page, keyword)}
                className={`px-3 py-1 rounded ${page === currentPage ? "bg-red-600 text-white" : "bg-gray-600 text-white"
                  }`}
              >
                {page}
              </button>
            );
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => fetchData(currentPage + 1, keyword)}
            className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
          >
            Sau →
          </button>
        </div>
      )}

      {/* EDIT STATUS MODAL */}
      {isEditing && selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1E1E1E] text-gray-300 p-6 rounded-xl w-[400px] shadow-lg border border-gray-800">
            <h2 className="text-lg font-bold mb-4 text-white">Cập nhật Trạng thái Đơn #{selectedInvoice.SalesInvoiceID}</h2>

            <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Trạng thái đơn hàng</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full bg-[#2A2A2A] border border-gray-700 p-2 mb-4 rounded text-gray-200 outline-none"
            >
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="shipping">Đang giao</option>
              <option value="done">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>

            <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Trạng thái thanh toán</label>
            <select
              value={newPaymentStatus}
              onChange={(e) => setNewPaymentStatus(e.target.value)}
              className="w-full bg-[#2A2A2A] border border-gray-700 p-2 mb-6 rounded text-gray-200 outline-none"
            >
              <option value="Chưa thanh toán">Chưa thanh toán</option>
              <option value="Đã thanh toán">Đã thanh toán</option>
              <option value="Thanh toán thất bại">Thanh toán thất bại</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateStatus}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW ORDER MODAL */}
      {isViewing && selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E1E1E] text-gray-300 p-6 rounded-xl w-full max-w-2xl shadow-lg border border-gray-800 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
              <h2 className="text-xl font-bold text-white">Chi tiết Đơn hàng #{selectedInvoice.SalesInvoiceID}</h2>
              <button onClick={() => setIsViewing(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-2">Thông tin Khách hàng</h3>
                <p><span className="text-gray-500">Họ tên:</span> {selectedInvoice.Account?.FullName}</p>
                <p><span className="text-gray-500">SĐT:</span> {selectedInvoice.Account?.Phone}</p>
                <p><span className="text-gray-500">Email:</span> {selectedInvoice.Account?.Email}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-2">Thông tin Giao hàng</h3>
                <p><span className="text-gray-500">Địa chỉ:</span> {selectedInvoice.Address}</p>
                <p><span className="text-gray-500">Thanh toán:</span> {selectedInvoice.PaymentMethod}</p>
                <p>
                  <span className="text-gray-500">TT thanh toán:</span>{" "}
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ml-1 ${
                    PAYMENT_STATUS_MAP[selectedInvoice.PaymentStatus]?.color || "bg-orange-500/20 text-orange-400"
                  }`}>
                    {selectedInvoice.PaymentStatus || "Chưa thanh toán"}
                  </span>
                </p>
                <p><span className="text-gray-500">Đặt lúc:</span> {new Date(selectedInvoice.EntryDate).toLocaleString("vi-VN")}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-2">Sản phẩm ({selectedInvoice.SalesInvoiceDetails?.length || 0})</h3>
              <div className="bg-[#2A2A2A] rounded-lg divide-y divide-gray-800">
                {(selectedInvoice.SalesInvoiceDetails || []).map((detail) => (
                  <div key={detail.DetailID} className="p-3 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-gray-200 font-medium">{detail.Product?.ProductName || `SP #${detail.ProductID}`}</span>
                      <span className="text-gray-500 text-xs">Phân loại / Ghi chú (nếu có)</span>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-200">{Number(detail.UnitPrice || 0).toLocaleString("vi-VN")}đ x {detail.Quantity}</p>
                      <p className="text-red-400 font-bold">{Number(detail.TotalPrice || 0).toLocaleString("vi-VN")}đ</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-700">
              <span className="text-lg text-gray-400">Tổng cộng:</span>
              <span className="text-2xl font-bold text-red-500">{Number(selectedInvoice.TotalAmount || 0).toLocaleString("vi-VN")}đ</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
