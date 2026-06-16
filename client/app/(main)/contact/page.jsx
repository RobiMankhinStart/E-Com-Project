import React from "react";
import Link from "next/link";

const ContactPage = () => {
  return (
    <main className="bg-slate-50 min-h-screen text-slate-900">
      <section className="px-6 py-16 lg:px-12 max-w-screen-2xl mx-auto">
        <div className="max-w-3xl">
          <span className="text-[10px] uppercase tracking-[0.3em] text-indigo-600 font-bold mb-4 block">
            Get in touch
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-6">
            We’re here to help with every detail.
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">
            Whether you have a question about a product, need styling advice, or
            want to explore a collaboration, our team is ready to support you
            with expert care and fast response.
          </p>
        </div>
      </section>

      <section className="px-6 lg:px-12 max-w-screen-2xl mx-auto pb-16">
        <div className="grid gap-8 xl:grid-cols-3">
          <div className="rounded-[32px] bg-white border border-slate-200 p-10 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-4">
              Customer care
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Need help with an order or product selection? Reach out to our
              concierge team.
            </p>
            <a
              href="mailto:hello@RoyalCart.com"
              className="font-bold text-indigo-600 hover:underline"
            >
              hello@RoyalCart.com
            </a>
          </div>

          <div className="rounded-[32px] bg-white border border-slate-200 p-10 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-4">
              Wholesale inquiries
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Interested in stocking our latest collection? Our team would love
              to hear from you.
            </p>
            <a
              href="mailto:wholesale@RoyalCart.com"
              className="font-bold text-indigo-600 hover:underline"
            >
              wholesale@RoyalCart.com
            </a>
          </div>

          <div className="rounded-[32px] bg-white border border-slate-200 p-10 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-4">
              Studio visits
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Book a private consultation with our design team and preview new
              arrivals in person.
            </p>
            <p className="font-bold text-slate-900">Available by appointment</p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 lg:px-12 max-w-screen-2xl mx-auto">
        <div className="grid gap-10 lg:grid-cols-2 items-start">
          <div className="rounded-[40px] bg-white border border-slate-200 p-10 shadow-xl">
            <h2 className="text-3xl font-black text-slate-900 mb-6">
              Message our team
            </h2>
            <form className="space-y-6">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Name
                </label>
                <input
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Email
                </label>
                <input
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  placeholder="name@domain.com"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Message
                </label>
                <textarea
                  className="mt-3 w-full min-h-[180px] rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Tell us about your request"
                />
              </div>
              <button className="inline-flex items-center justify-center rounded-3xl bg-indigo-600 px-8 py-4 font-bold text-white hover:bg-indigo-700 transition-colors">
                Send message
              </button>
            </form>
          </div>

          <div className="rounded-[40px] bg-slate-950 p-10 text-white shadow-2xl">
            <div className="space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
                  Location
                </span>
                <p className="mt-3 text-lg font-bold">Berlin, Germany</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
                  Hours
                </span>
                <p className="mt-3 text-sm leading-relaxed text-slate-200">
                  Monday–Friday, 9am–6pm CET
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
                  Stay connected
                </span>
                <div className="mt-4 flex flex-col gap-3 text-sm text-slate-200">
                  <Link
                    href="mailto:hello@RoyalCart.com"
                    className="font-bold text-white hover:text-indigo-300"
                  >
                    hello@RoyalCart.com
                  </Link>
                  <Link
                    href="mailto:wholesale@RoyalCart.com"
                    className="font-bold text-white hover:text-indigo-300"
                  >
                    wholesale@RoyalCart.com
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
