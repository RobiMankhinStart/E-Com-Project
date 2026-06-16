"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/app/lib/apiClient";

export default function OtpVerificationPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Timer for Resend OTP (60 seconds)
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Handle the countdown timer
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleInputChange = (value) => {
    // Only allow numbers and max 6 digits (adjust length based on your backend)
    const sanitizedValue = value.replace(/\D/g, "").slice(0, 6);
    setOtp(sanitizedValue);
    if (error) setError("");
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const email = window.localStorage.getItem("tempEmail") || "";
    if (!email) {
      setError("Email is missing. Please sign up again.");
      return;
    }
    if (otp.length < 4) {
      setError("Please enter the full code.");
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post("/auth/verifyotp", { otp, email });
      alert("Email verified successfully!");
      router.push("/signin");
    } catch (err) {
      setIsLoading(false);
      const message = err?.message || "Verification failed";
      setError(message);
      alert(message);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    const email = window.localStorage.getItem("tempEmail") || "";
    if (!email) {
      alert("Email is missing. Please sign up again.");
      return;
    }

    try {
      await apiClient.post("/auth/resendotp", { email });
      alert("A new code has been sent to your email.");
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      const message = err?.message || "Failed to resend code.";
      alert(message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header>
        <h3 className="font-sans text-3xl font-black tracking-tight mb-2 text-slate-900">
          Verify Email
        </h3>
        <p className="text-slate-500 text-sm font-medium">
          Enter the 6-digit code sent to your inbox.
        </p>
      </header>

      <form onSubmit={handleVerify} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
            Verification Code
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => handleInputChange(e.target.value)}
            disabled={isLoading}
            placeholder="0 0 0 0 0 0"
            className={`w-full bg-slate-50 rounded-2xl px-4 py-5 text-center text-2xl font-black tracking-[1em] text-slate-700 outline-none transition-all ${
              error
                ? "ring-2 ring-rose-500/20 bg-rose-50/50"
                : "focus:ring-2 focus:ring-indigo-500/10 focus:bg-white"
            }`}
          />
          {error && (
            <p className="text-[11px] font-bold text-rose-500 text-center animate-in fade-in">
              {error}
            </p>
          )}
        </div>

        <button
          disabled={isLoading}
          className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isLoading ? "Verifying..." : "Verify Code"}
        </button>
      </form>

      <div className="text-center space-y-4">
        <p className="text-sm text-slate-500 font-medium">
          Didn't receive a code?{" "}
          <button
            onClick={handleResendOtp}
            disabled={!canResend}
            className={`font-bold transition-colors ${
              canResend
                ? "text-indigo-600 hover:underline"
                : "text-slate-300 cursor-not-allowed"
            }`}
          >
            Resend Code {!canResend && `(${timer}s)`}
          </button>
        </p>

        <Link
          href="/signup"
          className="block text-[10px] uppercase font-black text-slate-400 hover:text-slate-600 transition-colors"
        >
          Back to Signup
        </Link>
      </div>
    </div>
  );
}
