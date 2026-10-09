// src/app/api/photos/[id]/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { drive } from "@/lib/gdrive";
import path from "path";
import { unlink } from "fs/promises";

// 1. DELETE: Hapus Foto dari Database, Google Drive, & File Lokal
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

    // Pastikan hanya pemilik foto yang bisa menghapus (Otorisasi / Anti-IDOR)
    if (photo.userId !== userId) {
      return NextResponse.json({ message: "Tidak berhak menghapus foto ini!" }, { status: 403 });
    }

    // 1. Hapus file fisik dari Google Drive jika tersimpan di cloud
    if (photo.url && photo.url.startsWith("/api/image/")) {
      const fileId = photo.url.replace("/api/image/", "");
      if (/^[a-zA-Z0-9_-]+$/.test(fileId)) {
        try {
          await drive.files.delete({ fileId });
        } catch (driveErr) {
          console.warn("Gagal menghapus file dari Google Drive:", driveErr);
        }
      }
    }

    // 2. Hapus file dari folder public/uploads (dengan proteksi path traversal)
    if (photo.url && photo.url.startsWith("/uploads/")) {
      const rawFileName = photo.url.replace("/uploads/", "");
      const safeFileName = path.basename(rawFileName);
      const filePath = path.join(process.cwd(), "public", "uploads", safeFileName);
      try {
        await unlink(filePath);
      } catch (err) {
        console.warn("Gagal menghapus file fisik:", err);
      }
    }

    // 3. Hapus record foto dari basis data (Cascade menghapus comments)
    await db.photo.delete({ where: { id } });

    return NextResponse.json({ message: "Foto berhasil dihapus!" });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ message: "Gagal menghapus foto" }, { status: 500 });
  }
}

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
    const { title, caption, category, isPrivate, tags } = body;

    // Validasi batasan input (Boundary validation)
    if (title !== undefined && (typeof title !== "string" || !title.trim() || title.length > 150)) {
      return NextResponse.json({ message: "Judul foto harus berupa teks (1-150 karakter)!" }, { status: 400 });
    }
    if (caption !== undefined && (typeof caption !== "string" || caption.length > 1000)) {
      return NextResponse.json({ message: "Deskripsi foto maksimal 1000 karakter!" }, { status: 400 });
    }
    if (category !== undefined && typeof category !== "string") {
      return NextResponse.json({ message: "Kategori tidak valid!" }, { status: 400 });
    }
    if (isPrivate !== undefined && typeof isPrivate !== "boolean") {
      return NextResponse.json({ message: "Status privasi tidak valid!" }, { status: 400 });
    }
    if (tags !== undefined && !Array.isArray(tags) && typeof tags !== "string") {
      return NextResponse.json({ message: "Tag foto tidak valid!" }, { status: 400 });
    }

    const photo = await db.photo.findUnique({ where: { id } });
    if (!photo) {
      return NextResponse.json({ message: "Foto tidak ditemukan!" }, { status: 404 });
    }

    if (photo.userId !== userId) {
      return NextResponse.json({ message: "Tidak berhak mengedit foto ini!" }, { status: 403 });
    }

    const parsedTags = tags !== undefined
      ? (Array.isArray(tags)
          ? tags.map((t: string) => String(t).trim().replace(/^#+/, "")).filter(Boolean)
          : typeof tags === "string"
          ? tags.split(",").map((t: string) => t.trim().replace(/^#+/, "")).filter(Boolean)
          : [])
      : undefined;

    const updatedPhoto = await db.photo.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(caption !== undefined && { caption: caption.trim() }),
        ...(category !== undefined && { category }),
        ...(isPrivate !== undefined && { isPrivate }),
        ...(parsedTags !== undefined && { tags: parsedTags }),
      },
    });

    return NextResponse.json({ message: "Foto berhasil diperbarui!", photo: updatedPhoto });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ message: "Gagal memperbarui foto" }, { status: 500 });
  }
}