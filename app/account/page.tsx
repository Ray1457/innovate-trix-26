import React from "react";
import styles from "./account.module.css";
import Image from "next/image";

export default function AccountPage() {
  return (
    <main className="min-h-screen w-full bg-[var(--background)] text-[var(--text)] font-helvetica py-8">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-helvetica-bold mb-4">Hey Yovaan,</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div className={`rounded-2xl p-8 ${styles.cardPurple}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-5xl font-helvetica-bold text-[var(--primary)]">JUJO</h3>
                  <p className="text-2xl font-helvetica-bold tracking-tight">MEMBERSHIP</p>
                </div>
                <div className="text-right text-[var(--secondary)]">8&nbsp;&nbsp;1,29,777</div>
              </div>
            </div>

            <div className={`rounded-2xl p-6 ${styles.cardLight}`}>
              <h4 className="text-2xl font-bold mb-4">Your Ride Presets</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className={`h-36 rounded-lg border border-white/10 ${styles.presetCell}`}>
                  <div className="p-3">photo + combo<br />name</div>
                </div>
                <div className={`h-36 rounded-lg border border-white/10 ${styles.presetCell}`}>
                  <div className="p-3">photo + combo<br />name</div>
                </div>
                <div className={`h-36 rounded-lg border border-white/10 ${styles.presetCell}`}>
                  <div className="p-3">photo + combo<br />name</div>
                </div>
                <div className={`h-36 rounded-lg border border-white/10 ${styles.presetCell}`}>
                  <div className="p-3">photo + combo<br />name</div>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className={`rounded-2xl p-6 ${styles.cardLight}`}>
              <h4 className="text-2xl font-bold mb-4">Ride Preferences</h4>

              <div className="space-y-4">
                <PreferenceGroup title="Communication" options={["Silent","Minimal","Open to chat"]} />
                <PreferenceGroup title="Ambience" options={["Quiet night","Soft music","Rest mode","Cool & Airy","Focus mode","Scenic calm"]} />
                <PreferenceGroup title="Route Preferences" options={["Fastest","Smooth & Calm","Budget","Traffic-less"]} />
                <PreferenceGroup title="Driving style" options={["Fast","Smooth","Slow"]} />
              </div>
            </div>

            <div className={`rounded-2xl p-6 ${styles.cardPurple} h-40 flex items-center justify-center`}> 
              <h4 className="text-2xl font-bold">Ride Consistency</h4>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function PreferenceGroup({ title, options }: { title: string; options: string[] }) {
  return (
    <div>
      <div className="text-sm text-[var(--secondary)] mb-2">{title}</div>
      <div className="space-y-2">
        {options.map((opt, idx) => (
          <label key={opt} className="flex items-center gap-3">
            <input name={title} type="radio" defaultChecked={idx === 0} className="accent-[var(--primary)]" />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
