"use client";
import { useEffect, useMemo, useRef, useState } from "react";

function safeJsonParse(value) {
  if (!value || typeof value !== "string") return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function normalizeBlocks(parsed) {
  // Accept:
  // - blocks array
  // - { blocks: [...] }
  // - other -> fallback to plain text block
  const withIds = (arr) =>
    arr.map((item, idx) => ({
      id:
        item?.id ||
        crypto.randomUUID?.() ||
        `${Date.now()}-${idx}-${Math.floor(Math.random() * 1e9)}`,
      type: item?.type || "text",
      text: item?.text ?? item?.content ?? "",
      src: item?.src ?? item?.ImagePath ?? "",
      embedUrl: item?.embedUrl ?? item?.url ?? "",
    }));

  if (Array.isArray(parsed)) return withIds(parsed);
  if (parsed && Array.isArray(parsed.blocks)) return withIds(parsed.blocks);
  if (typeof parsed === "string") {
    return [
      {
        id: crypto.randomUUID?.() || String(Date.now()),
        type: "text",
        text: parsed || "",
      },
    ];
  }
  return [];
}

function youtubeUrlToEmbed(url) {
  if (!url || typeof url !== "string") return url;
  try {
    // youtu.be/<id>
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    // youtube.com/watch?v=<id>
    if (url.includes("watch?v=")) {
      const id = url.split("watch?v=")[1]?.split("&")[0];
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
  } catch {
    // ignore
  }
  return url;
}

export default function ProductDescriptionEditor({
  productId,
  value,
  onChange,
}) {
  const [blocks, setBlocks] = useState([]);
  const lastEmittedRef = useRef("");

  const parseToBlocks = (nextValue) => {
    const parsed = safeJsonParse(nextValue);
    return normalizeBlocks(parsed);
  };

  // Khi value thay đổi từ ngoài (bấm Edit / mở modal), cập nhật blocks.
  useEffect(() => {
    if (!value || typeof value !== "string") {
      setBlocks([]);
      return;
    }

    // Nếu đây là value do chính editor vừa emit ra thì không cần parse lại.
    if (value === lastEmittedRef.current) return;

    setBlocks(parseToBlocks(value));
  }, [value]);

  const serializedWithoutIds = useMemo(
    () =>
      JSON.stringify(
        blocks.map(({ id, ...rest }) => ({
          ...rest,
        })),
      ),
    [blocks],
  );

  useEffect(() => {
    if (!onChange) return;
    // Prevent "value changed because we just emitted" loops.
    if (
      value === serializedWithoutIds &&
      lastEmittedRef.current === serializedWithoutIds
    )
      return;
    lastEmittedRef.current = serializedWithoutIds;
    onChange(serializedWithoutIds);
  }, [serializedWithoutIds, onChange, value]);

  const emitBlock = (nextBlocks) => setBlocks(nextBlocks);

  const addBlock = (type) => {
    const id =
      crypto.randomUUID?.() || `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
    if (type === "title") {
      emitBlock([...blocks, { id, type, text: "" }]);
    } else if (type === "text") {
      emitBlock([...blocks, { id, type, text: "" }]);
    } else if (type === "image") {
      emitBlock([...blocks, { id, type, src: "" }]);
    } else if (type === "video") {
      emitBlock([...blocks, { id, type, embedUrl: "" }]);
    }
  };

  const updateBlock = (id, patch) => {
    emitBlock(blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  };

  const removeBlock = (id) => {
    emitBlock(blocks.filter((b) => b.id !== id));
  };

  return (
    <div className="relative pb-6">
      <div className="flex gap-2 flex-wrap sticky top-0 z-20 bg-[#1E1E1E] px-6 py-4 border-b border-gray-800 shadow-sm">
        <button
          type="button"
          onClick={() => addBlock("title")}
          className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          Thêm Title
        </button>
        <button
          type="button"
          onClick={() => addBlock("text")}
          className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          Thêm Text
        </button>
        <button
          type="button"
          onClick={() => addBlock("image")}
          className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          Thêm Image
        </button>
        <button
          type="button"
          onClick={() => addBlock("video")}
          className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          Thêm Video
        </button>
      </div>

      <div className="px-6 mt-4">
        {blocks.length === 0 ? (
          <div className="text-xs text-gray-400 mb-3">
            Chưa có mô tả. Hãy thêm Title/Text/Image/Video.
          </div>
        ) : null}

        <div className="space-y-3">
        {blocks.map((b) => {
          return (
            <div
              key={b.id}
              className="bg-[#2A2A2A] p-3 rounded border border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-white capitalize">
                  {b.type}
                </div>
                <button
                  type="button"
                  onClick={() => removeBlock(b.id)}
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500 text-xs"
                >
                  Xóa
                </button>
              </div>

              {b.type === "title" || b.type === "text" ? (
                <input
                  type="text"
                  placeholder={b.type === "title" ? "Nội dung title" : "Nội dung text"}
                  value={b.text || ""}
                  onChange={(e) => updateBlock(b.id, { text: e.target.value })}
                  className="w-full p-2 rounded bg-[#1E1E1E] text-white outline-none"
                />
              ) : null}

              {b.type === "image" ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="URL ảnh (hoặc path như uploads/...)"
                    value={b.src || ""}
                    onChange={(e) => updateBlock(b.id, { src: e.target.value })}
                    className="w-full p-2 rounded bg-[#1E1E1E] text-white outline-none"
                  />
                  {b.src ? (
                    <img
                      src={b.src.startsWith("http") ? b.src : `http://localhost:5000/${b.src}`}
                      alt="Preview"
                      className="w-full max-h-64 object-contain rounded"
                    />
                  ) : null}
                </div>
              ) : null}

              {b.type === "video" ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Link embed video (YouTube/...)"
                    value={b.embedUrl || ""}
                    onChange={(e) =>
                      updateBlock(b.id, {
                        embedUrl: youtubeUrlToEmbed(e.target.value),
                      })
                    }
                    className="w-full p-2 rounded bg-[#1E1E1E] text-white outline-none"
                  />
                  {b.embedUrl ? (
                    <iframe
                      title="video preview"
                      src={b.embedUrl}
                      className="w-full aspect-video rounded"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : null}
                </div>
              ) : null}

              {productId ? (
                <div className="text-[10px] text-gray-500 mt-2">
                  productId: {productId}
                </div>
              ) : null}
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}

