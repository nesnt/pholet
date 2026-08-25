// src/app/api/photos/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import path from "path";
import { writeFile } from "fs/promises";
import ExifReader from "exifreader";

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

    // Metadata EXIF dari form (hanya filmStock dan location yang relevan dari input manual, sisanya dari EXIF)
    const filmStock = (formData.get("filmStock") as string) || "";
    const location = (formData.get("location") as string) || "";

    if (!file || !title) {
      return NextResponse.json(
        { message: "Berkas foto dan judul wajib diisi!" },
        { status: 400 }
      );
    }

    // Simpan file fisik ke folder public/uploads
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let camera = "";
    let lens = "";
    let iso = "";
    let aperture = "";
    let shutterSpeed = "";
    
    try {
      const tags = ExifReader.load(buffer);
      const make = tags['Make']?.description || "";
      const model = tags['Model']?.description || "";
      camera = [make, model].filter(Boolean).join(" ");
      lens = tags['LensModel']?.description || "";
      iso = tags['ISOSpeedRatings']?.description ? `${tags['ISOSpeedRatings'].description}` : "";
      
      // Parse FNumber correctly (e.g., "2.8" -> "f/2.8")
      if (tags['FNumber']?.description) {
        aperture = `f/${tags['FNumber'].description}`;
      }
      
      // Parse ExposureTime (e.g., "1/250")
      if (tags['ExposureTime']?.description) {
        shutterSpeed = `${tags['ExposureTime'].description}s`;
      }
    } catch (err) {
      console.log("No EXIF data found or error parsing EXIF:", err);
    }

    const uniqueFilename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, uniqueFilename);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFilename}`;

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