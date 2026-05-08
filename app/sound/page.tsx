"use client";

import { useMemo, useState } from "react";
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

// Client-visible API URL (set via NEXT_PUBLIC_PLAYLIST_API_URL). Falls back to local route.
const PLAYLIST_API_URL = process.env.PLAYLIST_API_URL ?? "http://localhost:8000/playlist";

const FALLBACK_POSTER_URL = "https://placehold.co/160x160?text=Sound";
const FALLBACK_TRACK_DURATION_MS = 2 * 60 * 1000;

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
                className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[var(--accent)] px-8 text-sm font-semibold text-white transition hover:opacity-90"
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
                  className="inline-flex h-10 items-center justify-center rounded-full border border-[var(--accent)]/70 px-5 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--accent)]/20"
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
                    className="rounded-2xl border border-white/10 bg-[#0b0819] p-5 text-left transition hover:border-[var(--accent)]/60"
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
              className="text-sm text-[var(--secondary)] transition hover:text-[var(--accent)]"
            >
              Back
            </button>
            <p className="mt-4 text-xs uppercase tracking-[0.28em] text-[var(--secondary)]">
              Step {step} of 3
            </p>
            <h1 className="mt-5 text-center text-5xl font-semibold leading-[0.95] text-[var(--accent)] sm:text-7xl">
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
                className="h-11 rounded-full bg-[var(--accent)] px-6 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
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
            className="h-10 rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Create another
          </button>
        </div>

        {activePlaylist ? (
          <div className="rounded-3xl border border-white/10 bg-black/30 p-6 sm:p-8">
            <div className="rounded-3xl border border-white/10 bg-[#0b0819] p-5 sm:p-7">
              <div className="h-48 overflow-hidden rounded-2xl sm:h-56">
                <img
                  src={activePlaylist.tracks[0]?.posterUrl ?? FALLBACK_POSTER_URL}
                  alt={`${activePlaylist.name} cover`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <h1 className="mt-6 text-4xl font-semibold text-white sm:text-5xl">
                {activePlaylist.name}
              </h1>
              <p className="mt-2 text-sm text-[var(--text)]/65">
                {activePlaylist.tracks.length} songs, {activePlaylist.totalDuration}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)] text-white"
                  aria-label="Pause"
                >
                  <IoPause className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--accent)]/70 text-[var(--accent)]"
                  aria-label="Download"
                >
                  <IoArrowDownCircleOutline className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--accent)]/70 text-[var(--accent)]"
                  aria-label="Shuffle"
                >
                  <IoSyncOutline className="h-6 w-6" />
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
              className="mt-5 h-11 rounded-full bg-[var(--accent)] px-6 text-sm font-semibold text-white"
            >
              Back to library
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
