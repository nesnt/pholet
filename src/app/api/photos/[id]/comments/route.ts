import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: photoId } = await params;
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { message: "Anda harus login terlebih dahulu!" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { text } = body;

    if (!text || text.trim() === "") {
      return NextResponse.json(
        { message: "Komentar tidak boleh kosong" },
        { status: 400 }
      );
    }

    // Pastikan foto yang dikomentari ada
    const photo = await db.photo.findUnique({
      where: { id: photoId },
    });

    if (!photo) {
      return NextResponse.json(
        { message: "Foto tidak ditemukan" },
        { status: 404 }
      );
    }

    // Buat komentar
    const newComment = await db.comment.create({
      data: {
        text: text.trim(),
        userId,
        photoId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Komentar berhasil ditambahkan", comment: newComment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add Comment Error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat menambahkan komentar" },
      { status: 500 }
    );
  }
}
