import React from 'react'
import Link from 'next/link'
import { Pencil } from "lucide-react";

export default function EditBtn({editpath}) {
    return (
        <>
            <Link href={editpath}>
                <button className="p-2 cursor-pointer rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition">
                    <Pencil size={16} />
                </button>
            </Link>
        </>
    )
}
