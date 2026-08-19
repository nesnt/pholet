// src/app/api/photos/[id]/like/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST: Tambah Like (+1) tanpa batas
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Tambah nilai likesCount sebesar +1 di PostgreSQL
    const updatedPhoto = await db.photo.update({
      where: { id },
      data: {
        likesCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      message: "Like ditambahkan!",
      likesCount: updatedPhoto.likesCount,
    });
  } catch (error) {
    console.error("Like Error:", error);
    return NextResponse.json({ message: "Gagal menyukai foto" }, { status: 500 });
  }
}