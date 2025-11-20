"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function UploadProductPage() {
    const {data: session, status} = useSession();
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if(status === "loading") return;
        if(!session) {
            router.push("/login");
        }
    }, [session, status, router]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(submitting) return;
        setSubmitting(true);

        const body = {
            name: name.trim(),
            slug: slug.trim(),
            price: Number(price) || 0,
            stock: stock === "" ? 0 : Number(stock),
            category: category.trim() || undefined,
            description: description.trim() || undefined,
            imageUrl: imageUrl.trim() || undefined,
        };

        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            const data = await res.json();

            if(!res.ok) {
                alert(data.error || "Gagal menambahkan produk");
            } else {
                alert("Produk berhasil ditambahkan");
                setName("");
                setSlug("");
                setPrice("");
                setStock("");
                setCategory("");
                setDescription("");
                setImageUrl("");
                router.push("/");
            }
        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan saat menambahkan produk");
        } finally {
            setSubmitting(false);
        }
    };

    if (status === "loading" || (!session && status === "unauthenticated")) {
        return null;
    }

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center py-12 px-6">
            <div className="w-full max-w-lg bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-800">
                <h1 className="text-2xl font-semibold mb-6 text-center">Upload Product</h1>
                <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                    <label><input type="text" placeholder="Nama Produk" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 rounded-lg bg-slate-800 text-slate-100"/></label>
                    <label><input type="text" placeholder="Slug (Contoh: sepatu-hitam-keren)" value={slug} onChange={(e) => setSlug(e.target.value)} required className="w-full px-4 py-2 rounded-lg bg-slate-800 text-slate-100"/></label>
                    <label><input type="number" placeholder="Stok" value={stock} onChange={(e) => setStock(e.target.value)} required className="w-full px-4 py-2 rounded-lg bg-slate-800 text-slate-100"/></label>
                    <label><input type="number" placeholder="Harga" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full px-4 py-2 rounded-lg bg-slate-800 text-slate-100"/></label>
                    <label><input type="text" placeholder="Kategori" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-slate-800 text-slate-100"/></label>
                    <label><input type="text" placeholder="URL Gambar" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required className="w-full px-4 py-2 rounded-lg bg-slate-800 text-slate-100"/></label>
                    <label><textarea placeholder="Deskripsi" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-slate-800 text-slate-100"/></label>
                    <button type="submit" disabled={submitting} className="w-full py-2 px-4 bg-pink-500 rounded-lg text-slate-950 font-semibold shadow-lg hover:bg-pink-400">{submitting ? "Mengunggah..." : "Unggah Produk"}</button>
                </form>
            </div>
        </main>
    )
}