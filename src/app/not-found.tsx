import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <div className="rounded-[1.75rem] bg-[#F2EAD9] p-2 ring-1 ring-[#E2D5BE]">
        <div className="rounded-[1.25rem] bg-[#FFFDF9] p-8 sm:p-12">
          <p className="font-mono text-sm font-bold text-[#9A4D1A]">404</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-[#24170E]">
            Halaman tidak ditemukan
          </h1>
          <p className="mt-3 text-sm text-[#634B3A]">
            Tautan yang dibuka tidak tersedia. Kamu bisa kembali ke beranda atau
            langsung memeriksa contoh paspor batch tempe.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center rounded-full bg-[#9A4D1A] px-5 text-sm font-semibold text-white hover:bg-[#7D3C12]"
            >
              Kembali ke Beranda
            </Link>
            <Link
              href="/b/TMP-MLR-2611-01"
              className="inline-flex min-h-[44px] items-center rounded-full bg-[#F2EAD9] px-5 text-sm font-semibold text-[#24170E] hover:bg-[#E2D5BE]"
            >
              Lihat Contoh Paspor
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
