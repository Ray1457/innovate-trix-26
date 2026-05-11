"use client";

import { useEffect, useState } from "react";

type MerchColor = {
  name: string;
  hex: string;
};

type MerchItem = {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  description: string;
  releasedAt: string;
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  colors: MerchColor[];
  sizes: string[];
  stock: number;
  tags: string[];
  shipping: {
    label: string;
    cost: number;
  };
  image: {
    label: string;
    gradient: string;
  };
};

type MerchSelection = {
  color: MerchColor;
  size: string;
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

const merchData = {
  hero: {
    eyebrow: "Uber-Jo Merch",
    title: "Ride-ready essentials for every journey.",
    subtitle:
      "Curated drops built for night rides, sunrise sprints, and everything between. Every piece is ready for future fulfillment hooks.",
    ctaPrimary: "Shop the drop",
    ctaSecondary: "View lookbook",
  },
  highlights: [
    { label: "Drop 04", value: "City pulse collection" },
    { label: "Limited", value: "2,400 units total" },
    { label: "Sustainable", value: "Recycled blends" },
  ],
  policies: [
    { label: "Shipping", value: "Free over $75" },
    { label: "Returns", value: "30-day easy swaps" },
    { label: "Support", value: "24/7 rider care" },
  ],
  categories: [
    { id: "all", label: "All items" },
    { id: "apparel", label: "Apparel" },
    { id: "gear", label: "Gear" },
    { id: "collectibles", label: "Collectibles" },
    { id: "audio", label: "Audio" },
  ],
  sortOptions: [
    { id: "featured", label: "Featured" },
    { id: "price-low", label: "Price: Low to High" },
    { id: "price-high", label: "Price: High to Low" },
    { id: "rating", label: "Top Rated" },
    { id: "newest", label: "Newest Arrivals" },
  ],
  items: [
    {
      id: "jujo-hoodie",
      sku: "UBJ-HOOD-JUJO",
      name: "Jujo Hoodie",
      categoryId: "apparel",
      description: "Back-print pullover hoodie with vintage graphic.",
      releasedAt: "2026-05-06",
      price: 5999,
      rating: 4.9,
      reviews: 12,
      colors: [],
      sizes: ["XS", "S", "M", "L", "XL"],
      stock: 24,
      tags: ["New"],
      shipping: { label: "Ships in 3-5 days", cost: 0 },
      imageUrl: "/img/hoodie1.png",
      image: {
        label: "Jujo Hoodie",
        gradient: "from-[#000000] via-[#2b2b2b] to-[#1a1a1a]",
      },
    },
    {
      id: "glimpse-hoodie",
      sku: "UBJ-HOOD-GLIMPSE",
      name: "Glimpse Hoodie",
      categoryId: "apparel",
      description: "Graphic back hoodie inspired by the Glimpse drop.",
      releasedAt: "2026-05-06",
      price: 6499,
      rating: 4.8,
      reviews: 9,
      colors: [],
      sizes: ["XS", "S", "M", "L", "XL"],
      stock: 18,
      tags: ["New"],
      shipping: { label: "Ships in 3-5 days", cost: 0 },
      imageUrl: "/img/hoodie2.png",
      image: {
        label: "Glimpse Hoodie",
        gradient: "from-[#0b0b0b] via-[#2f2436] to-[#6f5cff]",
      },
    },
    {
      id: "ember-hoodie",
      sku: "UBJ-HOOD-EMBER",
      name: "Ember Ride Hoodie",
      categoryId: "apparel",
      description: "Ultra-soft fleece with reflective paneling and a relaxed drape.",
      releasedAt: "2026-04-14",
      price: 5799,
      compareAt: 6999,
      rating: 4.8,
      reviews: 218,
      colors: [],
      sizes: ["XS", "S", "M", "L", "XL"],
      stock: 0,
      tags: ["Best seller", "Limited"],
      shipping: { label: "Coming soon", cost: 0 },
      image: {
        label: "Hoodie",
        gradient: "from-[#1a0f2f] via-[#3b1a52] to-[#a84b97]",
      },
    },
    {
      id: "pulse-tee",
      sku: "UBJ-TEE-PULSE",
      name: "Pulse Runner Tee",
      categoryId: "apparel",
      description: "Breathable mesh-knit tee built for heat-mapped commutes.",
      releasedAt: "2026-05-02",
      price: 5199,
      rating: 4.6,
      reviews: 144,
      colors: [],
      sizes: ["XS", "S", "M", "L", "XL"],
      stock: 0,
      tags: ["New"],
      shipping: { label: "Coming soon", cost: 6 },
      image: {
        label: "Tee",
        gradient: "from-[#e6d8ff] via-[#b48cf0] to-[#542c7f]",
      },
    },
    {
      id: "night-sling",
      sku: "UBJ-SLING-NIGHT",
      name: "Night Shift Sling",
      categoryId: "gear",
      description: "Compact carry with modular straps and glow trim.",
      releasedAt: "2026-03-27",
      price: 5499,
      rating: 4.7,
      reviews: 87,
      colors: [],
      sizes: ["One Size"],
      stock: 0,
      tags: ["Gear pick"],
      shipping: { label: "Coming soon", cost: 0 },
      image: {
        label: "Sling",
        gradient: "from-[#140f20] via-[#34224a] to-[#6f5cff]",
      },
    },
    {
      id: "ride-bottle",
      sku: "UBJ-BTL-RIDE",
      name: "Ride Light Bottle",
      categoryId: "gear",
      description: "Insulated bottle with LED hydration cues and soft-touch grip.",
      releasedAt: "2026-02-19",
      price: 5299,
      rating: 4.5,
      reviews: 65,
      colors: [],
      sizes: ["20oz"],
      stock: 0,
      tags: ["Restock soon"],
      shipping: { label: "Coming soon", cost: 0 },
      image: {
        label: "Bottle",
        gradient: "from-[#dff5ff] via-[#9b9dff] to-[#5f47ff]",
      },
    },
    {
      id: "capsule-pin",
      sku: "UBJ-PIN-CAPSULE",
      name: "Capsule Enamel Pin Set",
      categoryId: "collectibles",
      description: "Three-piece pin set with ride map etchings and matte enamel.",
      releasedAt: "2026-04-28",
      price: 5399,
      rating: 4.9,
      reviews: 312,
      colors: [],
      sizes: ["Set of 3"],
      stock: 0,
      tags: ["Collector"],
      shipping: { label: "Coming soon", cost: 5 },
      image: {
        label: "Pins",
        gradient: "from-[#1c103b] via-[#602c82] to-[#f1b6ff]",
      },
    },
    {
      id: "aurora-speaker",
      sku: "UBJ-SPKR-AURORA",
      name: "Aurora Ride Speaker",
      categoryId: "audio",
      description: "Pocket speaker with spatial bass tuned for open-air rides.",
      releasedAt: "2026-05-06",
      price: 6999,
      compareAt: 7999,
      rating: 4.4,
      reviews: 59,
      colors: [],
      sizes: ["One Size"],
      stock: 0,
      tags: ["Limited", "Tech"],
      shipping: { label: "Coming soon", cost: 0 },
      image: {
        label: "Speaker",
        gradient: "from-[#e5efff] via-[#8ea1ff] to-[#3e3fa4]",
      },
    },
  ],
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
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

export default function MerchPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const getDefaultSelection = (item: MerchItem): MerchSelection => ({
    color: item.colors[0] ?? { name: "Default", hex: "#000000" },
    size: item.sizes[0] ?? "One Size",
  });

  useEffect(() => {
    setCartItems(loadCartItems());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
  }, [cartItems]);

  const totalUnits = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const getVariantKey = (item: MerchItem, selection: MerchSelection) =>
    `${item.id}-${selection.size}-${selection.color.name}`;

  const addToCart = (item: MerchItem) => {
    if (item.stock <= 0) {
      return;
    }
    const selection = getDefaultSelection(item);
    const variantKey = getVariantKey(item, selection);
    setCartItems((prev) => {
      const existing = prev.find((cartItem) => cartItem.variantKey === variantKey);
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.variantKey === variantKey
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [
        ...prev,
        {
          variantKey,
          sku: item.sku,
          name: item.name,
          price: item.price,
          color: selection.color,
          size: selection.size,
          quantity: 1,
        },
      ];
    });
  };

  const updateCartQuantity = (variantKey: string, delta: number) => {
    setCartItems((prev) =>
      prev.flatMap((item) => {
        if (item.variantKey !== variantKey) {
          return item;
        }
        const nextQuantity = item.quantity + delta;
        if (nextQuantity <= 0) {
          return [];
        }
        return { ...item, quantity: nextQuantity };
      })
    );
  };

  const flagshipItems = merchData.items.filter((item) => item.stock > 0).slice(0, 2);
  const comingSoonItems = merchData.items
    .filter((item) => item.stock <= 0)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)] font-helvetica">
      <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 backdrop-blur sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--secondary)]">
                {merchData.hero.eyebrow}
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-[var(--text)] sm:text-4xl">
                {merchData.hero.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-[var(--text)]/70">
                {merchData.hero.subtitle}
              </p>
            </div>
            <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs uppercase tracking-[0.25em] text-[var(--secondary)]">
              {totalUnits} in cart
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-[var(--secondary)]">
            {merchData.highlights.map((highlight) => (
              <span
                key={highlight.label}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1"
              >
                {highlight.label}: {highlight.value}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-12 lg:auto-rows-[220px]">
          {flagshipItems.map((item, index) => {
            const selection = getDefaultSelection(item);
            const variantKey = getVariantKey(item, selection);
            const cartItem = cartItems.find(
              (entry) => entry.variantKey === variantKey
            );
            const quantity = cartItem?.quantity ?? 0;
            const isSoldOut = item.stock <= 0;
            const span =
              index === 0
                ? "lg:col-span-7 lg:row-span-2"
                : "lg:col-span-5 lg:row-span-2";

            return (
              <article
                key={item.id}
                className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition duration-300 ease-out hover:-translate-y-1 hover:border-white/20 ${span}`}
              >
                <div
                  className={`relative flex flex-1 items-end justify-between overflow-hidden rounded-2xl bg-gradient-to-br ${item.image.gradient} p-4`}
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.image.label}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : null}
                  <div className="relative z-10 flex w-full items-end justify-between">
                    <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[0.65rem] uppercase tracking-[0.35em] text-white/80">
                      Flagship
                    </span>
                    <span className="text-xs text-white/70">
                      {item.shipping.label}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-semibold text-[var(--text)]">
                      {item.name}
                    </h3>
                    <div className="text-right text-sm font-semibold text-[var(--text)]">
                      {formatCurrency(item.price)}
                      {item.compareAt ? (
                        <p className="text-xs text-[var(--text)]/50 line-through">
                          {formatCurrency(item.compareAt)}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-[var(--text)]/70">
                    {item.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-[var(--secondary)]">
                    <span>
                      Rating {item.rating.toFixed(1)} ({item.reviews})
                    </span>
                    <span>{item.stock} left</span>
                  </div>
                </div>

                <div className="mt-5">
                  {quantity > 0 ? (
                    <div className="flex items-center justify-between rounded-full border border-white/10 bg-black/30 px-3 py-2">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(variantKey, -1)}
                        className="h-8 w-8 rounded-full border border-white/20 text-sm text-[var(--text)]/80 transition hover:border-[var(--accent)]/70"
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        -
                      </button>
                      <span className="text-sm font-semibold">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(variantKey, 1)}
                        disabled={isSoldOut}
                        className={`h-8 w-8 rounded-full border border-white/20 text-sm text-[var(--text)]/80 transition hover:border-[var(--accent)]/70 ${
                          isSoldOut ? "cursor-not-allowed opacity-60" : ""
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
                      disabled={isSoldOut}
                      className={`glass-btn h-11 w-full text-sm font-semibold transition ${
                        isSoldOut ? "cursor-not-allowed opacity-60" : ""
                      }`}
                    >
                      {isSoldOut ? "Notify me" : "Add to cart"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}

          {comingSoonItems.map((item) => (
            <article
              key={item.id}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur transition duration-300 ease-out hover:-translate-y-1 hover:border-white/20 lg:col-span-4"
            >
              <div
                className={`relative flex h-32 items-end justify-between overflow-hidden rounded-2xl bg-gradient-to-br ${item.image.gradient} p-3`}
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.image.label}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : null}
                <span className="relative z-10 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[0.6rem] uppercase tracking-[0.35em] text-white/80">
                  Coming soon
                </span>
                <span className="relative z-10 text-[0.65rem] text-white/70">
                  {item.shipping.label}
                </span>
              </div>
              <div className="mt-4 flex-1">
                <h3 className="text-base font-semibold text-[var(--text)]">
                  {item.name}
                </h3>
                <p className="mt-2 text-xs text-[var(--text)]/70">
                  {item.description}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-[var(--secondary)]">
                  <span>
                    Rating {item.rating.toFixed(1)} ({item.reviews})
                  </span>
                  <span>{formatCurrency(item.price)}</span>
                </div>
              </div>
              <button
                type="button"
                disabled
                className="mt-4 h-10 w-full rounded-full border border-white/10 bg-black/20 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--secondary)]/70"
              >
                Coming soon
              </button>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
