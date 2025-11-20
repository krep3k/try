"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJs, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJs.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function adminPage() {
    const {data: session, status} = useSession();
    const [salesData, setSalesData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSalesData() {
            try {
                const res = await fetch("/api/admin/stats", {cache: "no-store"});
                const data = await res.json();
                if(data.products) {
                    setSalesData(data.products);
                }
            } catch (error) {
                console.error("Gagal memuat data penjualan:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchSalesData();
    }, []);

    const chartData = {
        labels: salesData.map((data: any) => data.userName || "Unknown"),
        datasets: [
            {
                label: "Statistik Penjualan",
                data: salesData.map((data: any) => data.totalSales),
                backgroundColor: "#ff66cc",
            },
        ],
    };

    if (loading || status === "loading") {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-sm text-slate-400">Memuat dashboard admin...</p>
            </main>
        );
    }

    const user = session?.user as any;
    if(!user || user.role !== "admin") {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-2">
                    <p className="text-sm text-slate-400">
                        Kamu tidak punya akses ke halaman admin
                    </p>
                    <a href="/" className="text-xs text-sky-400 underline">Kembali ke beranda</a>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
                <h1 className="text-xl font-semibold mb-3">Dashboard Admin</h1>
                <div className="bg-slate-900 p-6 rounded-2xl">
                    <h2 className="text-xl font-semibold mb-4">Statistik Penjualan</h2>
                    {loading ? (
                        <p>Memuat data...</p>
                    ) : (
                        <Bar data={chartData} options={{responsive: true}}/>
                    )}
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                    <a href="/admin/products" className="rounded-lg border border-slate-700 px-4 py-2 hover:bg-slate-800">
                        Kelola produk
                    </a>
                    <a href="/admin/orders" className="rounded-lg border border-slate-700 px-4 py-2 hover:bg-slate-800">
                        Kelola pesanan
                    </a>
                </div>
                <a href="/account" className="mt-5 inline-flex rounded-lg border border-slate-700 px-4 py-2 text-xs hover:bg-slate-800">Kembali ke akun</a>
            </div>
        </main>
    );
}