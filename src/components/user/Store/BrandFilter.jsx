"use client"
import { useRouter, useSearchParams } from "next/navigation";

export default function BrandFilter({ brandRes }) {
  const { data, meta } = brandRes;
  const router = useRouter()
  const searchParams = useSearchParams();
  const selectedBrand = searchParams.get("brand_slug");

  function clearBrand() {
    const query = new URLSearchParams(searchParams.toString());
    query.delete("brand_slug")
    router.push(`?${query.toString()}`, { scroll: false })
  }

  function filterHandler(slug) {
    const query = new URLSearchParams(searchParams.toString());

    if (slug === selectedBrand) {
      query.delete("brand_slug")
    } else {
      query.set("brand_slug", slug)
    }

    router.push(`?${query.toString()}`, { scroll: false })
  }

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-md border">

      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Brands
      </h2>

      {/* Underline */}
      <div className="w-full h-[2px] bg-gray-100 mb-4 relative">
        <div className="absolute left-0 top-0 h-full w-12 bg-teal-500 rounded"></div>
      </div>

      {/* Clear Button */}
      <button 
        onClick={clearBrand}
        className="w-full mb-5 bg-teal-500 text-white font-medium py-2.5 rounded-lg hover:bg-teal-600 transition"
      >
        All Brands
      </button>

      {/* Brand List */}
      <ul className="space-y-3">
        {data.map((brand) => {
          const isActive = selectedBrand === brand.slug;

          return (
            <li
              key={brand._id}
              onClick={() => filterHandler(brand.slug)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all border
              
              ${isActive 
                ? "bg-teal-50 border-teal-500 shadow-sm" 
                : "bg-gray-50 hover:bg-gray-100 border-transparent"
              }`}
            >

              {/* Left Active Indicator */}
              {isActive && (
                <div className="w-1 h-8 bg-teal-500 rounded"></div>
              )}

              {/* Image */}
              <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg border">
                <img
                  src={`${meta.imageBaseUrl}${brand.image}`}
                  alt={brand.name}
                  className="max-w-6 max-h-6 object-contain"
                />
              </div>

              {/* Name */}
              <span className={`text-sm font-medium transition
                ${isActive ? "text-teal-600" : "text-gray-700"}
              `}>
                {brand.name}
              </span>

            </li>
          );
        })}
      </ul>
    </div>
  );
}