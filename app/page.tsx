import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex flex-1 overflow-hidden bg-[var(--background)] text-[var(--text)] font-helvetica ">


      <div className="relative z-10 mx-auto flex flex-1 w-full flex-col">
        <div className="relative flex flex-1 flex-col justify-start pt-6 sm:pt-10 lg:pt-12">
          <div className="relative z-20 ml-auto w-full max-w-4xl pr-0 pt-6 text-right sm:pt-10 md:pr-8 lg:pr-10 mr-32">
            <h1 className="max-w-full text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-helvetica-bold leading-tight tracking-[-0.5rem] text-[var(--text)] ">
              <span className="block mb-[-2rem] ">Welcome to</span>
              <span className="block text-[var(--primary)]">Uber-jo</span>
            </h1>
          </div>

          <div className="relative mt-10 flex flex-1/3 flex-col justify-start pb-5 sm:mt-8 lg:pb-8">
            <div className="absolute bottom-0 left-0 hidden  w-1/2 md:block">
              <img
                src="/img/hero.png"
                alt="Landing hero"
                className="h-full w-full  object-left-bottom opacity-90"
              />
            </div>

            <div className="relative ml-auto flex w-full max-w-xs flex-col items-end pr-0 text-left sm:max-w-sm md:mr-24 md:pr-2 lg:mr-44">
              <p className="max-w-xs text-base leading-relaxed tracking-tighter text-[var(--text)] sm:text-lg mb-[-1rem]">
                Welcome to Uber Jo — personalized rides that feel meaningful. Sign in to experience journeys beyond just getting there.
              </p>

              <Link
                href="/auth"
                className="glass-btn inline-flex h-8 w-32 items-center justify-center font-bold tracking-tight text-[var(--text)] hover:-translate-y-0. mr-16"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
