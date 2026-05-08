export default function GalleryPage() {
  const galleryItems = [
    { id: 1, title: "Neon Nights", color: "from-[var(--primary)] to-[var(--accent)]" },
    { id: 2, title: "Urban Flow", color: "from-[var(--secondary)] to-[var(--primary)]" },
    { id: 3, title: "Digital Dreams", color: "from-[var(--accent)] to-[var(--secondary)]" },
    { id: 4, title: "Cyber Wave", color: "from-[var(--primary)] to-[var(--secondary)]" },
    { id: 5, title: "Electric Pulse", color: "from-[var(--secondary)] to-[var(--accent)]" },
    { id: 6, title: "Synthetic Soul", color: "from-[var(--accent)] to-[var(--primary)]" },
    { id: 7, title: "Virtual Reality", color: "from-[var(--primary)] to-[var(--accent)]" },
    { id: 8, title: "Tech Harmony", color: "from-[var(--secondary)] to-[var(--primary)]" },
  ];

  return (
    <main className="relative flex flex-1 overflow-hidden bg-[var(--background)] text-[var(--text)]">
      <div className="relative z-10 mx-auto flex flex-1 w-full flex-col">
        <div className="relative flex flex-1 flex-col justify-start pt-6 sm:pt-10 lg:pt-12">
          {/* Header */}
          <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-helvetica-bold leading-tight tracking-tighter text-[var(--text)]">
              <span className="text-[var(--accent)]">Gallery</span>
            </h1>
          </div>

          {/* Gallery Grid */}
          <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative cursor-pointer overflow-hidden rounded-lg border border-white/10 transition-all duration-300 hover:border-white/30 hover:shadow-lg hover:shadow-[var(--primary)]/20"
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-60 transition-opacity duration-300 group-hover:opacity-80`} />
                  
                  {/* Content */}
                  <div className="relative flex flex-col items-center justify-center h-48 sm:h-56 p-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
        
                    </div>
                    
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
