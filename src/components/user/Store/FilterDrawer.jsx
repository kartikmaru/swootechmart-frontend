"use client"
import React, { useState } from 'react'
import { FiSliders, FiX } from 'react-icons/fi'

export default function FilterDrawer({ children }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* Toggle Button - Visible only on mobile/tablet */}
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition cursor-pointer"
            >
                <FiSliders className="text-[#01A49E]" size={15} />
                <span>Filters</span>
            </button>

            {/* Backdrop & Drawer */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    {/* Backdrop */}
                    <div 
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
                    />
                    
                    {/* Drawer Content */}
                    <div className="relative z-10 w-full max-w-[320px] h-full bg-gray-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100">
                            <h2 className="text-base font-black text-gray-800 uppercase tracking-wider">Filters</h2>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition cursor-pointer"
                            >
                                <FiX size={18} />
                            </button>
                        </div>
                        
                        {/* Scrollable Filters */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {children}
                        </div>
                        
                        {/* Footer (Apply Button) */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full bg-[#01A49E] hover:bg-[#01857f] text-white font-bold py-3 rounded-xl transition text-sm shadow-md cursor-pointer"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
