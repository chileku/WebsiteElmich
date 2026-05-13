import Link from "next/link";
import ProductCard from "./productCard";

export default function ProductByCategory({ title, products, slug }) {
  return (
    <div className="max-w-7xl mx-auto py-10 bg-white rounded-2xl p-3 mt-3">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <div
        className="
          grid 
          grid-cols-4 
          lg:grid-cols-5 
          xl:grid-cols-6 
          gap-5
        "
      >
        {products.slice(0, 12).map((item) => (
          <ProductCard key={item.ProductID} product={item} />
        ))}
      </div>

      {/* Button xem thêm */}
      <div className="mt-8">
        <Link
          href={`/category/${slug}`}
          className="
      block
      w-full
      text-center
      bg-white
      border border-gray-300
      text-gray-700
      py-4
      rounded-2xl
      text-lg
      font-semibold
      transition-all duration-200
      hover:border-red-600
      hover:text-red-600
      hover:bg-red-50
    "
        >
          Xem thêm
        </Link>
      </div>
    </div>
  );
}
