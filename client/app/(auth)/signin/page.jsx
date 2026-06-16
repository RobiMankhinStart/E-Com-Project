"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser, setLoading } from "@/app/store/authSlice";
import { apiClient } from "@/app/lib/apiClient";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const toastId = toast.loading("Logging in to your account...");

    try {
      const loginResponse = await apiClient.post("/auth/signin", userData);
      const userData_response = loginResponse?.data?.user;
      const role = userData_response?.role;

      // Store user data in Redux
      dispatch(setUser(userData_response));
      dispatch(setLoading(false));

      toast.success("Sign in successful! Redirecting...", {
        id: toastId,
      });
      setIsLoading(false);

      const redirectTarget = ["admin", "editor"].includes(role)
        ? "/admin/dashboard"
        : "/";
      setTimeout(() => {
        router.push(redirectTarget);
      }, 1200);
    } catch (error) {
      setIsLoading(false);
      const message = error?.message || "Signin failed";
      console.log(error);
      toast.error(message, {
        id: toastId,
      });

      if (message.toLowerCase().includes("email")) {
        setErrors((prev) => ({ ...prev, email: message }));
      }
      if (message.toLowerCase().includes("password")) {
        setErrors((prev) => ({ ...prev, password: message }));
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header>
        <h3 className="font-sans text-3xl font-black tracking-tight mb-2 text-slate-900">
          Welcome Back
        </h3>
        <p className="text-slate-500 text-sm font-medium">
          Enter your credentials to access your curated collection.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
            Email Address
          </label>
          <input
            onChange={(e) => handleInputChange("email", e.target.value)}
            value={userData.email}
            disabled={isLoading}
            className={`w-full bg-slate-50 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 outline-none transition-all ${
              errors.email
                ? "ring-2 ring-rose-500/20 bg-rose-50/50"
                : "focus:ring-2 focus:ring-indigo-500/10 focus:bg-white"
            }`}
            placeholder="name@domain.com"
            type="email"
          />
          {errors.email && (
            <p className="text-[11px] font-bold text-rose-500 ml-2 animate-in fade-in slide-in-from-top-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Password
            </label>
            <Link
              href="#"
              className="text-[10px] uppercase font-black text-indigo-600 hover:underline"
            >
              Forgot?
            </Link>
          </div>
          <input
            onChange={(e) => handleInputChange("password", e.target.value)}
            value={userData.password}
            disabled={isLoading}
            className={`w-full bg-slate-50 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 outline-none transition-all ${
              errors.password
                ? "ring-2 ring-rose-500/20 bg-rose-50/50"
                : "focus:ring-2 focus:ring-indigo-500/10 focus:bg-white"
            }`}
            placeholder="••••••••"
            type="password"
          />
          {errors.password && (
            <p className="text-[11px] font-bold text-rose-500 ml-2 animate-in fade-in slide-in-from-top-1">
              {errors.password}
            </p>
          )}
        </div>

        {/* --- FIXED BUTTON DESIGN FOR TAILWIND V4 COMPATIBILITY --- */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg transition-all mt-4 ${
            isLoading
              ? "opacity-50 cursor-not-allowed grayscale"
              : "hover:bg-indigo-700 active:scale-[0.98]"
          }`}
        >
          {isLoading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 font-medium">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="text-indigo-600 font-bold hover:underline"
        >
          Sign Up
        </Link>
      </p>

      {/* Simplified Footer */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-100"></span>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase">
          <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">
            External Auth
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button className="py-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all font-black text-[10px] uppercase text-slate-600">
          Google
        </button>
        <button className="py-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all font-black text-[10px] uppercase text-slate-600">
          Github
        </button>
      </div>
    </div>
  );
}
