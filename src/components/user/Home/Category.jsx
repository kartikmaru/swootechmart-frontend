import { getCategories } from "@/API/helpAPI";
import {
    FaLaptop,
    FaDesktop,
    FaMobileAlt,
    FaTabletAlt,
    FaCamera
} from "react-icons/fa";



export default async function CategorySidebar() {

    const CategoryResponse = await getCategories({ limit: 5, is_home: true, status: true })
    // console.log(CategoryResponse,"catrgory res")
    // return
    const { data, meta } = CategoryResponse;

    return (
        <div className="w-full max-w-sm bg-gray-100 rounded-2xl p-5">

            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-800">
                Category
            </h2>

            {/* Underline */}
            <div className="w-full h-[2px] bg-gray-200 mt-2 mb-4 relative">
                <div className="absolute left-0 top-0 h-full w-16 bg-teal-500"></div>
            </div>

            {/* Category List */}
            <div className="space-y-3">
                {data.map((cat, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm border hover:shadow-md transition cursor-pointer"
                    >
                        {/* Left */}
                        <div className="flex items-center gap-3 text-gray-700">
                            <div className="text-teal-500 text-lg">
                                <img height={20} width={20} src={`${meta.ImageBaseUrl}${cat.image}`} alt={cat.image} />

                            </div>
                            <span className="text-sm font-medium">
                                {cat.name}
                            </span>
                        </div>

                        {/* Count Badge */}
                        <div className="bg-teal-100 text-teal-600 text-xs font-semibold px-3 py-1 rounded-full">
                            {cat.count}
                        </div>
                    </div>
                )
                )}
            </div>

        </div>
    );
}