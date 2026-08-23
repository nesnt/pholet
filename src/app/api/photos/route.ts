// src/app/api/photos/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { drive } from "@/lib/gdrive";
import { Readable } from "stream";
// 1. GET: Ambil foto Publik + foto Privat milik user yang sedang login saja
export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    const photos = await db.photo.findMany({
      where: {
        OR: [
          { isPrivate: false }, // Ambil semua foto Publik
          ...(userId ? [{ isPrivate: true, userId }] : []), // Ambil foto Privat HANYA jika milik user yang sedang login
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return NextResponse.json({ photos });
  } catch (error) {
    console.error("GET Photos Error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data foto" },
      { status: 500 }
    );
  }
}

// 2. POST: Upload foto baru (dengan pilihan isPrivate)
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { message: "Anda harus login terlebih dahulu!" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const caption = (formData.get("caption") as string) || "";
    const category = (formData.get("category") as string) || "Street";
    const aspectRatio = (formData.get("aspectRatio") as string) || "portrait";
    const isPrivate = formData.get("isPrivate") === "true"; // BACA PRIVASI

    // Metadata EXIF
    const camera = (formData.get("camera") as string) || "";
    const lens = (formData.get("lens") as string) || "";
    const filmStock = (formData.get("filmStock") as string) || "";
    const iso = (formData.get("iso") as string) || "";
    const aperture = (formData.get("aperture") as string) || "";
    const shutterSpeed = (formData.get("shutterSpeed") as string) || "";
    const location = (formData.get("location") as string) || "";

    if (!file || !title) {
      return NextResponse.json(
        { message: "Berkas foto dan judul wajib diisi!" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uniqueFilename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

    // Upload ke Google Drive
    const stream = Readable.from(buffer);
    const driveResponse = await drive.files.create({
      requestBody: {
        name: uniqueFilename,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID || ""],
      },
      media: {
        mimeType: file.type,
        body: stream,
      },
      fields: "id",
    });

    const fileId = driveResponse.data.id;
    if (!fileId) {
      throw new Error("Gagal mengunggah foto ke Google Drive.");
    }

    const publicUrl = `https://drive.google.com/uc?id=${fileId}`;

    // Simpan data foto ke PostgreSQL (sertakan isPrivate)
    const newPhoto = await db.photo.create({
      data: {
        title,
        caption,
        url: publicUrl,
        category,
        aspectRatio,
        isPrivate, // SIMPAN STATUS PRIVASI
        camera,
        lens,
        filmStock,
        iso,
        aperture,
        shutterSpeed,
        location,
        userId,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    return NextResponse.json(
      { message: "Foto berhasil diunggah!", photo: newPhoto },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengunggah foto." },
      { status: 500 }
    );
  }
} 