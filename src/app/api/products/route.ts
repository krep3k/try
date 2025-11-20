import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/product";
import { error } from "console";
import { getToken } from "next-auth/jwt";

async function getUserId(req: NextRequest) {
    const token =  await getToken({req, secret: process.env.NEXTAUTH_SECRET});
    if (!token || !token.sub) return null;
    return token.sub;
}

export async function GET() {
    try {
        await connectDB();
        const products = await Product.find({isActive: true}).sort({createdAt: -1}).lean();
        return NextResponse.json({products});
    } catch (err) {
        return NextResponse.json({error: "Gagal memuat produk."}, {status: 500});
    }
}

export async function POST(req: NextRequest) {
    const userId = await getUserId(req);
    if (!userId) {
        return NextResponse.json({error: "UNAUTHORIZED"}, {status: 401});
    }

    const body = await req.json();
    const {name, category, description, price, stock, imageUrl, slug} = body;

    if (!name || !slug || !price) {
        return NextResponse.json({error: "Nama, slug, dan harga wajib diisi."}, {status: 400});
    }

    await connectDB();

    const exist = await Product.findOne({slug}).lean();
    if (exist) {
        return NextResponse.json({error: "Slug produk sudah digunakan."}, {status: 409});
    }

    const product = new Product({
        name,
        slug,
        price,
        stock,
        imageUrl,
        category,
        description,
        userId,
    });
    await product.save();
    return NextResponse.json({ok: true, product}, {status: 201});
}