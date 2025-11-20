import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/product";
import User from "@/models/User";

export async function GET() {
    await connectDB();
    const products = await Product.aggregate([
        {
            $lookup: {
                from: "orders",
                localField: "_id",
                foreignField: "productId",
                as: "orders",
            },
        },

        {
            $project: {
                userId: 1,
                name: 1,
                totalSales: {$sum: {$size: "$orders"}},
                userName: {$arrayElemAt: ["$users.name", 0]},
            }
        }
    ]);
    return NextResponse.json({products});
}