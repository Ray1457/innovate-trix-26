"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type MerchItem = {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
  shippingLabel: string;
  imageUrl?: string;
};

type CartItem = {
  id: string;
  quantity: number;
};

const cartStorageKey = "uber-jo-cart";

const formatCurrency = (value: number) =>
  `INR ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value)}`;

const merchItems: MerchItem[] = [
  {
    id: "jujo-hoodie",
    sku: "UBJ-HOOD-JUJO",
    name: "Jujo Hoodie",
    price: 5999,
    stock: 24,
    shippingLabel: "Ships in 3-5 days",
    imageUrl: "/img/hoodie1.png",
  },
  {
    id: "glimpse-hoodie",
    sku: "UBJ-HOOD-GLIMPSE",
    name: "Glimpse Hoodie",
    price: 6499,
    stock: 18,
    shippingLabel: "Ships in 3-5 days",
    imageUrl: "/img/hoodie2.png",
  },
  {
    id: "pulse-tee",
    sku: "UBJ-TEE-PULSE",
    name: "Pulse Runner Tee",
    price: 5199,
    stock: 0,
    shippingLabel: "Coming soon",
  },
  {
    id: "night-sling",
    sku: "UBJ-SLING-NIGHT",
    name: "Night Shift Sling",
    price: 5499,
    stock: 0,
    shippingLabel: "Coming soon",
  },
];

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
  const [hasHydratedCart, setHasHydratedCart] = useState(false);

  useEffect(() => {
    setCartItems(loadCartItems());
    setHasHydratedCart(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !hasHydratedCart) {
      return;
    }
    window.localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
  }, [cartItems, hasHydratedCart]);

  const merchLookup = useMemo(
    () => new Map(merchItems.map((item) => [item.id, item])),
    []
  );

  const resolvedCartItems = useMemo(
    () =>
      cartItems
        .map((entry) => {
          const merch = merchLookup.get(entry.id);
          if (!merch) {
            return null;
          }
          return {
            ...merch,
            quantity: Math.min(entry.quantity, merch.stock || entry.quantity),
          };
        })
        .filter((item): item is MerchItem & { quantity: number } => item !== null),
    [cartItems, merchLookup]
  );

  const totalUnits = resolvedCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = resolvedCartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = totalUnits === 0 ? 0 : 50;
  const estimatedTotal = cartSubtotal + shippingFee;

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCartItems((prev) =>
      prev.flatMap((entry) => {
        if (entry.id !== itemId) {
          return entry;
        }

        const stock = merchLookup.get(itemId)?.stock ?? entry.quantity;
        const maxStock = stock > 0 ? stock : entry.quantity;
        const next = Math.min(entry.quantity + delta, maxStock);

        if (next <= 0) {
          return [];
        }

        return { ...entry, quantity: next };
      })
    );
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((entry) => entry.id !== itemId));
  };

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
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {resolvedCartItems.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5 text-sm text-[var(--text)]/70">
                Your cart is empty. Pick your favorites on the merch page.
              </div>
            ) : (
              resolvedCartItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-black/30 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="h-20 w-20 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--text)]">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs text-[var(--text)]/60">{item.sku}</p>
                        <p className="mt-2 text-xs text-[var(--secondary)]">
                          {item.shippingLabel}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="h-8 w-8 rounded-full border border-white/20 text-sm text-[var(--text)]/80 transition hover:border-[var(--accent)]/70"
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        -
                      </button>
                      <span className="text-xs font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, 1)}
                        disabled={item.stock > 0 && item.quantity >= item.stock}
                        className={`h-8 w-8 rounded-full border border-white/20 text-sm text-[var(--text)]/80 transition hover:border-[var(--accent)]/70 ${
                          item.stock > 0 && item.quantity >= item.stock
                            ? "cursor-not-allowed opacity-60"
                            : ""
                        }`}
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--secondary)]/70 transition hover:text-[var(--accent)]"
                    >
                      Remove
                    </button>
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
                  {shippingFee === 0 ? "Free" : formatCurrency(shippingFee)}
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
