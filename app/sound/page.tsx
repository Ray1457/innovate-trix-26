"use client";

import { FormEvent, useMemo, useState } from "react";

type Track = {
  id: string;
  title: string;
  artist: string;
  duration: string;
};

type Playlist = {
  id: string;
  name: string;
  vibe: string;
  tracks: Track[];
};

const trackPool: Track[] = [
  { id: "pulse-drive", title: "Pulse Drive", artist: "Nova Drift", duration: "3:24" },
  { id: "neon-rain", title: "Neon Rain", artist: "Skyline Echo", duration: "2:58" },
  { id: "moon-loop", title: "Moon Loop", artist: "Cassette Glow", duration: "3:12" },
  { id: "nightlane", title: "Nightlane", artist: "Kairo", duration: "3:42" },
  { id: "city-bloom", title: "City Bloom", artist: "Velvet Orbit", duration: "2:51" },
  { id: "silent-ocean", title: "Silent Ocean", artist: "Astra Hale", duration: "3:35" },
  { id: "ignite", title: "Ignite", artist: "Rhea Volt", duration: "2:47" },
  { id: "afterlight", title: "Afterlight", artist: "Luma Thread", duration: "3:18" },
];

const starterLibrary: Playlist[] = [
  {
    id: "late-night-ride",
    name: "Late Night Ride",
    vibe: "moody synth cruise",
    tracks: trackPool.slice(0, 4),
  },
  {
    id: "morning-boost",
    name: "Morning Boost",
    vibe: "upbeat focus",
    tracks: trackPool.slice(4, 8),
  },
];

const toPlaylistName = (vibe: string) =>
  vibe
    .split(" ")
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ") || "Custom Mix";

export default function SoundPage() {
  const [prompt, setPrompt] = useState("neon city rain drive with emotional drops");
  const [energy, setEnergy] = useState(60);
  const [trackCount, setTrackCount] = useState(10);
  const [generated, setGenerated] = useState<Playlist | null>(null);
  const [library, setLibrary] = useState<Playlist[]>(starterLibrary);

  const suggestedTags = useMemo(
    () => ["night drive", "gym hype", "focus coding", "sunset chill", "rainy retro"],
    []
  );

  const buildPlaylist = (vibePrompt: string, totalTracks: number): Playlist => {
    const normalized = vibePrompt.toLowerCase();
    const rotateBy = normalized.length % trackPool.length;
    const orderedTracks = [...trackPool.slice(rotateBy), ...trackPool.slice(0, rotateBy)];
    const tracks = Array.from({ length: totalTracks }, (_, index) => {
      const track = orderedTracks[index % orderedTracks.length];
      return { ...track, id: `${track.id}-${index}` };
    });

    return {
      id: `generated-${Date.now()}`,
      name: `${toPlaylistName(vibePrompt)} Mix`,
      vibe: vibePrompt,
      tracks,
    };
  };

  const onGenerate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const playlist = buildPlaylist(prompt.trim(), Math.min(Math.max(trackCount, 5), 30));
    setGenerated(playlist);
  };

  const saveGenerated = () => {
    if (!generated) {
      return;
    }
    setLibrary((previous) => [generated, ...previous]);
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)] font-helvetica">
      <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--secondary)]">Sound AI</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
            AI Playlist Maker
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-[var(--text)]/70">
            Describe your vibe and generate a themed playlist instantly. Save it to your
            library and export to your favorite music platform.
          </p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <form
            onSubmit={onGenerate}
            className="rounded-3xl border border-white/10 bg-black/30 p-6"
          >
            <label className="text-xs uppercase tracking-[0.25em] text-[var(--secondary)]" htmlFor="vibe">
              Vibe prompt
            </label>
            <textarea
              id="vibe"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              className="mt-3 h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--accent)]/60"
              placeholder="Ex: futuristic city drive with energetic synthwave"
              required
            />

            <div className="mt-5 flex flex-wrap gap-2">
              {suggestedTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setPrompt(tag)}
                  className="rounded-full border border-white/15 px-3 py-1 text-xs text-[var(--text)]/80 transition hover:border-[var(--accent)]/70"
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="text-sm text-[var(--text)]/80">
                Energy: <span className="font-semibold text-[var(--accent)]">{energy}%</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={energy}
                  onChange={(event) => setEnergy(Number(event.target.value))}
                  className="mt-2 w-full accent-[var(--accent)]"
                />
              </label>

              <label className="text-sm text-[var(--text)]/80" htmlFor="track-count">
                Tracks
                <input
                  id="track-count"
                  type="number"
                  min={5}
                  max={30}
                  value={trackCount}
                  onChange={(event) => setTrackCount(Number(event.target.value))}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[var(--text)] outline-none transition focus:border-[var(--accent)]/60"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="submit" className="glass-btn h-11 px-5 text-sm font-semibold">
                Generate playlist
              </button>
              <button
                type="button"
                onClick={saveGenerated}
                disabled={!generated}
                className="h-11 rounded-full border border-white/15 px-5 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--accent)]/70 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Save to library
              </button>
            </div>
          </form>

          <aside className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-lg font-semibold">Export</h2>
            <p className="mt-2 text-sm text-[var(--text)]/70">
              Connect your account to transfer this playlist.
            </p>
            <div className="mt-4 grid gap-3">
              <button type="button" className="h-11 rounded-full border border-[#1DB954]/50 bg-[#1DB954]/15 px-4 text-sm font-semibold text-[#8df2b5]">
                Export to Spotify
              </button>
              <button type="button" className="h-11 rounded-full border border-[#ff4f4f]/50 bg-[#ff4f4f]/15 px-4 text-sm font-semibold text-[#ffc2c2]">
                Export to YouTube Music
              </button>
            </div>
            <p className="mt-4 text-xs text-[var(--text)]/50">
              Frontend preview mode: export actions are currently UI-only.
            </p>
          </aside>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_1fr]">
          <article className="rounded-3xl border border-white/10 bg-black/30 p-6">
            <h2 className="text-lg font-semibold">Generated playlist</h2>
            {!generated ? (
              <p className="mt-4 text-sm text-[var(--text)]/65">
                Generate a playlist to preview tracks here.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-[var(--secondary)]">{generated.name}</p>
                <p className="text-xs text-[var(--text)]/60">Vibe: {generated.vibe}</p>
                <ul className="mt-3 space-y-2">
                  {generated.tracks.slice(0, 8).map((track, index) => (
                    <li
                      key={track.id}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm"
                    >
                      <span className="text-[var(--text)]/90">
                        {index + 1}. {track.title} - {track.artist}
                      </span>
                      <span className="text-[var(--text)]/50">{track.duration}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>

          <article className="rounded-3xl border border-white/10 bg-black/30 p-6">
            <h2 className="text-lg font-semibold">Your library</h2>
            <p className="mt-2 text-sm text-[var(--text)]/65">
              Spotify-style saved playlists and quick glance stats.
            </p>
            <div className="mt-4 space-y-3">
              {library.map((playlist) => (
                <div
                  key={playlist.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">{playlist.name}</p>
                      <p className="mt-1 text-xs text-[var(--text)]/60">{playlist.vibe}</p>
                    </div>
                    <span className="text-xs text-[var(--accent)]">
                      {playlist.tracks.length} tracks
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
