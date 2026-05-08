type PlaylistTrack = {
  id: string;
  title: string;
  artist: string;
  duration: string;
};

export default function SoundPage() {
  const starterTracks: PlaylistTrack[] = [
    { id: "night-drive", title: "Night Drive", artist: "Nova Lane", duration: "3:34" },
    { id: "neon-kicks", title: "Neon Kicks", artist: "Kairo", duration: "2:58" },
    { id: "glow-lights", title: "Glow Lights", artist: "Mira Sol", duration: "4:12" },
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-10 text-[var(--text)] sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6 backdrop-blur sm:p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">Start implementation</p>
        <h1 className="mt-3 font-helvetica-bold text-3xl sm:text-4xl">AI Playlist Maker</h1>
        <p className="mt-3 max-w-2xl text-sm text-white/80 sm:text-base">
          Enter a mood and get a themed starter playlist. This is the first frontend pass and uses local mock results.
        </p>

        <form className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto]">
          <input
            type="text"
            name="mood"
            defaultValue="late-night city ride"
            aria-label="Mood input"
            className="h-11 rounded-full border border-white/15 bg-black/40 px-4 text-sm outline-none ring-[var(--secondary)] transition focus:ring-1"
          />
          <button type="button" className="glass-btn h-11 px-6 text-sm">
            Generate playlist
          </button>
        </form>

        <div className="mt-8 space-y-3">
          {starterTracks.map((track) => (
            <article
              key={track.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3"
            >
              <div>
                <p className="font-medium">{track.title}</p>
                <p className="text-sm text-white/70">{track.artist}</p>
              </div>
              <p className="text-sm text-white/70">{track.duration}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="glass-btn h-10 px-5 text-sm">
            Export to Spotify
          </button>
          <button type="button" className="glass-btn h-10 px-5 text-sm">
            Export to YouTube Music
          </button>
        </div>
      </section>
    </main>
  );
}
