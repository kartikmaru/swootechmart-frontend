"use client"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CategoryFilterSection({ catRes }) {

  const { data } = catRes;

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // const selectedCategory = searchParams.get("category_slug");


  return (
    <aside className="w-full max-w-[280px] bg-[#f0f2f8] p-6 rounded-lg font-sans">

      <h2 className="text-xl font-bold uppercase mb-6 text-black tracking-wide">
        Categories
      </h2>

      {/* All Categories */}
      <Link href={"/store"}>
        <button
          className="w-full bg-white text-black font-bold py-3 px-4 rounded-md shadow-sm mb-8 hover:bg-gray-50 transition-colors"
        >
          All Categories
        </button>
      </Link>

      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-black mb-4 text-base">
            Categories
          </h3>

          <ul className="space-y-2">
            {data.map((cat) =>

            (
              <Link key={cat._id} href={`/store/${cat.slug}`} scroll={false}>
                <li
                  className={`flex ${pathname == "/store/" + cat.slug ? "bg-teal-500" : ""} justify-between px-3 py-2 rounded-lg cursor-pointer text-gray-700 hover:bg-gray-200 transition`}
                >
                  <div>{cat.name}</div>
                  <span>({cat.count || 0})</span>
                </li></Link>

            ))}
          </ul>

        </div>
      </div>
    </aside>
  );
}