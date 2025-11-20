"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {signOut, useSession} from "next-auth/react";

type productCard = {
    _id: string;
    name: string;
    price: number;
    slug: string;
    stock?: number;
    imageUrl: string;
    userId: string;
}

export default function HomePage() {
  const {data: session} = useSession();
  const [products, setProducts] = useState<productCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products", {cache: "no-store"});

        if (!res.ok) {
          console.error("Gagal memuat produk:", res.status);
          setProducts([]);
          return;
        }

        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Gagal memuat produk:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const userName = session?.user?.name || "";
  const role = (session?.user as any)?.role || null;
  const avatarLetter = userName && userName.trim().length > 0 ? userName.trim()[0].toUpperCase() : "U";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="relative overflow-hidden border-b border-pink-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-pink-500/20 blur-3xl"></div>
        <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-purple-600/25 blur-3xl"></div>
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:py-14">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.25em] text-pink-300">Selamat Datang</p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-slate-50 md:text-4xl">
              ke E-Commerce{""}
              <span className="bg-gradient-to-r from-pink-400 via-fuchsia-400 to-sky-300 bg-clip-text text-transparent"> Ambaradul</span>
            </h1>
            <div className="mt-5">
              {session ? (
                <div className="flex items-center gap-3 rounded-2xl border border-pink-500/40 bg-slate-900/70 px-4 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-500 text-sm font-semibold text-slate-950">{avatarLetter}</div>
                  <div className="text-xs md:text-sm">
                    <p className="text-[11px] uppercase tracking-wide text-pink-300">Halo</p>
                    <p className="font-semibold text-slate-50">{userName || "(Tanpa Nama)"}</p>
                    <p className="text-[11px] text-slate-400">Role: {role || "User"}</p>
                  </div>
                </div>
              ): (
                <p className="text-xs text-slate-400 md:text-sm">
                  Kamu belum masuk. Silahkan login atau daftar terlebih dahulu
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                {session ? (
                  <>
                    <a href="/account" className="rounded-full bg-pink-500 px-5 py-2 font-medium text-slate-950 shadow-lg shadow-pink-500/30 hover:bg-pink-400">Lihat akun</a>
                    <a href="/orders" className="rounded-full border border-pink-400/70 bg-slate-950/60 px-5 py-2 font-medium text-pink-200 hover:bg-slate-900">Riwayat Pesanan</a>
                    <button onClick={() => signOut({callbackUrl: "/"})} className="rounded-full border border-pink-400/70 bg-red-950/60 px-5 py-2 font-medium text-pink-200 hover:bg-slate-900">Keluar</button>
                    <a href="/products/upload" className="rounded-full bg-pink-500 px-5 py-2 font-medium text-slate-950 shadow-lg shadow-pink-500/30 hover:bg-pink-400">Upload Produk</a>
                  </>
                ): (
                  <>
                    <a href="/login" className="rounded-full bg-pink-500 px-5 py-2 font-medium text-slate-950 shadow-lg shadow-pink-500/30 hover:bg-pink-400">Login</a>
                    <a href="/register" className="rounded-full border border-pink-400/70 bg-slate-950/60 px-5 py-2 font-medium text-pink-200 hover:bg-slate-900">Daftar</a>
                  </>
                )}
              </div>
            </div>
          </div>

          <section className="mx-auto w-full max-w-6xl px-4 py-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">Produk Terbaru</h2>
              {products.length > 0 && (
                <span className="text-[11px] text-slate-500">
                  {products.length} produk tersedia
                </span>
              )}
            </div>
            {loading ? (
              <p className="text-sm text-slate-400">Memuat data produk...</p>
            ) : products.length === 0 ? (
              <p className="text-sm text-slate-400">
                Belum ada produk tersedia.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products.map((p) => (
                  (p.userId !== (session?.user as any)?.id || (session?.user as any)?.role === "admin") && (
                    <a href={`/products/${p.slug}`} key={p._id} className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900/70 p-3 text-xs hover:border-pink-400/80 hover:bg-slate-900">
                      <div className="mb-3 flex h-32 items-center justify-center rounded-xl bg-slate-900/80 text-[11px] text-slate-500">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="h-full w-full rounded-xl object-cover"/>
                        ) : (
                          <span>Tidak ada gambar</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium text-slate-50">{p.name}</p>
                        <p className="text-pink-300">Rp {Number(p.price).toLocaleString('id-ID')}</p>
                        <p className="text-[11px] text-slate-500">stok: {p.stock ?? 0}</p>
                      </div>
                    </a>
                  )
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  )
}