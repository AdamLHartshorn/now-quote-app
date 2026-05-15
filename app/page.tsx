export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center rounded-2xl border border-blue-400/30 bg-blue-500/10 px-6 py-3 mb-5">
            <span className="text-2xl font-black tracking-widest text-white">
              NOW
            </span>
            <span className="ml-2 text-2xl font-light tracking-wide text-blue-300">
              COURIER
            </span>
          </div>

          <h1 className="text-5xl font-black tracking-wide mb-3">
            QUOTE NOW
          </h1>

          <p className="text-blue-300 font-medium mb-2">
            Whenever You Call, We Deliver.
          </p>

          <p className="text-slate-400 text-sm">
            Internal Pricing Tool
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <a
            href="/fast-quote"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-5 rounded-2xl block shadow-lg shadow-blue-900/30"
          >
            FAST QUOTE
          </a>

          <a
            href="/detailed-quote"
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xl font-semibold py-5 rounded-2xl block"
          >
            DETAILED QUOTE
          </a>

          <a
            href="/dedicated-quote"
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xl font-semibold py-5 rounded-2xl block"
          >
            DEDICATED QUOTE
          </a>
        </div>

        <p className="mt-10 text-xs tracking-widest text-slate-500">
          FOR INTERNAL USE ONLY · v0.3
        </p>
      </div>
    </main>
  );
}