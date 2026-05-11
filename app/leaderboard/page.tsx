import styles from "./leaderboard.module.css";

type LeaderboardEntry = {
  id: string;
  rank: string;
  username: string;
  points: string;
  timeInMotion: string;
};

export default function LeaderboardPage() {
  const rows: LeaderboardEntry[] = [
    { id: "yovaan-sethi", rank: "1", username: "Yovaan Sethi", points: "99,99,999", timeInMotion: "9,900h" },
    { id: "rishit-narang", rank: "2", username: "Rishit Narang", points: "89,34,998", timeInMotion: "9,000h" },
    { id: "aarav-tulsani", rank: "3", username: "Aarav Tulsani", points: "79,99,488", timeInMotion: "8,700h" },
    { id: "xino", rank: "4", username: "Xino", points: "65,99,400", timeInMotion: "8,000h" },
    { id: "ordin", rank: "5", username: "Ordin", points: "59,65,300", timeInMotion: "7,600h" },
    { id: "aneira", rank: "6", username: "Aneira", points: "39,93,399", timeInMotion: "7,000h" },
    { id: "akshat", rank: "7", username: "Akshat", points: "38,38,900", timeInMotion: "6,450h" },
    { id: "yogithewise", rank: "8", username: "YogitheWise", points: "30,25,333", timeInMotion: "5,900h" },
    { id: "iloveomen", rank: "9", username: "Iloveomen", points: "25,99,999", timeInMotion: "5,000h" },
  ];

  return (
    <main className={`${styles.page} min-h-screen w-full`}>
      <img src="/img/lb hero.png" alt="Leaderboard Hero" className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8" />
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 text-center">
        <section className="mt-8">
          <div className="overflow-hidden rounded-lg border border-[rgba(255,255,255,0.06)]">
            {/* Header */}
            <div className="flex text-sm text-[var(--text)] border-b border-[rgba(255,255,255,0.03)] mx-6">
              <div className="px-6 py-4 w-20 flex-1">Rank</div>
              <div className="px-6 py-4 flex-3">Username</div>
              <div className="px-6 py-4 flex-1">Points</div>
              <div className="px-6 py-4 flex-1">Time in motion</div>
            </div>
            {/* Body */}
            <div className="text-[var(--secondary)]">
                {rows.map((row) => (
                <div key={row.id} className="flex border border-white/20 border-3 bg-white/5 my-4 backdrop-blur-md rounded-lg hover:bg-white/20 hover:shadow-lg  hover:scale-102 transition-ease-in-out transition-all duration-300 mx-6">
                  <div className="px-6 py-4 flex-1">{row.rank}</div>
                  <div className="px-6 py-4 flex-3">{row.username}</div>
                  <div className="px-6 py-4 flex-1">{row.points}</div>
                  <div className="px-6 py-4 flex-1">{row.timeInMotion}</div>
                </div>
                ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

