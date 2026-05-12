"use client";

import { useEffect, useMemo, useState } from "react";
import {
  IoArrowDownCircleOutline,
  IoLogoYoutube,
  IoPause,
  IoSyncOutline,
} from "react-icons/io5";

import { FaSpotify } from "react-icons/fa";

type PlaylistTrack = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  posterUrl: string;
};

type Playlist = {
  id: string;
  name: string;
  mood: string;
  time_of_day: string;
  energy: number;
  totalDuration: string;
  tracks: PlaylistTrack[];
};

type WizardStep = 1 | 2 | 3;
type Screen = "library" | "wizard" | "playlist";

const moodOptions = [
  "Reflective",
  "Calm",
  "Focused",
  "Energized",
  "Unwind",
  "Relax",
  "Chill",
  "Recharge",
  "Romantic",
];

const timeOfDayOptions = ["Morning", "Afternoon", "Evening", "Night"];

const coverTileTransforms = [
  "translate-y-1 -rotate-6",
  "-translate-y-2 rotate-6",
  "translate-y-3 rotate-3",
  "-translate-y-1 -rotate-4",
];

const STORAGE_KEYS = {
  library: "sound_playlist_library",
  activePlaylistId: "sound_playlist_active_id",
} as const;

// Client-visible API URL (set via NEXT_PUBLIC_API_BASE_URL environment variable)
const PLAYLIST_API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://innovate-trix-back.vercel.app"}/playlist`;

const FALLBACK_POSTER_URL = "https://placehold.co/160x160?text=Sound";
const FALLBACK_TRACK_DURATION_MS = 2 * 60 * 1000;

const sanitizeFileName = (value: string) =>
  value
    .toLowerCase()
    .replace(/["'`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const escapeCsvValue = (value: string) => {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
};

const downloadTextFile = (fileName: string, content: string) => {
  const fileBlob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const downloadUrl = URL.createObjectURL(fileBlob);
  const anchor = document.createElement("a");

  anchor.href = downloadUrl;
  anchor.download = fileName;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(downloadUrl);
  }, 0);
};

const downloadPlaylistCsv = (playlist: Playlist) => {
  const csvRows = [
    ["Song Name", "Artist", "Duration"],
    ...playlist.tracks.map(({ title, artist, duration }) => [
      title,
      artist,
      duration,
    ]),
  ];

  const csvContent = csvRows
    .map((row) => row.map((cell) => escapeCsvValue(cell)).join(","))
    .join("\r\n");
  const fileName = `${sanitizeFileName(playlist.name) || "playlist"}.csv`;

  downloadTextFile(fileName, csvContent);
};

const hashString = (value: string) => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
};

const getCoverPalette = (playlist: Playlist) => {
  const timeOfDayHue: Record<string, number> = {
    Morning: 32,
    Afternoon: 188,
    Evening: 286,
    Night: 226,
  };
  const seed = hashString(
    `${playlist.id}-${playlist.mood}-${playlist.time_of_day}-${playlist.energy}`
  );
  const baseHue = (timeOfDayHue[playlist.time_of_day] ?? 220) + (seed % 24);
  const accentHue = (baseHue + 58 + Math.round(playlist.energy / 3)) % 360;
  const glowHue = (baseHue + 170) % 360;
  const pulseHue = (baseHue + 120) % 360;

  return {
    backgroundColor: `hsl(${(baseHue + 12) % 360} 36% 10%)`,
    backgroundImage: `radial-gradient(circle at 12% 18%, hsla(${accentHue}, 96%, 68%, 0.30), transparent 28%), radial-gradient(circle at 86% 24%, hsla(${glowHue}, 92%, 65%, 0.24), transparent 26%), radial-gradient(circle at 50% 88%, hsla(${pulseHue}, 90%, 60%, 0.18), transparent 32%), linear-gradient(145deg, hsl(${baseHue} 48% 18%) 0%, hsl(${(baseHue + 20) % 360} 44% 14%) 42%, hsl(${glowHue} 44% 9%) 100%)`,
    glowOne: `hsla(${accentHue}, 96%, 68%, 0.45)`,
    glowTwo: `hsla(${glowHue}, 92%, 65%, 0.38)`,
    glowThree: `hsla(${pulseHue}, 90%, 60%, 0.30)`,
  };
};

type PlaylistCoverProps = {
  playlist: Playlist;
};

