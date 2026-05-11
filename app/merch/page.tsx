"use client";

import { useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

type MerchColor = {
  name: string;
  hex: string;
};

type MerchItem = {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  stock: number;
  colors: MerchColor[];
  sizes: string[];
  shippingLabel: string;
  imageUrl?: string;
  imageGradient: string;
  isFlagship: boolean;
};

type CartItem = {
  id: string;
  quantity: number;
};

const cartStorageKey = "uber-jo-cart";

const merchItems: MerchItem[] = [
  {
    id: "jujo-hoodie",
    sku: "UBJ-HOOD-JUJO",
    name: "Jujo Hoodie",
    description: "Back-print pullover hoodie with vintage graphic.",
    price: 5999,
    rating: 4.9,
    reviews: 12,
    stock: 24,
    colors: [{ name: "Black", hex: "#0f0f0f" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    shippingLabel: "Ships in 3-5 days",
    imageUrl: "/img/hoodie1.png",
    imageGradient: "from-[#000000] via-[#2b2b2b] to-[#1a1a1a]",
    isFlagship: true,
  },
  {
    id: "glimpse-hoodie",
    sku: "UBJ-HOOD-GLIMPSE",
    name: "Glimpse Hoodie",
    description: "Graphic back hoodie inspired by the Glimpse drop.",
    price: 6499,
    rating: 4.8,
    reviews: 9,
    stock: 18,
    colors: [{ name: "Charcoal", hex: "#2f2436" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    shippingLabel: "Ships in 3-5 days",
    imageUrl: "/img/hoodie2.png",
    imageGradient: "from-[#0b0b0b] via-[#2f2436] to-[#6f5cff]",
    isFlagship: true,
  },
  {
    id: "pulse-tee",
    sku: "UBJ-TEE-PULSE",
    name: "Pulse Runner Tee",
    description: "Breathable mesh-knit tee built for heat-mapped commutes.",
    price: 5199,
    rating: 4.6,
    reviews: 144,
    stock: 0,
    colors: [{ name: "Violet", hex: "#b48cf0" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    shippingLabel: "Coming soon",
    imageGradient: "from-[#e6d8ff] via-[#b48cf0] to-[#542c7f]",
    isFlagship: false,
  },
  {
    id: "night-sling",
    sku: "UBJ-SLING-NIGHT",
    name: "Night Shift Sling",
    description: "Compact carry with modular straps and glow trim.",
    price: 5499,
    rating: 4.7,
    reviews: 87,
    stock: 0,
    colors: [{ name: "Indigo", hex: "#34224a" }],
    sizes: ["One Size"],
    shippingLabel: "Coming soon",
    imageGradient: "from-[#140f20] via-[#34224a] to-[#6f5cff]",
    isFlagship: false,
  },
];

const formatCurrency = (value: number) =>
  `INR ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value)}`;

const isCartItem = (value: unknown): value is CartItem => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "id" in value &&
    "quantity" in value &&
    typeof value.id === "string" &&
    typeof value.quantity === "number" &&
    value.quantity > 0
  );
};

const loadCartItems = (): CartItem[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const saved = window.localStorage.getItem(cartStorageKey);
    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isCartItem);
  } catch {
    return [];
  }
};

export default function MerchPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hasHydratedCart, setHasHydratedCart] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const flagshipItems = useMemo(
    () => merchItems.filter((item) => item.isFlagship).slice(0, 2),
    []
  );
  const comingSoonItems = useMemo(
    () => merchItems.filter((item) => !item.isFlagship).slice(0, 2),
    []
  );
  const gridItems = useMemo(
    () => [...flagshipItems, ...comingSoonItems],
    [flagshipItems, comingSoonItems]
  );

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

  const cartLookup = useMemo(
    () => new Map(cartItems.map((item) => [item.id, item.quantity])),
    [cartItems]
  );

  const totalUnits = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const addToCart = (item: MerchItem) => {
    if (!item.isFlagship || item.stock <= 0) {
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((entry) => entry.id === item.id);
      if (!existing) {
        return [...prev, { id: item.id, quantity: 1 }];
      }

      return prev.map((entry) =>
        entry.id === item.id
          ? { ...entry, quantity: Math.min(entry.quantity + 1, item.stock) }
          : entry
      );
    });
  };

  const updateCartQuantity = (item: MerchItem, delta: number) => {
    setCartItems((prev) =>
      prev.flatMap((entry) => {
        if (entry.id !== item.id) {
          return entry;
        }

        const next = Math.min(entry.quantity + delta, item.stock);
        if (next <= 0) {
          return [];
        }
        return { ...entry, quantity: next };
      })
    );
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)] font-helvetica">
      <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        

        <section className="mt-10 grid gap-12 md:grid-cols-2">
          {gridItems.map((item) => {
            const quantity = cartLookup.get(item.id) ?? 0;
            const atStockLimit = quantity >= item.stock;

            return (
              <article
                key={item.id}
                className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
              >
                <div
                  className={`relative h-96 overflow-hidden rounded-2xl bg-gradient-to-br ${item.imageGradient} p-4`}
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : null}
                  <div className="relative z-10 flex h-full items-end justify-between">
                    <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[0.65rem] uppercase tracking-[0.25em] text-white/90">
                      {item.isFlagship ? "" : "Coming soon"}
                    </span>
                    <span className="text-xs text-white/80">{item.shippingLabel}</span>
                  </div>
                </div>

                <div className="mt-5 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <p className="text-sm font-semibold">{formatCurrency(item.price)}</p>
                  </div>
                  <p className="mt-2 text-sm text-[var(--text)]/70">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6">
                  {item.isFlagship ? (
                    quantity > 0 ? (
                      <div className="flex items-center justify-between rounded-full border border-white/10 bg-black/30 px-3 py-2">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item, -1)}
                          className="h-8 w-8 rounded-full border border-white/20 text-sm text-[var(--text)]/80 transition hover:border-[var(--accent)]/70"
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          -
                        </button>
                        <span className="text-sm font-semibold">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item, 1)}
                          disabled={atStockLimit}
                          className={`h-8 w-8 rounded-full border border-white/20 text-sm text-[var(--text)]/80 transition hover:border-[var(--accent)]/70 ${
                            atStockLimit ? "cursor-not-allowed opacity-60" : ""
                          }`}
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addToCart(item)}
                        className="glass-btn h-11 w-full text-sm font-semibold transition"
                      >
                        Add to cart
                      </button>
                    )
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="h-11 w-full rounded-full border border-white/10 bg-black/20 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--secondary)]/70"
                    >
                      Coming soon
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
