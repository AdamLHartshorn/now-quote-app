import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md text-center">

        <div className="mb-8">

          <div className="flex justify-center mb-6">
            <Image
              src="/now-logo.jpg"
              alt="NOW Courier"
              width={260}
              height={90}
              priority
            />
          </div>

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