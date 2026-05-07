"use client";

import { useMemo, useState } from "react";

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
      id: "ember-hoodie",
      sku: "UBJ-HOOD-EMBER",
      name: "Ember Ride Hoodie",
      categoryId: "apparel",
      description: "Ultra-soft fleece with reflective paneling and a relaxed drape.",
      price: 82,
      compareAt: 96,
      rating: 4.8,
      reviews: 218,
      colors: [
        { name: "Night", hex: "#1c1630" },
        { name: "Ember", hex: "#a83b88" },
        { name: "Plum", hex: "#533b7f" },
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
      stock: 14,
      tags: ["Best seller", "Limited"],
      shipping: { label: "Ships in 3-5 days", cost: 0 },
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
      price: 46,
      rating: 4.6,
      reviews: 144,
      colors: [
        { name: "Quartz", hex: "#e2d5ff" },
        { name: "Midnight", hex: "#2e2349" },
        { name: "Lavender", hex: "#b07cf6" },
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
      stock: 32,
      tags: ["New"],
      shipping: { label: "Ships in 2-4 days", cost: 6 },
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
      price: 68,
      rating: 4.7,
      reviews: 87,
      colors: [
        { name: "Onyx", hex: "#14131d" },
        { name: "Glow", hex: "#6f5cff" },
      ],
      sizes: ["One Size"],
      stock: 18,
      tags: ["Gear pick"],
      shipping: { label: "Ships tomorrow", cost: 0 },
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
      price: 32,
      rating: 4.5,
      reviews: 65,
      colors: [
        { name: "Frost", hex: "#d9f2ff" },
        { name: "Violet", hex: "#7c58ff" },
      ],
      sizes: ["20oz"],
      stock: 0,
      tags: ["Restock soon"],
      shipping: { label: "Backorder", cost: 0 },
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
      price: 24,
      rating: 4.9,
      reviews: 312,
      colors: [
        { name: "Galaxy", hex: "#1d1145" },
        { name: "Halo", hex: "#f2b5ff" },
      ],
      sizes: ["Set of 3"],
      stock: 40,
      tags: ["Collector"],
      shipping: { label: "Ships in 3 days", cost: 5 },
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
      price: 112,
      compareAt: 134,
      rating: 4.4,
      reviews: 59,
      colors: [
        { name: "Polar", hex: "#e7f0ff" },
        { name: "Indigo", hex: "#3741a3" },
      ],
      sizes: ["One Size"],
      stock: 7,
      tags: ["Limited", "Tech"],
      shipping: { label: "Ships in 5-7 days", cost: 0 },
      image: {
        label: "Speaker",
        gradient: "from-[#e5efff] via-[#8ea1ff] to-[#3e3fa4]",
      },
    },
  ],
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export default function MerchPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [freeShippingOnly, setFreeShippingOnly] = useState(false);
  const [selections, setSelections] = useState<Record<string, MerchSelection>>(() =>
    merchData.items.reduce<Record<string, MerchSelection>>((acc, item) => {
      acc[item.id] = {
        color: item.colors[0],
        size: item.sizes[0],
      };
      return acc;
    }, {})
  );
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const categoryCounts = useMemo(() => {
    return merchData.categories.reduce<Record<string, number>>((acc, category) => {
      if (category.id === "all") {
        acc[category.id] = merchData.items.length;
        return acc;
      }
      acc[category.id] = merchData.items.filter(
        (item) => item.categoryId === category.id
      ).length;
      return acc;
    }, {});
  }, []);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const items = merchData.items.filter((item) => {
      if (activeCategory !== "all" && item.categoryId !== activeCategory) {
        return false;
      }
      if (onlyInStock && item.stock <= 0) {
        return false;
      }
      if (freeShippingOnly && item.shipping.cost > 0) {
        return false;
      }
      if (!query) {
        return true;
      }
      return (
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    });

    const sorted = [...items];
    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        sorted.sort((a, b) => b.stock - a.stock);
        break;
      default:
        break;
    }
    return sorted;
  }, [activeCategory, freeShippingOnly, onlyInStock, searchQuery, sortBy]);

  const totalUnits = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingEstimate = cartSubtotal >= 75 || cartSubtotal === 0 ? 0 : 8;
  const estimatedTotal = cartSubtotal + shippingEstimate;

  const updateSelection = (id: string, nextSelection: Partial<MerchSelection>) => {
    setSelections((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...nextSelection,
      },
    }));
  };

  const addToCart = (item: MerchItem) => {
    if (item.stock <= 0) {
      return;
    }
    const selection = selections[item.id];
    const variantKey = `${item.id}-${selection.size}-${selection.color.name}`;
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

  const removeCartItem = (variantKey: string) => {
    setCartItems((prev) => prev.filter((item) => item.variantKey !== variantKey));
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)] font-helvetica">
      <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--secondary)]">
              {merchData.hero.eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-helvetica-bold leading-tight text-[var(--text)] sm:text-5xl lg:text-6xl">
              {merchData.hero.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base text-[var(--text)]/75">
              {merchData.hero.subtitle}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                className="glass-btn h-10 px-6 text-sm font-semibold"
              >
                {merchData.hero.ctaPrimary}
              </button>
              <button
                type="button"
                className="h-10 rounded-full border border-white/15 px-6 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--accent)]/70"
              >
                {merchData.hero.ctaSecondary}
              </button>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {merchData.highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur"
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-[var(--secondary)]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Find your fit</p>
              <span className="text-xs text-[var(--secondary)]">
                {filteredItems.length} items
              </span>
            </div>
            <label className="mt-4 flex items-center gap-3 rounded-full border border-white/10 px-4 py-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--secondary)]">
                Search
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Hoodie, gear, pins..."
                className="flex-1 bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--text)]/40 focus:outline-none"
              />
            </label>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-xs uppercase tracking-[0.2em] text-[var(--secondary)]">
                Sort
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="mt-2 w-full rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-[var(--text)] focus:outline-none"
                >
                  {merchData.sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm text-[var(--text)]/80">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(event) => setOnlyInStock(event.target.checked)}
                    className="h-4 w-4 rounded border-white/30 bg-black/60 text-[var(--accent)] focus:ring-[var(--accent)]"
                  />
                  In stock only
                </label>
                <label className="flex items-center gap-2 text-sm text-[var(--text)]/80">
                  <input
                    type="checkbox"
                    checked={freeShippingOnly}
                    onChange={(event) => setFreeShippingOnly(event.target.checked)}
                    className="h-4 w-4 rounded border-white/30 bg-black/60 text-[var(--accent)] focus:ring-[var(--accent)]"
                  />
                  Free shipping
                </label>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--secondary)]">
                Fulfillment
              </p>
              <div className="mt-3 space-y-2 text-sm text-[var(--text)]/80">
                {merchData.policies.map((policy) => (
                  <div key={policy.label} className="flex items-center justify-between">
                    <span>{policy.label}</span>
                    <span className="text-[var(--text)]">{policy.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="flex flex-wrap gap-2">
              {merchData.categories.map((category) => {
                const isActive = category.id === activeCategory;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                      isActive
                        ? "border-[var(--accent)]/80 bg-[var(--accent)]/15 text-[var(--text)]"
                        : "border-white/10 text-[var(--text)]/70 hover:border-[var(--accent)]/60"
                    }`}
                  >
                    {category.label}
                    <span className="ml-2 text-[var(--secondary)]">
                      {categoryCounts[category.id] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => {
                const selection = selections[item.id];
                const isSoldOut = item.stock <= 0;
                return (
                  <article
                    key={item.id}
                    className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                  >
                    <div
                      className={`relative flex h-40 items-end justify-between overflow-hidden rounded-2xl bg-gradient-to-br ${item.image.gradient} p-4`}
                    >
                      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
                        {item.image.label}
                      </span>
                      <span className="text-xs text-white/70">
                        {isSoldOut ? "Sold out" : `${item.stock} left`}
                      </span>
                    </div>
                    <div className="mt-4 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-semibold text-[var(--text)]">
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
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--secondary)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between text-xs text-[var(--secondary)]">
                        <span>
                          {item.rating.toFixed(1)} ★ ({item.reviews})
                        </span>
                        <span>{item.shipping.label}</span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--secondary)]">
                          Color
                        </p>
                        <div className="mt-2 flex gap-2">
                          {item.colors.map((color) => {
                            const isActive = selection.color.name === color.name;
                            return (
                              <button
                                key={color.name}
                                type="button"
                                onClick={() => updateSelection(item.id, { color })}
                                className={`h-8 w-8 rounded-full border transition ${
                                  isActive
                                    ? "border-[var(--accent)]/80 ring-2 ring-[var(--accent)]/50"
                                    : "border-white/20 hover:border-[var(--accent)]/60"
                                }`}
                                style={{ backgroundColor: color.hex }}
                                aria-label={`Select ${color.name} color`}
                              />
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--secondary)]">
                          Size
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {item.sizes.map((size) => {
                            const isActive = selection.size === size;
                            return (
                              <button
                                key={size}
                                type="button"
                                onClick={() => updateSelection(item.id, { size })}
                                className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] transition ${
                                  isActive
                                    ? "border-[var(--accent)]/80 bg-[var(--accent)]/20 text-[var(--text)]"
                                    : "border-white/15 text-[var(--text)]/70 hover:border-[var(--accent)]/60"
                                }`}
                              >
                                {size}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => addToCart(item)}
                        disabled={isSoldOut}
                        className={`glass-btn h-10 w-full text-sm font-semibold ${
                          isSoldOut ? "cursor-not-allowed opacity-60" : ""
                        }`}
                      >
                        {isSoldOut ? "Notify me" : "Add to cart"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <aside className="h-fit rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur lg:sticky lg:top-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Cart</h2>
              <span className="text-xs text-[var(--secondary)]">
                {totalUnits} items
              </span>
            </div>
            {cartItems.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-[var(--text)]/70">
                Your cart is empty. Add a drop to reserve your fit.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.variantKey}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{item.name}</p>
                        <p className="text-xs text-[var(--text)]/60">
                          {item.size} · {item.color.name} · {item.sku}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCartItem(item.variantKey)}
                        className="text-xs uppercase tracking-[0.2em] text-[var(--secondary)] hover:text-[var(--accent)]"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.variantKey, -1)}
                          className="h-7 w-7 rounded-full border border-white/20 text-sm text-[var(--text)]/80 hover:border-[var(--accent)]/70"
                        >
                          -
                        </button>
                        <span className="text-sm font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.variantKey, 1)}
                          className="h-7 w-7 rounded-full border border-white/20 text-sm text-[var(--text)]/80 hover:border-[var(--accent)]/70"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-semibold">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 space-y-2 text-sm text-[var(--text)]/70">
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
            <button
              type="button"
              className="glass-btn mt-5 h-11 w-full text-sm font-semibold"
            >
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
