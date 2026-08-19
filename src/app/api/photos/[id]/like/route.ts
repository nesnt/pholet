import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: photoId } = await params;

    // Increment likesCount di database (+1) sesuai kriteria like tanpa batas
    const updatedPhoto = await db.photo.update({
      where: { id: photoId },
      data: {
        likesCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      message: "Like berhasil ditambahkan!",
      likesCount: updatedPhoto.likesCount,
    });
  } catch (error) {
    console.error("Like Photo Error:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui Like foto" },
      { status: 500 }
    );
  }
}
