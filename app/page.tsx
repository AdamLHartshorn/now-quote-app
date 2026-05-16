import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center p-6">
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

          <p className="text-blue-700 font-medium mb-2">
            Whenever You Call, We Deliver.
          </p>

          <p className="text-slate-500 text-sm">
            Internal Pricing Tool
          </p>

        </div>

        <div className="flex flex-col gap-4">

          <a
            href="/fast-quote-parcel"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-5 rounded-2xl block shadow-lg shadow-blue-200"
          >
            FAST QUOTE — PARCEL
          </a>

          <a
            href="/fast-quote-commercial"
            className="bg-blue-700 hover:bg-blue-800 text-white text-xl font-bold py-5 rounded-2xl block shadow-lg shadow-blue-200"
          >
            FAST QUOTE — COMMERCIAL
          </a>

          <a
            href="/detailed-quote"
            className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 text-xl font-semibold py-5 rounded-2xl block"
          >
            DETAILED QUOTE
          </a>

          <a
            href="/dedicated-quote"
            className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 text-xl font-semibold py-5 rounded-2xl block"
          >
            DEDICATED QUOTE
          </a>

        </div>

        <p className="mt-10 text-xs tracking-widest text-slate-400">
          FOR INTERNAL USE ONLY · v0.4
        </p>

      </div>
    </main>
  );
}