import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import path from "path";
import { unlink } from "fs/promises";

// 1. PUT: Edit Judul / Caption Foto (Update)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    const { id: photoId } = await params;

    if (!userId) {
      return NextResponse.json(
        { message: "Anda harus login terlebih dahulu!" },
        { status: 401 }
      );
    }

    // Cek keberadaan foto & kepemilikan
    const existingPhoto = await db.photo.findUnique({
      where: { id: photoId },
    });

    if (!existingPhoto) {
      return NextResponse.json(
        { message: "Foto tidak ditemukan" },
        { status: 404 }
      );
    }

    if (existingPhoto.userId !== userId) {
      return NextResponse.json(
        { message: "Anda tidak memiliki hak akses untuk mengedit foto ini!" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, caption, category } = body;

    const updatedPhoto = await db.photo.update({
      where: { id: photoId },
      data: {
        title: title || existingPhoto.title,
        caption: caption !== undefined ? caption : existingPhoto.caption,
        category: category || existingPhoto.category,
      },
    });

    return NextResponse.json({
      message: "Foto berhasil diperbarui!",
      photo: updatedPhoto,
    });
  } catch (error) {
    console.error("Update Photo Error:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui foto" },
      { status: 500 }
    );
  }
}

// 2. DELETE: Hapus Foto dari DB dan Berkas Fisik di public/uploads (Delete)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    const { id: photoId } = await params;

    if (!userId) {
      return NextResponse.json(
        { message: "Anda harus login terlebih dahulu!" },
        { status: 401 }
      );
    }

    const existingPhoto = await db.photo.findUnique({
      where: { id: photoId },
    });

    if (!existingPhoto) {
      return NextResponse.json(
        { message: "Foto tidak ditemukan" },
        { status: 404 }
      );
    }

    if (existingPhoto.userId !== userId) {
      return NextResponse.json(
        { message: "Anda tidak memiliki hak akses untuk menghapus foto ini!" },
        { status: 403 }
      );
    }

    // Hapus record foto dari PostgreSQL via Prisma
    await db.photo.delete({
      where: { id: photoId },
    });

    // Hapus berkas fisik gambar di public/uploads jika ada
    try {
      if (existingPhoto.url && existingPhoto.url.startsWith("/uploads/")) {
        const fileDiskPath = path.join(
          process.cwd(),
          "public",
          existingPhoto.url.replace("/", "")
        );
        await unlink(fileDiskPath);
      }
    } catch (fsErr) {
      console.warn("Gagal menghapus berkas fisik (mungkin sudah terhapus):", fsErr);
    }

    return NextResponse.json({
      message: "Foto berhasil dihapus!",
    });
  } catch (error) {
    console.error("Delete Photo Error:", error);
    return NextResponse.json(
      { message: "Gagal menghapus foto" },
      { status: 500 }
    );
  }
}
