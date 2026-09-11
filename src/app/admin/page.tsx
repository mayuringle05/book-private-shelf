import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminConsole } from "@/components/admin/admin-console";
import { AdminSetup } from "@/components/admin/admin-setup";
import { getDashboardSnapshot } from "@/lib/repository";

export const dynamic = "force-dynamic";
export const metadata = { title: "Production Engine" };

export default async function AdminPage() {
  let snapshot = null;
  let error = "";
  try { snapshot = await getDashboardSnapshot(); }
  catch (caught) { error = caught instanceof Error ? caught.message : "Database connection failed."; }

  return (
    <main className="min-h-screen bg-[#090807] pb-28">
      <header className="border-b border-white/10">
        <div className="book-shell flex flex-col gap-8 pb-10 pt-10 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/" className="mb-8 flex items-center gap-2 text-xs uppercase tracking-[.15em] text-white/35"><ArrowLeft className="h-3.5 w-3.5" /> Public shelf</Link>
            <p className="book-kicker">Operator only / production</p>
            <h1 className="book-display mt-4 text-6xl md:text-8xl">The Engine</h1>
          </div>
          <div className="max-w-md text-xs leading-6 text-white/38">One operator. One active book. One smallest missing unit. Two chapter actions. Validated content maps straight to the live reader.</div>
        </div>
      </header>
      <div className="book-shell py-10">{snapshot ? <AdminConsole initial={snapshot} /> : <AdminSetup message={error} />}</div>
    </main>
  );
}
