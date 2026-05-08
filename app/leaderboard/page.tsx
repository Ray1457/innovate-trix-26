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
            <table className="w-full table-auto text-center" aria-label="Leaderboard rankings">
              <thead className="text-sm text-[var(--text)]">
                <tr className="divide-x divide-[rgba(255,255,255,0.03)]">
                  <th className="px-6 py-4 w-20">Rank</th>
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">Points</th>
                  <th className="px-6 py-4">Time in motion</th>
                </tr>
              </thead>

              <tbody className="text-[var(--secondary)]">
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)]">
                    <td className="px-6 py-4 ">{row.rank}</td>
                    <td className="px-6 py-4 ">{row.username}</td>
                    <td className="px-6 py-4">{row.points}</td>
                    <td className="px-6 py-4">{row.timeInMotion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
