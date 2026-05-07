export default function Home() {
  return (
    <main className="relative flex h-full min-h-full overflow-hidden bg-[var(--page-bg)] text-[var(--page-text)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(181,77,235,0.12),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_16%)]" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1180px] flex-col px-4 pb-4 sm:px-7 lg:px-9">
        <div className="relative flex flex-1 flex-col justify-start pt-6 sm:pt-10 lg:pt-12">
          <div className="relative z-20 ml-auto w-full max-w-4xl pr-0 pt-6 text-right sm:pt-10 md:pr-8 lg:pr-10">
            <h1 className="max-w-full text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold leading-tight tracking-tight text-[var(--headline)]">
              <span className="block">Welcome to</span>
              <span className="block text-[var(--accent)]">Uber-jo</span>
            </h1>
          </div>

          <div className="relative mt-10 flex flex-1 flex-col justify-end pb-5 sm:mt-8 lg:pb-8">
            <div aria-hidden="true" data-placeholder="bottom-left-art" className="absolute bottom-0 left-0 hidden h-72 w-1/2 md:block" />

            <div className="relative ml-auto flex w-full max-w-xs flex-col items-end gap-4 pr-0 text-right sm:max-w-sm md:mr-20 md:pr-2 lg:mr-24">
              <p className="max-w-xs text-base leading-relaxed tracking-tight text-[var(--copy)] sm:text-lg">
                Welcome to Uber Jo — personalized rides that feel meaningful. Sign up to experience journeys beyond just getting there.
              </p>

              <button
                type="button"
                className="glass-btn inline-flex h-8 w-32 items-center justify-center font-medium tracking-tight text-[var(--page-text)] hover:-translate-y-0.5"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
