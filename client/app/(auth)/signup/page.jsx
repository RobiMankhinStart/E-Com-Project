"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiClient } from "@/app/lib/apiClient";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    nameError: "",
    emailError: "",
    passwordError: "",
  });

  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const toastId = toast.loading("Creating your account...");

    try {
      await apiClient.post("/auth/signup", userData);

      toast.success("Account created! Redirecting to verification...", {
        id: toastId,
      });
      setIsLoading(false);
      window.localStorage.setItem("tempEmail", userData.email || "");

      setTimeout(() => {
        router.push("/verifyotp");
      }, 1200);
    } catch (error) {
      setIsLoading(false);
      const message = error?.message || "Signup failed";
      toast.error(message, { id: toastId });

      if (message === "Full Name is required")
        setErrors((prev) => ({ ...prev, nameError: message }));
      if (
        message === "Email is required" ||
        message === "Enter a valid email address" ||
        message === "Email already exist"
      )
        setErrors((prev) => ({ ...prev, emailError: message }));
      if (message === "Password is required")
        setErrors((prev) => ({ ...prev, passwordError: message }));
    }
  };
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header>
        <h3 className="font-['Manrope'] text-3xl font-extrabold tracking-tight mb-2 text-[#191c1e]">
          Create Account
        </h3>
        <p className="text-[#464555] text-sm">
          Join the elite network of modern RoyalCart.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="col-span-full space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#464555]">
            Full Name
          </label>
          <input
            onChange={(e) => {
              setUserData((prev) => ({ ...prev, fullName: e.target.value }));
              setErrors((prev) => ({ ...prev, nameError: "" }));
            }}
            className={`w-full bg-[#f2f4f6] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#3525cd]/20 focus:bg-white outline-none transition-all ${
              errors.nameError ? "ring-2 ring-rose-500/20 bg-rose-50/50" : ""
            }`}
            placeholder="Julian Thorne"
            type="text"
            value={userData.fullName}
          />
          {errors.nameError && (
            <p className="text-[11px] font-bold text-rose-500 ml-2 animate-in fade-in slide-in-from-top-1">
              {errors.nameError}
            </p>
          )}
          {/* <input
            onChange={(e) => {
              setUserData((prev) => ({ ...prev, fullName: e.target.value }));
              setErrors((prev) => ({ ...prev, nameError: "" }));
            }}
            className="w-full bg-[#f2f4f6] border-none rounded-lg px-4 py-3 focus:ring-1 focus:ring-[#3525cd]/40 focus:bg-white outline-none"
            placeholder="Julian Thorne"
            type="text"
            error={errors?.nameError}
          /> */}
        </div>
        <div className="col-span-full space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#464555]">
            Email
          </label>
          <input
            onChange={(e) => {
              setUserData((prev) => ({ ...prev, email: e.target.value }));
              setErrors((prev) => ({ ...prev, emailError: "" }));
            }}
            className={`w-full bg-[#f2f4f6] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#3525cd]/20 focus:bg-white outline-none transition-all ${
              errors.emailError ? "ring-2 ring-rose-500/20 bg-rose-50/50" : ""
            }`}
            placeholder="julian@thorn.com"
            type="email"
            value={userData.email}
          />
          {errors.emailError && (
            <p className="text-[11px] font-bold text-rose-500 ml-2 animate-in fade-in slide-in-from-top-1">
              {errors.emailError}
            </p>
          )}
        </div>

        <div className="col-span-full space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#464555]">
            Password
          </label>
          <input
            onChange={(e) => {
              setUserData((prev) => ({ ...prev, password: e.target.value }));
              setErrors((prev) => ({ ...prev, passwordError: "" }));
            }}
            className={`w-full bg-[#f2f4f6] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#3525cd]/20 focus:bg-white outline-none transition-all ${
              errors.passwordError
                ? "ring-2 ring-rose-500/20 bg-rose-50/50"
                : ""
            }`}
            placeholder="Min. 8 characters"
            type="password"
            value={userData.password}
          />
          {errors.passwordError && (
            <p className="text-[11px] font-bold text-rose-500 ml-2 animate-in fade-in slide-in-from-top-1">
              {errors.passwordError}
            </p>
          )}
        </div>

        {/* --- CHANGE: Full-width button now expands downward without affecting header --- */}
        <button
          type="submit"
          disabled={isLoading} // Prevents clicking while true
          className={`col-span-full  py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition-all mt-2 ${
            isLoading
              ? "opacity-50 cursor-not-allowed grayscale"
              : "hover:opacity-90 active:scale-[0.98]"
          }`}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      {/* --- CHANGE: Added route switch option at the bottom --- */}
      <p className="text-center text-sm text-[#464555]">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="text-[#3525cd] font-bold hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
