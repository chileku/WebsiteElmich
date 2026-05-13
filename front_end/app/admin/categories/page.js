"use client";

import { useEffect, useState } from "react";
import DataTable from "@/component/admin/table";
import categoryService from "@/service/category";
import { Eye, Pencil, Trash, Plus } from "lucide-react";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [parentStack, setParentStack] = useState([]);
  const [loading, setLoading] = useState(true);

  // EDIT state
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    CategoryName: "",
    Slug: "",
    ParentID: null,
  });

  // ADD state
  const [isAdding, setIsAdding] = useState(false);
  const [addFormData, setAddFormData] = useState({
    CategoryName: "",
    ParentID: null,
  });

  // FETCH DATA
  const fetchData = async () => {
    try {
      const res = await categoryService.getParentsWithChildren();
      const data = res.data.data;
      console.log(res.data.data);

      setCategories(data);
      setCurrentData(data);
      setParentStack([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // TABLE COLUMNS
  const columns = [
    { label: "STT", render: (_, index) => index + 1 },
    { label: "Tên Danh Mục", key: "CategoryName" },
    { label: "SLUG", key: "Slug" },
  ];

  // ACTIONS
  const actions = [
    {
      label: "View",
      icon: Eye,
      className: "text-green-500",
      onClick: (row) => {
        if (row.children && row.children.length > 0) {
          setParentStack((prev) => [...prev, currentData]);
          setCurrentData(row.children);
        }
      },
    },
    {
      label: "Edit",
      icon: Pencil,
      className: "text-blue-500",
      onClick: (row) => {
        setSelectedCategory(row);
        setFormData({
          CategoryName: row.CategoryName,
          Slug: row.Slug,
          ParentID: row.ParentID || null,
        });
        setIsEditing(true);
      },
    },
    {
      label: "Delete",
      icon: Trash,
      className: "text-red-500",
      onClick: async (row) => {
        if (confirm(`Bạn có chắc muốn xóa danh mục "${row.CategoryName}"?`)) {
          try {
            await categoryService.delete(row.CategoryID);
            await fetchData();
          } catch (err) {
            console.error(err.response?.data || err.message);
          }
        }
      },
    },
  ];

  // BACK
  const handleBack = () => {
    const prev = [...parentStack];
    const last = prev.pop();

    setParentStack(prev);
    setCurrentData(last);
  };

  // UPDATE
  const handleUpdate = async () => {
    try {
      const payload = {
        CategoryName: formData.CategoryName,
        ParentID: formData.ParentID || null,
      };
      await categoryService.update(selectedCategory.CategoryID, payload);

      await fetchData();
      setIsEditing(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // ADD
  const handleAdd = async () => {
    try {
      const payload = {
        CategoryName: addFormData.CategoryName,
        ParentID: addFormData.ParentID || null,
      };
      await categoryService.create(payload);

      await fetchData();
      setIsAdding(false);
      setAddFormData({ CategoryName: "", ParentID: null });
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* HEADER BUTTON */}
      <div className="mb-4 flex gap-2">
        {parentStack.length > 0 ? (
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
          >
            ← Back
          </button>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Thêm danh mục
          </button>
        )}
      </div>

      {/* DATA TABLE */}
      <DataTable
        title="Danh Mục"
        columns={columns}
        data={currentData}
        actions={actions}
      />

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E1E1E] text-gray-300 p-6 rounded-xl w-[400px] shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-white">Sửa Danh Mục</h2>

            {/* Tên danh mục */}
            <input
              type="text"
              placeholder="Tên danh mục"
              value={formData.CategoryName}
              onChange={(e) =>
                setFormData({ ...formData, CategoryName: e.target.value })
              }
              className="w-full bg-[#2A2A2A] border border-gray-700 p-2 mb-3 rounded text-gray-200 placeholder-gray-400 outline-none"
            />

            {/* Slug */}
            <input
              type="text"
              placeholder="Slug"
              value={formData.Slug}
              onChange={(e) =>
                setFormData({ ...formData, Slug: e.target.value })
              }
              className="w-full bg-[#2A2A2A] border border-gray-700 p-2 mb-3 rounded text-gray-200 placeholder-gray-400 outline-none"
            />

            {/* Chọn danh mục cha */}
            <select
              value={formData.ParentID || ""}
              onChange={(e) =>
                setFormData({ ...formData, ParentID: Number(e.target.value) })
              }
              className="w-full bg-[#2A2A2A] border border-gray-700 p-2 mb-3 rounded text-gray-200 outline-none"
            >
              <option value="">-- Chọn danh mục cha --</option>
              {categories
                .filter((cat) => cat.CategoryID !== selectedCategory.CategoryID)
                .map((cat) => (
                  <option key={cat.CategoryID} value={cat.CategoryID}>
                    {cat.CategoryName}
                  </option>
                ))}
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

      {/* ADD MODAL */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E1E1E] text-gray-300 p-6 rounded-xl w-[400px] shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-white">Thêm Danh Mục</h2>

            <input
              type="text"
              placeholder="Tên danh mục"
              value={addFormData.CategoryName}
              onChange={(e) =>
                setAddFormData({ ...addFormData, CategoryName: e.target.value })
              }
              className="w-full bg-[#2A2A2A] border border-gray-700 p-2 mb-3 rounded text-gray-200 placeholder-gray-400 outline-none"
            />

            <select
              value={addFormData.ParentID || ""}
              onChange={(e) =>
                setAddFormData({
                  ...addFormData,
                  ParentID: Number(e.target.value),
                })
              }
              className="w-full bg-[#2A2A2A] border border-gray-700 p-2 mb-3 rounded text-gray-200 outline-none"
            >
              <option value="">-- Chọn danh mục cha --</option>
              {categories.map((cat) => (
                <option key={cat.CategoryID} value={cat.CategoryID}>
                  {cat.CategoryName}
                </option>
              ))}
            </select>

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
      )}
    </div>
  );
}
