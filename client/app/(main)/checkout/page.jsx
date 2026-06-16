"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ArrowBigLeftDash } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { apiClient } from "@/app/lib/apiClient";

const CART_STORAGE_KEY = "curator_cart";
const CART_OWNER_KEY = "curator_cart_owner";

const getStoredCart = () => {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};
const CheckoutPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState(() => getStoredCart());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    saveInfo: false,
    paymentType: "cash",
    insideDhaka: true,
    promoCode: "",
  });

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      router.replace("/cart");
    }
  }, [cartItems, router]);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 0 ? 0 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const formattedPrice = (value) =>
    `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleCompleteOrder = async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.zip ||
      !formData.paymentType
    ) {
      toast.error("Please complete all required checkout fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const shippingAddress = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
      };

      const response = await apiClient.post("/checkout", {
        paymentType: formData.paymentType,
        shippingAddress,
        insideDhaka: formData.insideDhaka,
      });

      // clearing local storage and notify app
      window.localStorage.removeItem(CART_STORAGE_KEY);
      window.localStorage.removeItem(CART_OWNER_KEY);
      window.dispatchEvent(new Event("curator_cart_updated"));

      if (response?.data?.sessionUrl) {
        window.location.href = response.data.sessionUrl;
        return;
      }

      toast.success(
        "Order completed successfully! Thank you for your purchase.",
      );
      router.push("/shop");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.message || "Unable to complete the order. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pt-10 pb-20 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto min-h-screen bg-[#f7f9fb] font-['Inter']">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Checkout Stepper & Forms */}
        <div className="lg:col-span-8 space-y-12 lg:ml-10">
          {/* Stepper Progress */}
          <div className="flex items-center justify-between max-w-md">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#3525cd] flex items-center justify-center text-white font-bold">
                1
              </div>
              <span className="text-xs font-bold text-[#191c1e] uppercase tracking-widest">
                Shipping
              </span>
            </div>
            <div className="h-0.5 grow bg-[#eceef0] mx-4 -mt-6"></div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 rounded-full border-2 border-[#c7c4d8] bg-white flex items-center justify-center text-[#464555] font-bold">
                2
              </div>
              <span className="text-xs font-medium text-[#464555] uppercase tracking-widest">
                Payment
              </span>
            </div>
            <div className="h-0.5 grow bg-[#eceef0] mx-4 -mt-6"></div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 rounded-full border-2 border-[#c7c4d8] bg-white flex items-center justify-center text-[#464555] font-bold">
                3
              </div>
              <span className="text-xs font-medium text-[#464555] uppercase tracking-widest">
                Review
              </span>
            </div>
          </div>

          {/* Section 1: Shipping Address */}
          <section className="bg-white p-8 lg:p-12 rounded-xl shadow-sm border border-[#eceef0]">
            <h2 className="text-3xl font-bold tracking-tight mb-8 font-['Manrope'] text-[#191c1e]">
              Shipping Address
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#464555] uppercase tracking-wider">
                    First Name
                  </label>
                  <input
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    className="w-full bg-[#f2f4f6] border-none rounded-lg p-4 focus:ring-2 focus:ring-[#3525cd]/20 focus:bg-white transition-all duration-200 outline-none"
                    placeholder="Julian"
                    type="text"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#464555] uppercase tracking-wider">
                    Last Name
                  </label>
                  <input
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    className="w-full bg-[#f2f4f6] border-none rounded-lg p-4 focus:ring-2 focus:ring-[#3525cd]/20 focus:bg-white transition-all duration-200 outline-none"
                    placeholder="Leigh"
                    type="text"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#464555] uppercase tracking-wider">
                  Street Address
                </label>
                <input
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  className="w-full bg-[#f2f4f6] border-none rounded-lg p-4 focus:ring-2 focus:ring-[#3525cd]/20 focus:bg-white transition-all duration-200 outline-none"
                  placeholder="124 Editorial Lane, Apt 4B"
                  type="text"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="col-span-2 md:col-span-1 space-y-1">
                  <label className="text-xs font-bold text-[#464555] uppercase tracking-wider">
                    City
                  </label>
                  <input
                    value={formData.city}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, city: e.target.value }))
                    }
                    className="w-full bg-[#f2f4f6] border-none rounded-lg p-4 focus:ring-2 focus:ring-[#3525cd]/20 focus:bg-white transition-all duration-200 outline-none"
                    placeholder="Dhaka"
                    type="text"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#464555] uppercase tracking-wider">
                    Division
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        state: e.target.value,
                      }))
                    }
                    className="w-full bg-[#f2f4f6] border-none rounded-lg p-4 focus:ring-2 focus:ring-[#3525cd]/20 focus:bg-white transition-all duration-200 outline-none appearance-none"
                  >
                    <option value="">Select division</option>
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chattogram">Chattogram</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Barishal">Barishal</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#464555] uppercase tracking-wider">
                    ZIP Code
                  </label>
                  <input
                    value={formData.zip}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, zip: e.target.value }))
                    }
                    className="w-full bg-[#f2f4f6] border-none rounded-lg p-4 focus:ring-2 focus:ring-[#3525cd]/20 focus:bg-white transition-all duration-200 outline-none"
                    placeholder="10001"
                    type="text"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 pt-4">
                <label className="inline-flex items-center gap-3 text-sm text-[#464555]">
                  <input
                    className="w-5 h-5 rounded text-[#3525cd] focus:ring-[#3525cd] border-[#c7c4d8]"
                    id="save-info"
                    type="checkbox"
                    checked={formData.saveInfo}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        saveInfo: e.target.checked,
                      }))
                    }
                  />
                  Save this information for next time
                </label>
                <label className="inline-flex items-center gap-3 text-sm text-[#464555]">
                  <input
                    className="w-5 h-5 rounded text-[#3525cd] focus:ring-[#3525cd] border-[#c7c4d8]"
                    id="inside-dhaka"
                    type="checkbox"
                    checked={formData.insideDhaka}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        insideDhaka: e.target.checked,
                      }))
                    }
                  />
                  Delivery inside Dhaka
                </label>
              </div>
            </form>
          </section>

          {/* Section 2: Payment Method */}
          <section className="bg-[#f2f4f6] p-8 lg:p-12 rounded-xl opacity-90 grayscale-[0.5]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold tracking-tight font-['Manrope'] text-[#191c1e]">
                Payment Method
              </h2>
              <span className="text-xs font-bold text-[#3525cd] uppercase tracking-widest">
                Next Step
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card Option */}
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, paymentType: "online" }))
                }
                className={`relative p-6 rounded-xl border-2 bg-white shadow-sm transition-all text-left ${
                  formData.paymentType === "online"
                    ? "border-[#3525cd]"
                    : "border-transparent hover:border-[#c7c4d8]"
                }`}
              >
                <div className="flex justify-between items-start mb-12">
                  <span className="material-symbols-outlined text-[#3525cd] text-3xl">
                    credit_card
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full border-4 ${
                      formData.paymentType === "online"
                        ? "border-[#3525cd]"
                        : "border-[#c7c4d8]"
                    }`}
                  ></div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 font-['Manrope']">
                    Stripe / Online
                  </h3>
                  <p className="text-sm text-[#464555]">
                    Secure credit card and digital wallet payment.
                  </p>
                </div>
              </button>
              {/* COD Option */}
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, paymentType: "cash" }))
                }
                className={`relative p-6 rounded-xl border-2 bg-white shadow-sm transition-all text-left ${
                  formData.paymentType === "cash"
                    ? "border-[#3525cd]"
                    : "border-transparent hover:border-[#c7c4d8]"
                }`}
              >
                <div className="flex justify-between items-start mb-12">
                  <span className="material-symbols-outlined text-[#464555] text-3xl">
                    payments
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full border-4 ${
                      formData.paymentType === "cash"
                        ? "border-[#3525cd]"
                        : "border-[#c7c4d8]"
                    }`}
                  ></div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 font-['Manrope']">
                    Cash on Delivery
                  </h3>
                  <p className="text-sm text-[#464555]">
                    Pay in person when your order arrives.
                  </p>
                </div>
              </button>
            </div>
            {/* Secure Badge */}
            <div className="mt-8 flex items-center justify-center space-x-3 text-[#464555] opacity-60">
              <span className="material-symbols-outlined text-sm">lock</span>
              <span className="text-xs uppercase tracking-widest font-bold">
                256-bit SSL Secure Payment Gateway
              </span>
            </div>
          </section>

          {/* CTA Navigation */}
          <div className="flex items-center justify-between pt-8">
            <Link
              href={`/cart`}
              className="text-sm font-bold text-[#3525cd] flex items-center group transition-colors"
            >
              <span className="material-symbols-outlined mr-2 transition-transform group-hover:-translate-x-1">
                <ArrowBigLeftDash />
              </span>
              Back to Cart
            </Link>
            <button
              type="button"
              onClick={handleCompleteOrder}
              disabled={isSubmitting}
              className="px-10 py-4 rounded-lg bg-indigo-600 text-white font-bold text-lg shadow-xl hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Completing..." : "Complete Purchase"}
            </button>
          </div>
        </div>

        {/* Right Column: Order Summary (Sticky) */}
        <aside className="lg:col-span-4">
          <div className="sticky top-10 space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-[#eceef0]">
              <h3 className="text-xl font-bold mb-8 font-['Manrope'] text-[#191c1e]">
                Order Summary
              </h3>
              {/* Cart Items */}
              <div className="space-y-6 mb-8">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    image={item.image}
                    name={item.title}
                    details={`${item.variant || ""} • Qty: ${item.quantity}`}
                    price={formattedPrice(item.price * item.quantity)}
                  />
                ))}
              </div>
              {/* Calculations */}
              <div className="space-y-4 border-t border-[#eceef0] pt-8">
                <div className="flex justify-between text-sm">
                  <span className="text-[#464555]">Subtotal</span>
                  <span className="font-medium">
                    {formattedPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#464555]">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0
                      ? "Complimentary"
                      : formattedPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#464555]">Estimated Tax</span>
                  <span className="font-medium">{formattedPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-4 border-t border-[#eceef0]">
                  <span className="font-['Manrope']">Total</span>
                  <span className="text-[#3525cd]">
                    {formattedPrice(total)}
                  </span>
                </div>
              </div>
              {/* Promo Code */}
              <div className="mt-8 flex space-x-2">
                <input
                  className="grow bg-[#f2f4f6] border-none rounded-lg p-3 text-sm focus:ring-1 focus:ring-[#3525cd]/40 outline-none"
                  placeholder="Promo code"
                  type="text"
                />
                <button className="bg-[#e6e8ea] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#e0e3e5] transition-colors">
                  Apply
                </button>
              </div>
            </div>
            {/* Trust Signals */}
            <div className="p-6 bg-[#e6e8ea]/30 rounded-xl space-y-4">
              <div className="flex items-center space-x-4">
                <span className="material-symbols-outlined text-[#3525cd]">
                  verified_user
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#191c1e]">
                    Premium Guarantee
                  </p>
                  <p className="text-[10px] text-[#464555]">
                    Full refund within 30 days of purchase.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

// Reusable component for Cart Items
const CartItem = ({ image, name, details, price }) => (
  <div className="flex space-x-4">
    <div className="relative w-20 h-24 bg-[#f2f4f6] rounded-lg overflow-hidden shrink-0">
      <Image
        fill
        className="w-full h-full object-cover"
        src={image}
        alt={name}
      />
    </div>
    <div className="flex flex-col justify-between py-1">
      <div>
        <h4 className="font-bold text-sm text-[#191c1e]">{name}</h4>
        <p className="text-xs text-[#464555]">{details}</p>
      </div>
      <span className="font-bold text-sm text-[#191c1e]">{price}</span>
    </div>
  </div>
);

export default CheckoutPage;
