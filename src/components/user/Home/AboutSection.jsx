import React from 'react'
import Link from 'next/link'

export default function AboutSection() {
    return (
        <section className="bg-white rounded-2xl border border-gray-100 px-8 py-8">
            <h2 className="font-black text-gray-900 text-base mb-4">
                Swoo — #1 Online Marketplace for Technology
            </h2>
            <div className="space-y-4 text-sm text-gray-500 leading-relaxed max-w-4xl">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae ornare mi. Quisque iaculis dignissim scelerisque.
                    Morbi condimentum sagittis leo vitae tempor. Suspendisse molestiae ac dictum ex lacus et luctus.
                    Fusce mattis sollicitudin sem, at lobortis nibh ullamcorper a. Donec vehicula dolor sit amet consequat mattis.
                    Fusce mattis nec turpis in scelerisque.
                </p>
                <p>
                    Morbi pharetra sem mauris, nec aliquet ipsum vestibulum suscipit. Curabitur non euismod dui.
                    Proin eget justo eu erat lacus placerat. Nam rhoncus ipsum et enim facilisis, at consequat
                    orbi lobortis et elit or sit amet dictum varius. Duis vitae bibendum.
                    Nullam vitae nibh ullamcorper, varius ante, tincidunt nisl tempor, commodo magna.
                    Praesent eleifend porttitor maximus. Sed a lacus felis. Maecenas consectetur consequat orci scelerisque malesuada.
                    Fusce vel ante tortor consequat mattis ante sit amet.
                    Class aptent taciti sociosqu ad litora torquent per conubia.
                </p>
            </div>
            <Link href="/store"
                className="inline-flex items-center gap-1.5 mt-5 text-sm text-[#01A49E] font-bold hover:underline">
                Shop All →
            </Link>
        </section>
    )
}
