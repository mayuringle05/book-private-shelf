import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090807] p-8 text-center">
      <div>
        <p className="book-kicker">404 / Shelf record</p>
        <h1 className="book-display mt-5 text-6xl">That volume is not on this shelf.</h1>
        <Link href="/library" className="mt-8 inline-block border-b border-white/30 pb-1 text-sm text-white/55">Return to the shelf</Link>
      </div>
    </main>
  );
}
