'use client'
import React from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2 } from "lucide-react";
import Swal from 'sweetalert2';
import { client } from '@/utils/Helper';

export default function DeleteBtn({ API }) {

    const router = useRouter()

    const removeData = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {

            if (result.isConfirmed) {

                client.delete(API)
                    .then((res) => {

                        Swal.fire({
                            title: "Deleted!",
                            text: "Deletd Successfully.",
                            icon: "success"
                        });

                        console.log(res.data)
                        router.refresh()
                    })
                    .catch((error) => {
                        console.log(error);

                        Swal.fire({
                            title: "Error!",
                            text: "Something went wrong.",
                            icon: "error"
                        });
                    });
            }
        });
    }
    return (

        <>
            <button
                onClick={removeData}
                className="p-2 cursor-pointer rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
            >
                <Trash2 size={16} />
            </button>
        </>
    )
}