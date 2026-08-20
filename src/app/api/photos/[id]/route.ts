// src/app/api/photos/[id]/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import path from "path";
import { unlink } from "fs/promises";

// 1. DELETE: Hapus Foto dari Database & Hapus File dari public/uploads
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Harus login!" }, { status: 401 });
    }

    const photo = await db.photo.findUnique({ where: { id } });

    if (!photo) {
      return NextResponse.json({ message: "Foto tidak ditemukan!" }, { status: 404 });
    }

    // Pastikan hanya pemilik foto yang bisa menghapus
    if (photo.userId !== userId) {
      return NextResponse.json({ message: "Tidak berhak menghapus foto ini!" }, { status: 403 });
    }

    // Hapus file gambar dari folder public/uploads
    if (photo.url && photo.url.startsWith("/uploads/")) {
      const fileName = photo.url.replace("/uploads/", "");
      const filePath = path.join(process.cwd(), "public", "uploads", fileName);
      try {
        await unlink(filePath);
      } catch (err) {
        console.warn("Gagal menghapus file fisik:", err);
      }
    }

    // Hapus record foto dari PostgreSQL
    await db.photo.delete({ where: { id } });

    return NextResponse.json({ message: "Foto berhasil dihapus!" });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ message: "Gagal menghapus foto" }, { status: 500 });
  }
}

// 2. PATCH: Edit Foto (Judul & Caption)
// 2. PATCH: Edit Foto (Judul, Caption, Kategori, & Privasi)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Harus login!" }, { status: 401 });
    }

    const body = await req.json();
    const { title, caption, category, isPrivate } = body;

    const photo = await db.photo.findUnique({ where: { id } });
    if (!photo) {
      return NextResponse.json({ message: "Foto tidak ditemukan!" }, { status: 404 });
    }

    if (photo.userId !== userId) {
      return NextResponse.json({ message: "Tidak berhak mengedit foto ini!" }, { status: 403 });
    }

    const updatedPhoto = await db.photo.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(caption !== undefined && { caption }),
        ...(category !== undefined && { category }),
        ...(isPrivate !== undefined && { isPrivate }),
      },
    });

    return NextResponse.json({ message: "Foto berhasil diperbarui!", photo: updatedPhoto });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ message: "Gagal memperbarui foto" }, { status: 500 });
  }
}