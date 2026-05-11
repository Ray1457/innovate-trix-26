type MerchItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  tag: string;
  imageUrl: string;
  image: {
    label: string;
    gradient: string;
  };
};

type ComingSoonItem = {
  id: string;
  name: string;
  eta: string;
  note: string;
};

const merchData: {
  flagship: MerchItem[];
  comingSoon: ComingSoonItem[];
} = {
  flagship: [
    {
      id: "jujo-hoodie",
      name: "Jujo Hoodie",
      description: "Back-print pullover hoodie with vintage graphic.",
      price: 5999,
      tag: "Drop 04",
      imageUrl: "/img/hoodie1.png",
      image: {
        label: "Jujo Hoodie",
        gradient: "from-[#000000] via-[#2b2b2b] to-[#1a1a1a]",
      },
    },
    {
      id: "glimpse-hoodie",
      name: "Glimpse Hoodie",
      description: "Graphic back hoodie inspired by the Glimpse drop.",
      price: 6499,
      tag: "Limited",
      imageUrl: "/img/hoodie2.png",
      image: {
        label: "Glimpse Hoodie",
        gradient: "from-[#0b0b0b] via-[#2f2436] to-[#6f5cff]",
      },
    },
  ],
  comingSoon: [
    {
      id: "ember-hoodie",
      name: "Ember Ride Hoodie",
      eta: "June 2026",
      note: "Reflective paneling + relaxed drape.",
    },
    {
      id: "night-sling",
      name: "Night Shift Sling",
      eta: "July 2026",
      note: "Glow-trim modular carry.",
    },
  ],
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function MerchPage() {
  const flagshipLoop = [...merchData.flagship, ...merchData.flagship];

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)] font-helvetica">
      <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
          <div className="mx-auto h-[24rem] w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-black/30 sm:h-[28rem] lg:h-[32rem]">

            <div className="hero-slide-track flex h-full">
              {flagshipLoop.map((item, index) => (
                <article
                  key={`${item.id}-${index}`}

                  className="hero-slide group relative h-full min-w-full overflow-hidden rounded-[1.75rem] bg-white/[0.05] ring-1 ring-white/10"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.image.gradient}`}
                  />
                  <img
                    src={item.imageUrl}
                    alt={item.image.label}
                    className="absolute inset-0 h-full w-full object-contain object-center p-6 opacity-95 transition duration-500 group-hover:scale-105 sm:p-8 lg:p-10"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                  <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white">
                    <span className="text-xs uppercase tracking-[0.3em] text-white/70">
                      {item.tag}
                    </span>
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="text-sm font-semibold">
                          {formatCurrency(item.price)}
                        </p>
                      </div>

                      <p className="mt-2 text-xs text-white/70 max-w-md">
                        {item.description}
                      </p>
                      <button
                        type="button"

                        className="mt-4 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-white/90 transition-colors"
                      >
                        Shop now
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
      </div>
    </main>
  );
}

