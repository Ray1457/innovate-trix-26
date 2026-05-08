"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type MerchColor = {
  name: string;
  hex: string;
};

type CartItem = {
  variantKey: string;
  sku: string;
  name: string;
  price: number;
  color: MerchColor;
  size: string;
  quantity: number;
};

const cartStorageKey = "uber-jo-cart";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const loadCartItems = (): CartItem[] => {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const stored = window.localStorage.getItem(cartStorageKey);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setCartItems(loadCartItems());
  }, []);

  const totalUnits = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingEstimate = cartSubtotal >= 75 || cartSubtotal === 0 ? 0 : 8;
  const estimatedTotal = cartSubtotal + shippingEstimate;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)] font-helvetica">
      <div className="mx-auto w-full max-w-5xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--secondary)]">
                Cart
              </p>
              <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
                Your selections
              </h1>
            </div>
            <Link
              href="/merch"
              className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text)] transition hover:border-[var(--accent)]/70"
            >
              Back to merch
            </Link>
          </div>
          <p className="mt-3 text-sm text-[var(--text)]/70">
            Manage colors, sizes, and add-to-cart actions on the merch page.
          </p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {cartItems.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5 text-sm text-[var(--text)]/70">
                Your cart is empty. Pick your favorites on the merch page.
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.variantKey}
                  className="rounded-2xl border border-white/10 bg-black/30 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[var(--text)]">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs text-[var(--text)]/60">
                        Size {item.size} | {item.color.name} | {item.sku}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs text-[var(--secondary)]">
                    <span>Qty {item.quantity}</span>
                    <span
                      className="h-3 w-3 rounded-full border border-white/30"
                      style={{ backgroundColor: item.color.hex }}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          <aside className="h-fit rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Summary</h2>
              <span className="text-xs text-[var(--secondary)]">
                {totalUnits} items
              </span>
            </div>
            <div className="mt-5 space-y-2 text-sm text-[var(--text)]/70">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="text-[var(--text)]">
                  {formatCurrency(cartSubtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Estimated shipping</span>
                <span className="text-[var(--text)]">
                  {shippingEstimate === 0 ? "Free" : formatCurrency(shippingEstimate)}
                </span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold text-[var(--text)]">
                <span>Total</span>
                <span>{formatCurrency(estimatedTotal)}</span>
              </div>
            </div>
            <button type="button" className="glass-btn mt-5 h-11 w-full text-sm font-semibold">
              Checkout
            </button>
            <p className="mt-4 text-xs text-[var(--text)]/50">
              Taxes and duties calculated at fulfillment.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
