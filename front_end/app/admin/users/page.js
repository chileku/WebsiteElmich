"use client";

import { useEffect, useState } from "react";
import DataTable from "@/component/admin/table";
import accountService from "@/service/account";
import { Pencil, Trash } from "lucide-react";

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // số item mỗi trang

  // EDIT state
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [editFormData, setEditFormData] = useState({
    FullName: "",
    Username: "",
    Email: "",
    Password: "",
    Role: 0,
  });

  // FETCH DATA
  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      const res = await accountService.getAll({ page, limit });
      setAccounts(res.data.data);
      setCurrentPage(res.data.pagination.currentPage);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, []);

  // TABLE COLUMNS
  const columns = [
    {
      label: "STT",
      render: (_, index) => (currentPage - 1) * limit + index + 1,
    },
    { label: "Họ & Tên", key: "FullName" },
    { label: "Username", key: "Username" },
    { label: "Email", key: "Email" },
    { label: "Role", key: "Role" },
  ];

  // ACTIONS
  const actions = [
    {
      label: "Edit",
      icon: Pencil,
      className: "text-blue-500",
      onClick: (row) => {
        setSelectedAccount(row);
        setEditFormData({
          FullName: row.FullName,
          Username: row.Username,
          Email: row.Email,
          Password: "",
          Role: row.Role,
        });
        setIsEditing(true);
      },
    },
    {
      label: "Delete",
      icon: Trash,
      className: "text-red-500",
      onClick: async (row) => {
        if (confirm(`Bạn có chắc muốn xóa tài khoản "${row.Username}"?`)) {
          try {
            await accountService.remove(row.AccountID);
            // nếu xóa hết item trang hiện tại, quay lại trang trước
            if (accounts.length === 1 && currentPage > 1) {
              fetchData(currentPage - 1);
            } else {
              fetchData(currentPage);
            }
          } catch (err) {
            console.error(err.response?.data || err.message);
          }
        }
      },
    },
  ];

  // UPDATE
  const handleUpdate = async () => {
    try {
      const payload = {
        FullName: editFormData.FullName,
        Username: editFormData.Username,
        Email: editFormData.Email,
        Role: editFormData.Role,
      };
      if (editFormData.Password) payload.Password = editFormData.Password;

      await accountService.update(selectedAccount.AccountID, payload);
      await fetchData(currentPage);
      setIsEditing(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* DATA TABLE */}
      <DataTable
        title="Tài Khoản"
        columns={columns}
        data={accounts}
        actions={actions}
      />

      {/* PAGINATION */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => fetchData(currentPage - 1)}
          className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
        >
          ← Trước
        </button>

        {[...Array(totalPages)].map((_, idx) => {
          const page = idx + 1;
          return (
            <button
              key={page}
              onClick={() => fetchData(page)}
              className={`px-3 py-1 rounded ${
                page === currentPage
                  ? "bg-red-600 text-white"
                  : "bg-gray-600 text-white"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          disabled={currentPage === totalPages}
          onClick={() => fetchData(currentPage + 1)}
          className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
        >
          Sau →
        </button>
      </div>

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E1E1E] text-gray-300 p-6 rounded-xl w-[400px] shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-white">Sửa Tài Khoản</h2>

            <input
              type="text"
              placeholder="Họ & Tên"
              value={editFormData.FullName}
              onChange={(e) =>
                setEditFormData({ ...editFormData, FullName: e.target.value })
              }
              className="w-full bg-[#2A2A2A] border border-gray-700 p-2 mb-3 rounded text-gray-200 placeholder-gray-400 outline-none"
            />

            <input
              type="text"
              placeholder="Username"
              value={editFormData.Username}
              onChange={(e) =>
                setEditFormData({ ...editFormData, Username: e.target.value })
              }
              className="w-full bg-[#2A2A2A] border border-gray-700 p-2 mb-3 rounded text-gray-200 placeholder-gray-400 outline-none"
            />

            <input
              type="email"
              placeholder="Email"
              value={editFormData.Email}
              onChange={(e) =>
                setEditFormData({ ...editFormData, Email: e.target.value })
              }
              className="w-full bg-[#2A2A2A] border border-gray-700 p-2 mb-3 rounded text-gray-200 placeholder-gray-400 outline-none"
            />

            <input
              type="password"
              placeholder="Password (để trống nếu không đổi)"
              value={editFormData.Password}
              onChange={(e) =>
                setEditFormData({ ...editFormData, Password: e.target.value })
              }
              className="w-full bg-[#2A2A2A] border border-gray-700 p-2 mb-3 rounded text-gray-200 placeholder-gray-400 outline-none"
            />

            <select
              value={editFormData.Role}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  Role: Number(e.target.value),
                })
              }
              className="w-full bg-[#2A2A2A] border border-gray-700 p-2 mb-3 rounded text-gray-200 outline-none"
            >
              <option value={0}>User</option>
              <option value={1}>Admin</option>
            </select>

            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setIsEditing(false)}
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
      )}
    </div>
  );
}
