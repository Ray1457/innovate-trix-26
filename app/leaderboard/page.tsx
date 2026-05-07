import styles from "./leaderboard.module.css";

export default function LeaderboardPage() {
  const rows = [
    ["1", "Yovaan Sethi", "99,99,999", "9,900h"],
    ["2", "Rishit Narang", "89,34,998", "9,000h"],
    ["3", "Aarav Tulsani", "79,99,488", "8,700h"],
    ["4", "Xino", "65,99,400", "8,000h"],
    ["5", "Ordin", "59,65,300", "7,600h"],
    ["6", "Aneira", "39,93,399", "7,000h"],
    ["7", "Akshat", "38,38,900", "6,450h"],
    ["8", "YogitheWise", "30,25,333", "5,900h"],
    ["9", "Iloveomen", "25,99,999", "5,000h"],
  ];

  return (
    <main className={`${styles.page} min-h-screen w-full`}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 text-center">
        <section className="mt-8">
          <div className="overflow-hidden rounded-lg border border-[rgba(255,255,255,0.06)]">
            <table className="w-full table-auto text-center">
              <thead className="text-sm text-[#a45bcf]">
                <tr className="divide-x divide-[rgba(255,255,255,0.03)]">
                  <th className="px-6 py-4 w-20">Rank</th>
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">Points</th>
                  <th className="px-6 py-4">Time in motion</th>
                </tr>
              </thead>

              <tbody className="text-[var(--page-text)]">
                {rows.map((r) => (
                  <tr key={r[0]} className="border-t border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)]">
                    <td className="px-6 py-4 text-[#a45bcf]">{r[0]}</td>
                    <td className="px-6 py-4 text-[var(--accent)]">{r[1]}</td>
                    <td className="px-6 py-4">{r[2]}</td>
                    <td className="px-6 py-4">{r[3]}</td>
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
