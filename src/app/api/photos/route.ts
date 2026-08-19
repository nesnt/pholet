import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

// 1. GET: Ambil semua foto dari PostgreSQL
export async function GET() {
  try {
    const photos = await db.photo.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
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

// 2. POST: Upload foto baru ke folder public/uploads & Simpan ke PostgreSQL
export async function POST(req: Request) {
  try {
    // Cek Session User
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { message: "Anda harus login terlebih dahulu!" },
        { status: 401 }
      );
    }

    // Ambil data form (FormData)
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const caption = (formData.get("caption") as string) || "";
    const category = (formData.get("category") as string) || "Street";
    const aspectRatio = (formData.get("aspectRatio") as string) || "portrait";
    
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

    // Pastikan folder public/uploads tersedia
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Simpan file fisik ke folder public/uploads
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Buat nama file unik menggunakan timestamp
    const uniqueFilename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    // Tulis berkas ke disk lokal
    await writeFile(filePath, buffer);

    // Path URL yang dapat diakses publik dari browser (misal: /uploads/171829384-foto.jpg)
    const publicUrl = `/uploads/${uniqueFilename}`;

    // Simpan metadata foto ke database PostgreSQL via Prisma
    const newPhoto = await db.photo.create({
      data: {
        title,
        caption,
        url: publicUrl,
        category,
        aspectRatio,
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
          select: { id: true, name: true, username: true, avatar: true },
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
