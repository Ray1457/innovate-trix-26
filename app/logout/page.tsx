"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const AUTH_COOKIE = "mock_uber_auth";
const SOUND_LIBRARY_KEY = "sound_playlist_library";
const SOUND_ACTIVE_ID_KEY = "sound_playlist_active_id";
const MERCH_CART_KEY = "uber-jo-cart";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    document.cookie = `${AUTH_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
    try {
      localStorage.removeItem(SOUND_LIBRARY_KEY);
      localStorage.removeItem(SOUND_ACTIVE_ID_KEY);
      localStorage.removeItem(MERCH_CART_KEY);
    } catch {
      // Ignore localStorage errors during logout.
    }
    router.replace("/");
  }, [router]);

  return (
    <main className="min-h-screen bg-black text-white font-['Uber_Move_Text',Arial,sans-serif] flex items-center justify-center px-6">
      <p className="text-sm text-white/70">Signing you out...</p>
    </main>
  );
}
