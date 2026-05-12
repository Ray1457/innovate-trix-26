"use client";

import React, { useEffect, useState } from "react";
import styles from "./account.module.css";

const rewardOptions = [
  {
    title: "Uber One subscription",
    detail: "1 month membership",
    cost: "4,500 pts",
  },
  {
    title: "Night drive skin",
    detail: "Animated dark UI pack",
    cost: "2,000 pts",
  },
  {
    title: "Neon map skin",
    detail: "High contrast navigation theme",
    cost: "3,200 pts",
    locked: true,
  },
];

const preferenceGroups = [
  {
    key: "conversation",
    title: "Conversation",
    options: ["Quiet ride", "Light chat", "Talkative"],
  },
  {
    key: "music",
    title: "Music",
    options: ["Off", "Low volume", "Upbeat"],
  },
  {
    key: "temperature",
    title: "Temperature",
    options: ["Cool", "Neutral", "Warm"],
  },
  {
    key: "windowMode",
    title: "Window mode",
    options: ["Closed", "Open air"],
  },
] as const;

type PreferenceKey = (typeof preferenceGroups)[number]["key"];

type PreferenceState = Record<PreferenceKey, string>;

const preferenceStorageKey = "uber-jo-ride-preferences";

const defaultPreferences: PreferenceState = {
  conversation: "Quiet ride",
  music: "Off",
  temperature: "Cool",
  windowMode: "Closed",
};

function hydratePreferences(rawValue: string | null): PreferenceState | null {
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as Record<string, unknown>;
    const nextPreferences: PreferenceState = { ...defaultPreferences };

    preferenceGroups.forEach((group) => {
      const storedValue = parsed[group.key];
      if (typeof storedValue === "string" && group.options.some((option) => option === storedValue)) {
        nextPreferences[group.key] = storedValue;
      }
    });

    return nextPreferences;
  } catch {
    return null;
  }
}

