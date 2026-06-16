import React from "react";
import Link from "next/link";

const AboutPage = () => {
  return (
    <main className="bg-slate-50 min-h-screen text-slate-900">
      <section className="px-6 py-16 lg:px-12 max-w-screen-2xl mx-auto">
        <div className="max-w-3xl">
          <span className="text-[10px] uppercase tracking-[0.3em] text-indigo-600 font-bold mb-4 block">
            About RoyalCart
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-6">
            Modern editorial design for meaningful living.
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">
            RoyalCart creates immersive product experiences for people who seek
            clarity, craft, and elegant simplicity. We blend architectural
            precision, thoughtful materials, and thoughtful curation to deliver
            elevated essentials for everyone.
          </p>
        </div>
      </section>

      <section className="px-6 pb-16 lg:px-12 max-w-screen-2xl mx-auto">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="bg-white rounded-[32px] border border-slate-200 p-10 shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold mb-4">
              Our Mission
            </p>
            <h2 className="text-2xl font-black text-slate-900 mb-4">
              Design with intention.
            </h2>
            <p className="text-slate-600 leading-relaxed">
              We help discerning creators shape their spaces with thoughtful
              objects, premium materials, and editorial storytelling that feels
              both timeless and contemporary.
            </p>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200 p-10 shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold mb-4">
              Our Values
            </p>
            <ul className="space-y-4 text-slate-600 leading-relaxed">
              <li className="font-semibold text-slate-900">
                Quality over quantity.
              </li>
              <li className="font-semibold text-slate-900">
                Precision in every detail.
              </li>
              <li className="font-semibold text-slate-900">
                Story-led product curation.
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200 p-10 shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold mb-4">
              Our Approach
            </p>
            <p className="text-slate-600 leading-relaxed">
              From concept to collection, each item is selected to feel
              effortless, structured, and meaningful. We partner with makers and
              designers who share our dedication to enduring style.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 lg:px-12 max-w-screen-2xl mx-auto">
        <div className="bg-white rounded-[40px] shadow-xl border border-slate-200 p-10 lg:p-16">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-indigo-600 font-bold mb-4 block">
                Why RoyalCart
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">
                Thoughtful products for intentional spaces.
              </h2>
              <p className="text-slate-600 leading-relaxed mb-8">
                We believe every object should have purpose. Whether it’s a
                tailored overcoat, a sculptural home accent, or a daily carry
                essential, our collections are designed to bring calm, clarity,
                and craft into modern living.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-3xl bg-indigo-600 px-8 py-4 font-bold text-white hover:bg-indigo-700 transition-colors"
              >
                Contact our team
              </Link>
            </div>
            <div className="grid gap-6">
              <div className="rounded-[32px] bg-slate-950 p-8 text-white shadow-2xl">
                <h3 className="text-2xl font-black mb-3">Premium curation</h3>
                <p className="text-sm leading-relaxed text-slate-200">
                  Each launch is curated to complement the way you live, work,
                  and collect.
                </p>
              </div>
              <div className="rounded-[32px] bg-slate-100 p-8">
                <h3 className="text-2xl font-black mb-3 text-slate-900">
                  Global sourcing
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  We source from makers around the world, prioritizing quality
                  materials and responsible craft.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
