export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-5xl font-bold tracking-wide mb-2">
          QUOTE NOW
        </h1>

        <p className="text-gray-400 mb-10">
          NOW Courier Internal Pricing Tool
        </p>

        <div className="flex flex-col gap-4">
          <a
            href="/fast-quote"
            className="bg-red-600 hover:bg-red-700 text-white text-xl font-semibold py-5 rounded-2xl block"
          >
            FAST QUOTE
          </a>

          <a
            href="/detailed-quote"
            className="bg-gray-800 hover:bg-gray-700 text-white text-xl font-semibold py-5 rounded-2xl block"
          >
            DETAILED QUOTE
          </a>

          <a
            href="/dedicated-quote"
            className="bg-gray-800 hover:bg-gray-700 text-white text-xl font-semibold py-5 rounded-2xl block"
          >
            DEDICATED QUOTE
          </a>
        </div>
      </div>
    </main>
  );
}