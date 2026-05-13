"use client";

function renderBlock(block) {
  switch (block.type) {
    case "title":
      return (
        <h3 className="text-lg font-semibold text-gray-900 mt-4">
          {block.text}
        </h3>
      );

    case "text":
      return <p className="text-gray-700 leading-relaxed">{block.text}</p>;

    case "image":
      return (
        <img
          src={
            block.src?.startsWith("http")
              ? block.src
              : `http://localhost:5000/${block.src}`
          }
          alt="product"
          className="w-full rounded-lg object-contain my-3"
        />
      );

    case "video":
      return (
        <div className="w-full aspect-video my-4">
          <iframe
            src={block.embedUrl}
            className="w-full h-full rounded-lg"
            allowFullScreen
          />
        </div>
      );

    default:
      return null;
  }
}

export default function ProductInfo({ title, description }) {
  let parsedDescription = [];

  try {
    const raw =
      typeof description === "string" ? JSON.parse(description) : description;
    if (Array.isArray(raw)) {
      parsedDescription = raw;
    } else if (raw && Array.isArray(raw.blocks)) {
      parsedDescription = raw.blocks;
    } else if (typeof raw === "string") {
      parsedDescription = [{ type: "text", text: raw }];
    }
  } catch (e) {
    // Fallback: plain text
    if (typeof description === "string" && description) {
      parsedDescription = [{ type: "text", text: description }];
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 mt-2">
      <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-6">
        {/* Title */}
        <h2 className="text-xl font-semibold mb-2">Thông tin sản phẩm</h2>

        {/* Section label */}
        <div className="border-l-4 border-red-500 pl-3 text-red-500 font-semibold mb-4">
          {title}
        </div>

        {/* Render blocks */}
        <div className="space-y-3">
          {parsedDescription.map((block, index) => (
            <div key={index}>{renderBlock(block)}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