export default function AccountPage() {
  const [preferences, setPreferences] = useState<PreferenceState>(defaultPreferences);
  const [prefsSaved, setPrefsSaved] = useState(false);

  useEffect(() => {
    const storedPreferences = hydratePreferences(window.localStorage.getItem(preferenceStorageKey));
    if (storedPreferences) {
      setPreferences(storedPreferences);
      setPrefsSaved(true);
    }
  }, []);

  const handlePreferenceChange = (key: PreferenceKey, value: string) => {
    setPreferences((current) => ({
      ...current,
      [key]: value,
    }));
    setPrefsSaved(false);
  };

  const handleSavePreferences = () => {
    try {
      window.localStorage.setItem(preferenceStorageKey, JSON.stringify(preferences));
      setPrefsSaved(true);
    } catch {
      setPrefsSaved(false);
    }
  };

  return (
    <main className={`min-h-screen w-full bg-[var(--background)] text-[var(--text)] font-helvetica ${styles.pageBackdrop}`}>
      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-12 pt-10">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--secondary)]">Account hub</p>
            <h2 className="mt-2 text-3xl font-helvetica-bold">Hey Yovaan,</h2>
            <p className="text-sm text-[var(--secondary)]">Keep your rides tuned and rewards growing.</p>
          </div>
          <div className={`flex items-center gap-3 rounded-full px-5 py-2 ${styles.pointsPill}`}>
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--secondary)]">Points</span>
            <span className="text-lg font-helvetica-bold text-[var(--text)]">8,240</span>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className={`rounded-2xl p-7 ${styles.membershipCard}`}>
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--secondary)]">Membership</p>
                  <h3 className="mt-2 text-4xl font-helvetica-bold text-[var(--primary)]">JUJO</h3>
                  <p className="text-sm text-[var(--secondary)]">Elite rider tier</p>
                </div>
                <div className={`flex flex-wrap gap-6 ${styles.membershipStats}`}>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-[var(--secondary)]">Rank</p>
                    <p className="text-3xl font-helvetica-bold">#8</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-[var(--secondary)]">Lifetime pts</p>
                    <p className="text-3xl font-helvetica-bold">129,777</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`rounded-2xl p-7 ${styles.rewardCard}`}>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
                <div className="flex-1 space-y-4">
                  <div>
                    <h4 className="text-2xl font-bold">Rewards Garage</h4>
                    <p className="text-sm text-[var(--secondary)]">Redeem perks and app skins with your points.</p>
                  </div>

                  <div className={styles.pointsPanel}>
                    <div className="text-xs uppercase tracking-[0.25em] text-[var(--secondary)]">Available now</div>
                    <div className="mt-2 text-4xl font-helvetica-bold">8,240</div>
                    <div className="mt-2 text-xs text-[var(--secondary)]">+420 pts from your last ride</div>
                  </div>

                  <div className="grid gap-3">
                    {rewardOptions.map((reward) => (
                      <RewardItem
                        key={reward.title}
                        title={reward.title}
                        detail={reward.detail}
                        cost={reward.cost}
                        locked={reward.locked}
                      />
                    ))}
                  </div>
                </div>

                <div className={styles.leaderboardPanel}>
                  <div className="text-xs uppercase tracking-[0.3em] text-[var(--secondary)]">Leaderboard</div>
                  <div className="mt-3 text-5xl font-helvetica-bold">#12</div>
                  <p className="mt-2 text-sm text-[var(--secondary)]">Top 3% in your city this week.</p>
                  <div className={`mt-4 ${styles.leaderboardProgress}`}>
                    <div className="text-xs uppercase tracking-[0.25em] text-[var(--secondary)]">Next rank</div>
                    <div className="mt-1 text-sm">1,200 pts to reach #10</div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: "72%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className={`rounded-2xl p-6 ${styles.cardLight}`}>
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-2xl font-bold">Ride Preferences</h4>
              </div>

              <div className="space-y-5">
                {preferenceGroups.map((group) => (
                  <PreferenceGroup
                    key={group.key}
                    name={group.key}
                    title={group.title}
                    options={group.options}
                    value={preferences[group.key]}
                    onChange={(value) => handlePreferenceChange(group.key, value)}
                  />
                ))}
              </div>

              <div className={styles.preferenceFooter}>
                <button
                  type="button"
                  className={`${styles.saveButton} ${prefsSaved ? styles.saveButtonSaved : ""}`}
                  onClick={handleSavePreferences}
                >
                  {prefsSaved ? "Saved ✓" : "Save preferences"}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function PreferenceGroup({
  name,
  title,
  options,
  value,
  onChange,
}: {
  name: string;
  title: string;
  options: readonly string[];
  value: string;
  onChange?: (value: string) => void;
}) {
  return (
    <fieldset className={styles.preferenceGroup}>
      <legend className={styles.preferenceLabel}>{title}</legend>
      <div className={styles.preferenceOptions}>
        {options.map((opt) => (
          <label key={opt} className={styles.preferencePill}>
            <input
              name={name}
              type="radio"
              checked={value === opt}
              className={styles.preferenceInput}
              onChange={() => onChange?.(opt)}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function RewardItem({
  title,
  detail,
  cost,
  locked,
}: {
  title: string;
  detail: string;
  cost: string;
  locked?: boolean;
}) {
  return (
    <div className={`${styles.rewardItem} ${locked ? styles.rewardItemLocked : ""}`}>
      <div>
        <div className="font-helvetica-bold text-sm">{title}</div>
        <div className="text-xs text-[var(--secondary)]">{detail}</div>
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
        <div className={styles.rewardMeta}>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--secondary)]">Cost</span>
          <span className="text-sm">{cost}</span>
        </div>
        <button className={`${styles.rewardAction} ${locked ? styles.rewardActionLocked : ""}`} disabled={locked}>
          {locked ? "Preview" : "Redeem"}
        </button>
      </div>
    </div>
  );
}
