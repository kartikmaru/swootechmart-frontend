import { IoCheckmarkCircle } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import AddToCart from "./AddToCart";

export default function ProductCard({ product, image }) {

  return (
    <div className="w-full max-w-[240px] bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">

      {/* Image Section */}
      <div className="relative mb-4">

        {/* ❤️ Wishlist Button */}
        <button className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-white shadow-md hover:bg-red-50 transition flex items-center justify-center">
          <FaHeart className="text-gray-400 hover:text-red-500 text-sm" />
        </button>

        {/* Image */}
        <div className="aspect-square flex items-center justify-center overflow-hidden rounded-xl bg-gray-50 p-3">
          <img
            src={image}
            alt={product.name}
            className="object-contain h-full w-full group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-800 leading-snug mb-2 line-clamp-2 group-hover:text-black">
        {product.name}
      </h3>

      {/* Price Section */}
      <div className="mb-3">
        <div className="flex items-center gap-2 flex-wrap">

          <span className="text-lg font-bold text-black">
            ₹{product.final_price}
          </span>

          <span className="text-sm text-gray-400 line-through">
            ₹{product.original_price}
          </span>

          <span className="bg-red-100 text-red-600 text-[10px] font-semibold px-2 py-0.5 rounded">
            {product.discount}% OFF
          </span>

        </div>
      </div>

      {/* Tags */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <span className="bg-cyan-50 text-cyan-600 text-[10px] font-medium px-2 py-0.5 rounded">
          FREE SHIPPING
        </span>
        <span className="bg-cyan-50 text-cyan-600 text-[10px] font-medium px-2 py-0.5 rounded">
          FREE GIFT
        </span>
      </div>

      {/* Stock */}
      <div className="flex items-center gap-2 mb-3 text-xs font-medium text-gray-600">
        <span
          className="flex items-center justify-center text-base"
          style={{ color: product.stock ? "#16a34a" : "#dc2626" }}
        >
          {product.stock ? <IoCheckmarkCircle /> : <MdCancel />}
        </span>

        <span>
          {product.stock ? "In Stock" : "Unavailable"}
        </span>
      </div>

      {/* Variants */}
      <div className="flex gap-2 mb-4">
        <button className="h-7 w-7 rounded-md border border-gray-200 overflow-hidden p-1 hover:border-gray-400 transition">
          <img
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
            alt="Variant 1"
            className="object-contain h-full w-full"
          />
        </button>

        <button className="h-7 w-7 rounded-md border border-gray-200 overflow-hidden p-1 hover:border-gray-400 transition">
          <img
            src="https://images.unsplash.com/photo-1583394838336-acd977736f90"
            alt="Variant 2"
            className="object-contain h-full w-full"
          />
        </button>
      </div>

      {/* Button */}
      <AddToCart product={product} image={image} />
    </div>
  );
}