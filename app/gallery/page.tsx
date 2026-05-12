export default function GalleryPage() {
  const galleryItems = [
    {
      id: 1,
      title: "Neon Nights",
      color: "from-[var(--primary)] to-[var(--accent)]",
      span: "sm:col-span-2 lg:col-span-3 lg:row-span-2",
      badge: "Featured",
    },
    {
      id: 2,
      title: "Urban Flow",
      color: "from-[var(--secondary)] to-[var(--primary)]",
      span: "lg:col-span-2",
    },
    {
      id: 3,
      title: "Digital Dreams",
      color: "from-[var(--accent)] to-[var(--secondary)]",
      span: "lg:row-span-2",
    },
    {
      id: 4,
      title: "Cyber Wave",
      color: "from-[var(--primary)] to-[var(--secondary)]",
      span: "sm:col-span-2 lg:col-span-2",
    },
    {
      id: 5,
      title: "Electric Pulse",
      color: "from-[var(--secondary)] to-[var(--accent)]",
      span: "lg:col-span-2",
    },
    {
      id: 6,
      title: "Synthetic Soul",
      color: "from-[var(--accent)] to-[var(--primary)]",
      span: "lg:row-span-2",
      badge: "New",
    },
    {
      id: 7,
      title: "Virtual Reality",
      color: "from-[var(--primary)] to-[var(--accent)]",
      span: "sm:col-span-2 lg:col-span-3",
    },
    {
      id: 8,
      title: "Tech Harmony",
      color: "from-[var(--secondary)] to-[var(--primary)]",
      span: "lg:col-span-2",
    },
  ];

  return (
    <main className="relative flex flex-1 overflow-hidden bg-[var(--background)] text-[var(--text)]">
      <div className="relative z-10 mx-auto flex flex-1 w-full flex-col">
        <div className="relative flex flex-1 flex-col justify-start pt-6 sm:pt-10 lg:pt-12">
          {/* Header */}
          <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-helvetica-bold leading-tight tracking-tighter text-[var(--text)]">
                  <span className="text-[var(--secondary)]">Gallery</span>
                </h1>
              </div>
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/50">
                <span className="h-px w-10 bg-white/30" />
                <span>Curated</span>
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-6 auto-rows-[12rem] sm:auto-rows-[13rem] lg:auto-rows-[15rem] gap-5 lg:gap-6">
              {galleryItems.map((item) => (
                <article
                  key={item.id}
                  className={`group relative ${item.span} cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-500 hover:border-white/30 hover:shadow-2xl hover:shadow-[var(--primary)]/20 hover:-translate-y-1`}
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-70 transition-opacity duration-500 group-hover:opacity-90`} />

                  {/* Light sweep */}
                  <div className="absolute -left-1/3 top-0 h-full w-1/2 bg-white/10 blur-2xl transition-all duration-700 group-hover:left-2/3" />

                  {/* Content */}
                  <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
                    <div className="flex items-start justify-between">
                      {item.badge ? (
                        <span className="rounded-full border border-white/40 bg-black/20 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-white/80">
                          {item.badge}
                        </span>
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-white/60" />
                      )}
                      <span className="text-xs uppercase tracking-[0.3em] text-white/60">0{item.id}</span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full border border-white/30 bg-white/10 backdrop-blur-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
                        <div className="h-6 w-6 rounded-full border border-white/20 bg-white/5 transition-transform duration-500 group-hover:-translate-y-1" />
                      </div>
                     
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-white/60">
                        <span>Open</span>
                        <span className="flex items-center gap-2">
                          <span className="h-px w-6 bg-white/40" />
                          <span>View</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