function PlaylistCover({ playlist }: PlaylistCoverProps) {
  const palette = getCoverPalette(playlist);
  const fallbackTrack: PlaylistTrack = {
    id: `${playlist.id}-fallback`,
    title: playlist.name,
    artist: playlist.mood,
    album: `${playlist.time_of_day} set`,
    duration: playlist.totalDuration,
    posterUrl: FALLBACK_POSTER_URL,
  };
  const coverTracks = Array.from({ length: 4 }, (_, index) =>
    playlist.tracks[index] ?? fallbackTrack
  );

  return (
    <div
      className="relative isolate overflow-hidden rounded-[2rem] border border-white/10 p-4 shadow-2xl shadow-black/30 sm:p-5"
      style={{
        backgroundColor: palette.backgroundColor,
        backgroundImage: palette.backgroundImage,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_45%)]" />
      <div className="absolute inset-0 opacity-85">
        <div
          className="absolute left-[-8%] top-[-10%] h-44 w-44 rounded-full blur-3xl"
          style={{ background: palette.glowOne }}
        />
        <div
          className="absolute right-[-10%] top-[18%] h-56 w-56 rounded-full blur-3xl"
          style={{ background: palette.glowTwo }}
        />
        <div
          className="absolute inset-x-[18%] bottom-[-18%] h-36 rounded-full blur-3xl"
          style={{ background: palette.glowThree }}
        />
      </div>

      <div className="relative grid h-[18rem] grid-cols-2 grid-rows-2 gap-2 sm:h-[22rem] sm:gap-3">
        {coverTracks.map((track, index) => (
          <div
            key={`${track.id}-${index}`}
            className={`group relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/10 shadow-2xl ${coverTileTransforms[index]}`}
          >
            <img
              src={track.posterUrl}
              alt={`${track.title} artwork`}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="text-[10px] uppercase tracking-[0.35em] text-white/50">
                Track {index + 1}
              </p>
              <p className="mt-1 truncate text-sm font-semibold text-white">
                {track.title}
              </p>
              <p className="mt-1 truncate text-xs text-white/70">{track.artist}</p>
            </div>
          </div>
        ))}

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4">
          <div className="relative flex w-full max-w-[16rem] flex-col items-center rounded-[2rem] border border-white/15 bg-black/50 px-5 py-5 text-center shadow-2xl backdrop-blur-2xl sm:max-w-[18rem] sm:px-6 sm:py-6">
            <div className="absolute inset-3 rounded-[1.5rem] border border-white/10" />
            <p className="text-[11px] uppercase tracking-[0.4em] text-white/55">
              Soundscape
            </p>
            <h2 className="mt-3 text-2xl font-semibold leading-[0.95] text-white sm:text-3xl">
              {playlist.name}
            </h2>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/70">
                {playlist.mood}
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/70">
                {playlist.time_of_day}
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/70">
                {playlist.energy}% energy
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const formatTrackDuration = (milliseconds: number) => {
  const totalSeconds = Math.max(0, Math.round(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const formatTotalDuration = (milliseconds: number) => {
  const totalMinutes = Math.max(0, Math.round(milliseconds / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};

const fetchTrackMetadata = async (title: string) => {
  const query = encodeURIComponent(title);
  const response = await fetch(
    `https://itunes.apple.com/search?term=${query}&entity=song&limit=1`
  );

  if (!response.ok) {
    throw new Error("Metadata lookup failed");
  }

  const data = await response.json();
  const match = Array.isArray(data?.results) ? data.results[0] : null;

  if (!match) {
    return null;
  }

  return {
    title: typeof match.trackName === "string" ? match.trackName : title,
    artist:
      typeof match.artistName === "string" ? match.artistName : "Unknown Artist",
    album:
      typeof match.collectionName === "string"
        ? match.collectionName
        : "Unknown Album",
    durationMs:
      typeof match.trackTimeMillis === "number"
        ? match.trackTimeMillis
        : FALLBACK_TRACK_DURATION_MS,
    posterUrl:
      typeof match.artworkUrl100 === "string"
        ? match.artworkUrl100.replace("100x100", "300x300")
        : FALLBACK_POSTER_URL,
  };
};

const getWizardTitle = (step: WizardStep) => {
  if (step === 1) {
    return "Create your ride sound";
  }
  if (step === 2) {
    return "When is this ride?";
  }
  return "What is your Energy level?";
};

export default function SoundPage() {
  const [screen, setScreen] = useState<Screen>("library");
  const [step, setStep] = useState<WizardStep>(1);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<string | null>(null);
  const [energy, setEnergy] = useState(65);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
  const [library, setLibrary] = useState<Playlist[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedLibrary = localStorage.getItem(STORAGE_KEYS.library);
      const parsedLibrary = storedLibrary ? JSON.parse(storedLibrary) : [];
      const resolvedLibrary = Array.isArray(parsedLibrary) ? parsedLibrary : [];

      setLibrary(resolvedLibrary);

      const storedActiveId = localStorage.getItem(STORAGE_KEYS.activePlaylistId);
      if (
        storedActiveId &&
        resolvedLibrary.some((playlist) => playlist.id === storedActiveId)
      ) {
        setActivePlaylistId(storedActiveId);
        setScreen("playlist");
      } else {
        setActivePlaylistId(null);
      }
    } catch {
      setLibrary([]);
      setActivePlaylistId(null);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEYS.library, JSON.stringify(library));
      if (activePlaylistId) {
        localStorage.setItem(STORAGE_KEYS.activePlaylistId, activePlaylistId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.activePlaylistId);
      }
    } catch {
      // Ignore localStorage write errors (quota, private mode, etc.)
    }
  }, [library, activePlaylistId, hasHydrated]);

  const activePlaylist = useMemo(
    () => library.find((playlist) => playlist.id === activePlaylistId) ?? null,
    [activePlaylistId, library]
  );

  const startCreationFlow = () => {
    setStep(1);
    setSelectedMood(null);
    setSelectedTimeOfDay(null);
    setEnergy(65);
    setError(null);
    setExportMessage(null);
    setScreen("wizard");
  };

  const openLibrary = () => {
    setError(null);
    setExportMessage(null);
    setScreen("library");
  };

  const openPlaylist = (playlistId: string) => {
    setActivePlaylistId(playlistId);
    setExportMessage(null);
    setScreen("playlist");
  };

  const createPlaylist = async () => {
    if (!selectedMood || !selectedTimeOfDay) {
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(PLAYLIST_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: selectedMood,
          time_of_day: selectedTimeOfDay,
          energy: energy,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate playlist");
      }

      // Parse the response - expecting an array of 20 song titles
      const songTitles = await response.json();

      if (!Array.isArray(songTitles) || songTitles.length === 0) {
        throw new Error("Invalid response from server");
      }

      const tracksWithMetadata = await Promise.all(
        songTitles.map(async (title: string, index: number) => {
          try {
            const metadata = await fetchTrackMetadata(title);
            const durationMs = metadata?.durationMs ?? FALLBACK_TRACK_DURATION_MS;

            return {
              id: `track-${Date.now()}-${index}`,
              title: metadata?.title ?? title,
              artist: metadata?.artist ?? "Unknown Artist",
              album: metadata?.album ?? "Generated Playlist",
              duration: formatTrackDuration(durationMs),
              posterUrl: metadata?.posterUrl ?? FALLBACK_POSTER_URL,
              durationMs,
            };
          } catch {
            return {
              id: `track-${Date.now()}-${index}`,
              title: title,
              artist: "Unknown Artist",
              album: "Generated Playlist",
              duration: formatTrackDuration(FALLBACK_TRACK_DURATION_MS),
              posterUrl: FALLBACK_POSTER_URL,
              durationMs: FALLBACK_TRACK_DURATION_MS,
            };
          }
        })
      );

      const totalDurationMs = tracksWithMetadata.reduce(
        (sum, track) => sum + track.durationMs,
        0
      );
      const totalDuration = formatTotalDuration(totalDurationMs);
      const tracks: PlaylistTrack[] = tracksWithMetadata.map(
        ({ durationMs, ...track }) => track
      );

      // Create playlist object
      const playlist: Playlist = {
        id: `playlist-${Date.now()}`,
        name: `${selectedMood} ${selectedTimeOfDay} Mix`,
        mood: selectedMood,
        time_of_day: selectedTimeOfDay,
        energy: energy,
        totalDuration: totalDuration,
        tracks: tracks,
      };

      setLibrary((previous) => [playlist, ...previous]);
      setActivePlaylistId(playlist.id);
      setScreen("playlist");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not generate playlist."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const goToPreviousStep = () => {
    if (step === 1) {
      openLibrary();
      return;
    }
    setStep((currentStep) => (currentStep === 3 ? 2 : 1));
  };

  const goToNextStep = async () => {
    if (step === 1) {
      if (!selectedMood) {
        setError("Please choose your mood.");
        return;
      }
      setError(null);
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!selectedTimeOfDay) {
        setError("Please select the time of day.");
        return;
      }
      setError(null);
      setStep(3);
      return;
    }

    await createPlaylist();
  };

  const handleExport = (platform: "Spotify" | "YouTube Music") => {
    if (!activePlaylist) {
      return;
    }
    setExportMessage(
      `${activePlaylist.name} is ready to be exported to ${platform}.`
    );
  };

  if (screen === "library") {
    return (
      <main className="flex min-h-screen flex-1 bg-[var(--background)] font-helvetica text-[var(--text)]">
        <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
          <section className="rounded-3xl border border-white/10 bg-black/30 p-6 sm:p-8">

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--accent)] sm:text-6xl">
              Your playlist library
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-[var(--text)]/70 sm:text-base">
              AI generated playlists tailored to your rides. Create, save, and vibe to the perfect soundtrack for every journey.
            </p>
          </section>

          {library.length === 0 ? (
            <section className="mt-8 rounded-3xl border border-white/10 bg-[#0b0819] p-8 text-center">
              <p className="text-lg text-[var(--text)]/85">No playlists yet.</p>
              <p className="mt-2 text-sm text-[var(--text)]/60">
                Create your first playlist.
              </p>
              <button
                type="button"
                onClick={startCreationFlow}
                className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[var(--primary)] px-8 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Start creating
              </button>
            </section>
          ) : (
            <section className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Saved playlists</h2>
                <button
                  type="button"
                  onClick={startCreationFlow}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-[var(--primary)]/70 px-5 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--primary)]/20"
                >
                  Create another
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {library.map((playlist) => (
                  <button
                    key={playlist.id}
                    type="button"
                    onClick={() => openPlaylist(playlist.id)}
                    className="rounded-2xl border border-white/10 bg-[#0b0819] p-5 text-left transition hover:border-[var(--primary)]/60"
                  >
                    <p className="text-lg font-semibold text-white">{playlist.name}</p>
                    <p className="mt-2 text-xs text-[var(--text)]/60">
                      {playlist.mood} | {playlist.time_of_day} | {playlist.energy}% energy
                    </p>
                    <p className="mt-2 text-xs text-[var(--secondary)]">
                      {playlist.tracks.length} songs | {playlist.totalDuration}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    );
  }

  if (screen === "wizard") {
    return (
      <main className="flex min-h-screen flex-1 bg-[var(--background)] font-helvetica text-[var(--text)]">
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-4 pb-16 pt-8 sm:px-6 sm:pt-14">
          <div className="w-full max-w-3xl">
            <button
              type="button"
              onClick={goToPreviousStep}
              className="text-sm text-[var(--secondary)] transition hover:text-[var(--primary)]"
            >
              Back
            </button>
            <p className="mt-4 text-xs uppercase tracking-[0.28em] text-[var(--secondary)]">
              Step {step} of 3
            </p>
            <h1 className="mt-5 text-center text-5xl font-semibold leading-[0.95] text-[var(--primary)] sm:text-7xl">
              {getWizardTitle(step)}
            </h1>
          </div>

          <div className="mt-12 w-full max-w-3xl rounded-3xl border border-white/10 bg-[#131122] p-6 sm:p-8">
            {step === 1 ? (
              <div>
                <p className="mb-4 text-sm text-[var(--text)]/80">Choose your mood</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood}
                      type="button"
                      onClick={() => setSelectedMood(mood)}
                      className={`rounded-full px-4 py-2 text-sm transition ${
                        selectedMood === mood
                          ? "bg-[var(--secondary)] text-[#17122e]"
                          : "border border-[var(--secondary)]/35 bg-[var(--secondary)]/15 text-[var(--text)]"
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div>
                <p className="mb-4 text-sm text-[var(--text)]/80">Select the time of day</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {timeOfDayOptions.map((timeOfDay) => (
                    <button
                      key={timeOfDay}
                      type="button"
                      onClick={() => setSelectedTimeOfDay(timeOfDay)}
                      className={`rounded-full px-4 py-2 text-sm transition ${
                        selectedTimeOfDay === timeOfDay
                          ? "bg-[var(--secondary)] text-[#17122e]"
                          : "border border-[var(--secondary)]/35 bg-[var(--secondary)]/15 text-[var(--text)]"
                      }`}
                    >
                      {timeOfDay}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div>
                <label htmlFor="energy" className="text-sm text-[var(--text)]/80">
                  Energy: <span className="font-semibold text-[var(--secondary)]">{energy}%</span>
                </label>
                <input
                  id="energy"
                  type="range"
                  min={0}
                  max={100}
                  value={energy}
                  onChange={(event) => setEnergy(Number(event.target.value))}
                  className="mt-5 w-full accent-[var(--secondary)]"
                />
              </div>
            ) : null}

            {error ? (
              <p className="mt-5 text-sm text-[#ff8bc2]">{error}</p>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={goToPreviousStep}
                className="h-11 rounded-full border border-white/15 px-5 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--secondary)]/60"
              >
                {step === 1 ? "Cancel" : "Back"}
              </button>
              <button
                type="button"
                onClick={() => {
                  void goToNextStep();
                }}
                disabled={isGenerating}
                className="h-11 rounded-full bg-[var(--primary)] px-6 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {step === 3
                  ? isGenerating
                    ? "Creating..."
                    : "Create My Playlist"
                  : "Continue"}
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-1 bg-[var(--background)] font-helvetica text-[var(--text)]">
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={openLibrary}
            className="h-10 rounded-full border border-white/15 px-5 text-sm font-semibold transition hover:border-[var(--secondary)]/70"
          >
            Library
          </button>
          <button
            type="button"
            onClick={startCreationFlow}
            className="h-10 rounded-full bg-[var(--primary)] px-5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Create another
          </button>
        </div>

        {activePlaylist ? (
          <div className="rounded-3xl border border-white/10 bg-black/30 p-6 sm:p-8">
            <div className="rounded-3xl border border-white/10 bg-[#0b0819] p-5 sm:p-7">
              <PlaylistCover playlist={activePlaylist} />
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[var(--text)]/55">
                    Generated mix
                  </p>
                  <h1 className="mt-2 text-4xl font-semibold text-white sm:text-5xl">
                    {activePlaylist.name}
                  </h1>
                  <p className="mt-2 text-sm text-[var(--text)]/65">
                    {activePlaylist.tracks.length} songs, {activePlaylist.totalDuration}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (activePlaylist) {
                      downloadPlaylistCsv(activePlaylist);
                    }
                  }}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--primary)]/70 text-[var(--primary)]"
                  aria-label="Download"
                  title="Download CSV"
                >
                  <IoArrowDownCircleOutline className="h-6 w-6" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleExport("Spotify")}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-[#1DB954]/40 bg-[#1DB954]/15 px-4 text-xs font-semibold text-[#8df2b5]"
                >
                  <FaSpotify className="h-4 w-4" />
                  Export to Spotify
                </button>
                <button
                  type="button"
                  onClick={() => handleExport("YouTube Music")}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-[#ff4f4f]/40 bg-[#ff4f4f]/15 px-4 text-xs font-semibold text-[#ffc2c2]"
                >
                  <IoLogoYoutube className="h-4 w-4" />
                  Export to YT Music
                </button>
              </div>
            </div>

            {exportMessage ? (
              <p className="mt-4 text-sm text-[var(--secondary)]">{exportMessage}</p>
            ) : null}

            <div className="mt-8 overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="text-xs uppercase tracking-[0.15em] text-[var(--text)]/60">
                  <tr>
                    <th className="pb-3 pr-3">#</th>
                    <th className="pb-3 pr-3">Track</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-sm">
                  {activePlaylist.tracks.map((track, index) => (
                    <tr key={track.id}>
                      <td className="py-3 pr-3 text-[var(--text)]/70">{index + 1}</td>
                      <td className="py-3 pr-3 text-[var(--text)]">
                        <div className="flex items-center gap-3">
                          <img
                            src={track.posterUrl}
                            alt={`${track.title} artwork`}
                            className="h-12 w-12 rounded-lg object-cover"
                            loading="lazy"
                          />
                          <div>
                            <p className="text-[var(--text)]">{track.title}</p>
                            <p className="text-xs text-[var(--text)]/60">{track.artist}</p>
                          </div>
                        </div>
                        <p className="mt-2 text-xs text-[var(--text)]/55">
                          {track.album} | {track.duration}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <section className="rounded-3xl border border-white/10 bg-black/30 p-8 text-center">
            <p className="text-sm text-[var(--text)]/70">
              Playlist not found. Go back to the library and create a new one.
            </p>
            <button
              type="button"
              onClick={openLibrary}
              className="mt-5 h-11 rounded-full bg-[var(--primary)] px-6 text-sm font-semibold text-white"
            >
              Back to library
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
