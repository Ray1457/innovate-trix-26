"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const AUTH_COOKIE = "mock_uber_auth";

export default function UberLoginModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const safeNext = nextParam && nextParam.startsWith("/") ? nextParam : "/account";

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleLogin = () => {
    document.cookie = `${AUTH_COOKIE}=1; Path=/; Max-Age=86400; SameSite=Lax`;
    // router.push(safeNext);
    window.location.href = safeNext;
  };

  const handleClose = () => {
    router.push("/");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 font-['Uber_Move_Text',Arial,sans-serif] text-white">
      <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-[#0b0b0b] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.32em] text-white/60">Uber</span>
          <button
            type="button"
            onClick={handleClose}
            className="text-xs uppercase tracking-[0.3em] text-white/60 transition hover:text-white"
          >
            Close
          </button>
        </div>

        <h2 className="mt-4 text-xl font-semibold font-['Uber_Move',Arial,sans-serif]">
          Login with Uber
        </h2>
        <p className="mt-2 text-sm text-white/70">Continue to your account.</p>

        <button
          type="button"
          onClick={handleLogin}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/20 bg-black px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/40"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-semibold text-black">
            U
          </span>
          Login with Uber
        </button>
      </div>
    </div>
  );
}
