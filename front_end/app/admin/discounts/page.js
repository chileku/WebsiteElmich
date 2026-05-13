"use client";

import { useEffect, useState } from "react";
import DataTable from "@/component/admin/table";
import discountService from "@/service/discount";
import { Pencil, Trash, Plus } from "lucide-react";

export default function Discounts() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // EDIT state
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [formData, setFormData] = useState({
    DiscountRate: "",
    EntryDate: "",
    ExpirationDate: "",
  });

  // ADD state
  const [isAdding, setIsAdding] = useState(false);
  const [addFormData, setAddFormData] = useState({
    DiscountRate: "",
    EntryDate: "",
    ExpirationDate: "",
  });

  const toDateInputValue = (value) => {
    if (!value) return "";
    if (typeof value === "string") {
      // Supports: "YYYY-MM-DD" or ISO "YYYY-MM-DDTHH:mm:ssZ"
      return value.slice(0, 10);
    }
    try {
      return new Date(value).toISOString().slice(0, 10);
    } catch {
      return "";
    }
  };

  // FETCH DATA
  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      // Backend supports pagination, but admin UI currently shows a single table.
      const res = await discountService.getAll({ page: 1, limit: 100 });
      setDiscounts(res.data?.data || []);
    } catch (err) {
      console.error(err.response?.data || err.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  // UPDATE
  const handleUpdate = async () => {
    try {
      const payload = {
        DiscountRate: Number(formData.DiscountRate),
        EntryDate: formData.EntryDate || null,
        ExpirationDate: formData.ExpirationDate || null,
      };

      await discountService.update(selectedDiscount.DiscountID, payload);
      await fetchDiscounts();
      setIsEditing(false);
      setSelectedDiscount(null);
    } catch (err) {
      console.error(err.response?.data || err.message || err);
      alert("Cập nhật mã giảm giá thất bại.");
    }
  };

  // ADD
  const handleAdd = async () => {
    try {
      const payload = {
        DiscountRate: Number(addFormData.DiscountRate),
        EntryDate: addFormData.EntryDate || null,
        ExpirationDate: addFormData.ExpirationDate || null,
      };

      await discountService.create(payload);
      await fetchDiscounts();
      setIsAdding(false);
      setAddFormData({ DiscountRate: "", EntryDate: "", ExpirationDate: "" });
    } catch (err) {
      console.error(err.response?.data || err.message || err);
      alert("Thêm mã giảm giá thất bại.");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa mã giảm giá này?")) return;
    try {
      await discountService.delete(id);
      await fetchDiscounts();
    } catch (err) {
      console.error(err.response?.data || err.message || err);
      alert("Xóa mã giảm giá thất bại.");
    }
  };

  // TABLE COLUMNS
  const columns = [
    { label: "STT", render: (_, index) => index + 1 },
    { label: "DiscountID", key: "DiscountID" },
    {
      label: "Discount Rate",
      key: "DiscountRate",
      render: (row) => Number(row.DiscountRate),
    },
    {
      label: "EntryDate",
      key: "EntryDate",
      render: (row) => toDateInputValue(row.EntryDate),
    },
    {
      label: "ExpirationDate",
      key: "ExpirationDate",
      render: (row) => toDateInputValue(row.ExpirationDate),
    },
  ];

  const actions = [
    {
      label: "Edit",
      icon: Pencil,
      className: "text-blue-500",
      onClick: (row) => {
        setSelectedDiscount(row);
        setFormData({
          DiscountRate: row.DiscountRate ?? "",
          EntryDate: toDateInputValue(row.EntryDate),
          ExpirationDate: toDateInputValue(row.ExpirationDate),
        });
        setIsEditing(true);
      },
    },
    {
      label: "Delete",
      icon: Trash,
      className: "text-red-500",
      onClick: (row) => handleDelete(row.DiscountID),
    },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* HEADER BUTTON */}
      <div className="mb-4 flex gap-2">
        {!isEditing && !isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Thêm mã giảm giá
          </button>
        ) : null}
      </div>

      {/* DATA TABLE */}
      <DataTable
        title="Mã Giảm Giá"
        columns={columns}
        data={discounts}
        actions={actions}
      />

      {/* EDIT MODAL */}
      {isEditing && selectedDiscount ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E1E1E] text-gray-300 p-6 rounded-xl w-[400px] shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-white">
              Sửa Mã Giảm Giá
            </h2>

            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="DiscountRate"
              value={formData.DiscountRate}
              onChange={(e) =>
                setFormData({ ...formData, DiscountRate: e.target.value })
              }
              className="w-full bg-[#2A2A2A] border border-gray-700 p-2 mb-3 rounded text-gray-200 placeholder-gray-400 outline-none"
              required
            />

            <input
              type="date"
              placeholder="EntryDate"
              value={formData.EntryDate}
              onChange={(e) =>
                setFormData({ ...formData, EntryDate: e.target.value })
              }
              className="w-full bg-[#2A2A2A] border border-gray-700 p-2 mb-3 rounded text-gray-200 placeholder-gray-400 outline-none"
            />

            <input
              type="date"
              placeholder="ExpirationDate"
              value={formData.ExpirationDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ExpirationDate: e.target.value,
                })
              }
              className="w-full bg-[#2A2A2A] border border-gray-700 p-2 mb-3 rounded text-gray-200 placeholder-gray-400 outline-none"
            />

            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setSelectedDiscount(null);
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
              >
                Hủy
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* ADD MODAL */}
      {isAdding ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E1E1E] text-gray-300 p-6 rounded-xl w-[400px] shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-white">
              Thêm Mã Giảm Giá
            </h2>

            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="DiscountRate"
              value={addFormData.DiscountRate}
              onChange={(e) =>
                setAddFormData({
                  ...addFormData,
                  DiscountRate: e.target.value,
                })
              }
              className="w-full bg-[#2A2A2A] border border-gray-700 p-2 mb-3 rounded text-gray-200 placeholder-gray-400 outline-none"
              required
            />

            <input
              type="date"
              placeholder="EntryDate"
              value={addFormData.EntryDate}
              onChange={(e) =>
                setAddFormData({
                  ...addFormData,
                  EntryDate: e.target.value,
                })
              }
              className="w-full bg-[#2A2A2A] border border-gray-700 p-2 mb-3 rounded text-gray-200 placeholder-gray-400 outline-none"
            />

            <input
              type="date"
              placeholder="ExpirationDate"
              value={addFormData.ExpirationDate}
              onChange={(e) =>
                setAddFormData({
                  ...addFormData,
                  ExpirationDate: e.target.value,
                })
              }
              className="w-full bg-[#2A2A2A] border border-gray-700 p-2 mb-3 rounded text-gray-200 placeholder-gray-400 outline-none"
            />

            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
              >
                Hủy
              </button>

              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
