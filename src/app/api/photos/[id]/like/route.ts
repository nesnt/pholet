// src/app/api/photos/[id]/like/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    const photo = await db.photo.findUnique({
      where: { id },
      select: { id: true, isPrivate: true, userId: true },
    });

    if (!photo) {
      return NextResponse.json({ message: "Foto tidak ditemukan!" }, { status: 404 });
    }

    // Blokir aksi like pada foto privat milik pengguna lain
    if (photo.isPrivate && photo.userId !== userId) {
      return NextResponse.json(
        { message: "Tidak dapat menyukai karya yang bersifat privat!" },
        { status: 403 }
      );
    }

    // Tambah nilai likesCount sebesar +1 di PostgreSQL
    const updatedPhoto = await db.photo.update({
      where: { id },
      data: {
        likesCount: {
          increment: 1,
        },
      },
      select: { likesCount: true },
    });

    return NextResponse.json({
      message: "Like ditambahkan!",
      likesCount: updatedPhoto.likesCount,
    });
  } catch (error) {
    console.error("Like Error:", error);
    return NextResponse.json({ message: "Gagal menyukai foto." }, { status: 500 });
  }
}