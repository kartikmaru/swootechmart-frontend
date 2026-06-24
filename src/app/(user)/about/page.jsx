import Link from "next/link";

const stats = [
  { icon: "ðŸ˜Š", value: "50,000+", label: "Happy Customers" },
  { icon: "ðŸ“¦", value: "10,000+", label: "Products" },
  { icon: "ðŸ·ï¸", value: "500+", label: "Brands" },
  { icon: "ðŸ•", value: "24/7", label: "Support" },
];

const values = [
  { icon: "âœ…", title: "Quality",    desc: "Every product passes rigorous quality checks before it reaches you." },
  { icon: "ðŸ¤", title: "Trust",      desc: "Transparent pricing, genuine products, and no hidden surprises." },
  { icon: "ðŸ’¡", title: "Innovation", desc: "We constantly curate the latest tech so you stay ahead of the curve." },
  { icon: "ðŸŽ§", title: "Support",    desc: "Our team is always just a call or message away to assist you." },
];

const team = [
  { initials: "AK", name: "Aryan Kapoor",  role: "CEO & Co-Founder",  bg: "bg-teal-500" },
  { initials: "PS", name: "Priya Sharma",  role: "CTO",               bg: "bg-emerald-500" },
  { initials: "RN", name: "Rahul Nair",    role: "Head of Products",  bg: "bg-cyan-500" },
  { initials: "SM", name: "Sneha Mehta",   role: "Customer Success",  bg: "bg-teal-400" },
];

export default function AboutPage() {
  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6">

      {/* â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 py-20 px-6 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative">
          <span className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase backdrop-blur-sm">
            Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            About SwooTechMart
          </h1>
          <p className="text-lg sm:text-xl text-teal-50 max-w-xl mx-auto">
            Your trusted destination for premium electronics
          </p>
        </div>
      </section>

      <div className="container-app px-0">

        {/* â”€â”€ Company Story â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section className="py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-teal-100 to-emerald-100 h-72 flex items-center justify-center">
            <div className="text-center">
              <span className="text-6xl">ðŸ›ï¸</span>
              <p className="mt-3 text-teal-700 font-semibold text-sm uppercase tracking-widest">Est. 2020</p>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How We Started</h2>
            <div className="w-12 h-1 bg-teal-500 rounded mb-6" />
            <p className="text-gray-600 leading-relaxed mb-4">
              Founded in 2020, SwooTechMart started with a simple belief â€” everyone deserves access to world-class
              technology at honest prices. What began as a small online storefront quickly grew into one of India's
              most trusted electronics marketplaces.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Over the years, we have partnered with over 500 global and domestic brands, carefully curating a
              catalogue that spans smartphones, laptops, audio gear, smart home devices, and much more.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our commitment has never wavered: deliver authentic products, fair prices, and a shopping experience
              that keeps our customers coming back. Every order packed here is a promise kept.
            </p>
          </div>
        </section>

        {/* â”€â”€ Stats Bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section className="py-4 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <span className="text-4xl mb-3">{s.icon}</span>
                <p className="text-2xl font-extrabold text-teal-600">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* â”€â”€ Mission & Vision â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section className="pb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Mission &amp; Vision</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-teal-600 to-emerald-500 rounded-2xl p-8 text-white shadow-lg">
              <div className="text-4xl mb-4">ðŸŽ¯</div>
              <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
              <p className="text-teal-50 leading-relaxed">
                To democratize access to premium technology by offering a seamless, trustworthy, and affordable
                shopping experience for every customer across India â€” from metros to tier-3 cities.
              </p>
            </div>
            <div className="bg-white border-2 border-teal-400 rounded-2xl p-8 text-gray-800 shadow-lg">
              <div className="text-4xl mb-4">ðŸ”­</div>
              <h3 className="text-2xl font-bold mb-3 text-teal-700">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To become South Asia's most loved electronics destination â€” a place where innovation meets
                accessibility, and where every shopper feels confident they're getting the very best for their money.
              </p>
            </div>
          </div>
        </section>

        {/* â”€â”€ Core Values â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section className="pb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Our Core Values</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                <span className="text-4xl mb-3">{v.icon}</span>
                <h4 className="text-lg font-bold text-gray-800 mb-2">{v.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* â”€â”€ Team â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section className="pb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Meet the Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((m) => (
              <div key={m.name} className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                <div className={`${m.bg} w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-md`}>
                  <span className="text-2xl font-extrabold text-white">{m.initials}</span>
                </div>
                <h4 className="font-bold text-gray-800 text-base">{m.name}</h4>
                <p className="text-sm text-teal-600 font-medium mt-1">{m.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* â”€â”€ CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section className="pb-16">
          <div className="bg-gradient-to-r from-teal-600 to-emerald-500 rounded-3xl py-14 px-6 text-center shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Ready to Shop?</h2>
              <p className="text-teal-100 text-lg mb-8 max-w-md mx-auto">
                Explore thousands of genuine products from top brands â€” delivered fast, priced right.
              </p>
              <Link href="/store"
                className="inline-block bg-white text-teal-700 font-bold px-10 py-3 rounded-full shadow-lg hover:bg-teal-50 hover:shadow-xl transition-all duration-200 text-base">
                Shop Now â†’
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

