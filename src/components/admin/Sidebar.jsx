'use client'

import React, { useState } from 'react'
import { FaBarsStaggered } from "react-icons/fa6";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoColorPalette } from "react-icons/io5";
import { MdCategory } from "react-icons/md";
import { FaProductHunt } from "react-icons/fa";
import { SiBrandfetch } from "react-icons/si";
import { BsCartCheckFill } from "react-icons/bs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars } from "react-icons/fa6";



export default function Sidebar() {

    const [open, Setopen] = useState(true)

    const active = usePathname()

    const lists = [
        {
            name: "DashBoard",
            path: "/admin",
            icon: <LuLayoutDashboard />
        },
        {
            name: "Category",
            path: "/admin/category",
            icon: <MdCategory />
        },
        {
            name: "Brand",
            path: "/admin/brand",
            icon: <SiBrandfetch />
        },
        {
            name: "color",
            path: "/admin/color",
            icon: <IoColorPalette />
        },
        {
            name: "Product",
            path: "/admin/product",
            icon: <FaProductHunt />
        },
        {
            name: "Order",
            path: "/admin/order",
            icon: <BsCartCheckFill />
        },
    ]


    return (
        <div className={`${open ? "w-64" : "w-20"} min-h-screen h-full shadow-xl sticky top-0 duration-200 p-4 pl-5 bg-white shrink-0`}>
            <h1 className={`${open ? "justify-between" : "justify-center mt-2"} flex items-center text-xl font-bold`}>
                {open && (
                    <span className="text-orange-400">Ishop <span className="text-black">Admin</span></span>
                )}
                <button className="cursor-pointer" onClick={() => Setopen(!open)}>
                    {open ? <FaBarsStaggered /> : <FaBars />}
                </button>
            </h1>
            <div className="mt-10 space-y-1.5">
                {lists.map((data, index) => (
                    <Link href={data.path} key={index}
                        className={`${active === data.path
                            ? "bg-orange-400 text-white"
                            : "text-gray-700 hover:bg-orange-100"
                        } flex gap-3 text-base font-semibold items-center rounded-2xl p-3 transition duration-150
                        ${open ? "" : "justify-center"}`}>
                        <span className="shrink-0">{data.icon}</span>
                        {open && <span className="truncate">{data.name}</span>}
                    </Link>
                ))}
            </div>
        </div>
    )
}
