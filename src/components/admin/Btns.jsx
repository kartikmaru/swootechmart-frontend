'use client'
import { client } from '@/utils/Helper'
// import axios from 'axios'

import React, { useState } from 'react'

export default function Btns({ value, field, API }) {

    const [curruntstatus, setStatus] = useState(value)

    const updatedStatus = curruntstatus


    function update() {
        client.patch(
            API,
            { field }
        )
            .then(
                () => {
                    setStatus(!updatedStatus);

                })
            .catch((error) => {
                console.log(error);
            });
    }

    const label = {
        status: ["Active", "Inactive"],
        is_top: ["Top", "Not Top"],
        is_home: ["Home", "Not Home"],
        is_popular: ["Popular", "Not Popular"]
    }

    const [truelabel, falselabel] = label[field]

    return (
        <>
            <button
                onClick={update}
                className={`px-3 py-1 text-xs font-medium  rounded-full cursor-pointer ${curruntstatus
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                    }`}
            >
                {curruntstatus ? truelabel : falselabel}
            </button>
        </>
    )
}
