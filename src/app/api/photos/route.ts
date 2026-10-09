// src/app/api/photos/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { drive } from "@/lib/gdrive";
import { Readable } from "stream";
import ExifReader from "exifreader";
import {
  validatePhotoSize,
  isAllowedPhotoExtension,
  isAllowedPhotoMime,
  isValidImageHeader,
  ALLOWED_PHOTO_EXTENSIONS,
} from "@/utils/validation";
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

    // Ubah URL lama ke format proxy baru secara otomatis & pastikan tags adalah array
    const photosWithProxyUrl = photos.map(photo => {
      const tags = Array.isArray(photo.tags) ? photo.tags : [];
      let url = photo.url;
      if (photo.url.includes("drive.google.com/uc?id=")) {
        const fileId = new URL(photo.url).searchParams.get("id");
        if (fileId) {
          url = `/api/image/${fileId}`;
        }
      }
      return { ...photo, url, tags };
    });

    return NextResponse.json({ photos: photosWithProxyUrl });
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

    // Metadata EXIF dari form
    const location = (formData.get("location") as string) || "";
    const rawTags = (formData.get("tags") as string) || "";
    const tags = rawTags
      ? rawTags
          .split(",")
          .map((t) => t.trim().replace(/^#+/, ""))
          .filter((t) => t.length > 0)
      : [];

    if (!file || !title) {
      return NextResponse.json(
        { message: "Berkas foto dan judul wajib diisi!" },
        { status: 400 }
      );
    }

    // 1. Validasi Ukuran Berkas
    const sizeValidation = validatePhotoSize(file.size);
    if (!sizeValidation.isValid) {
      return NextResponse.json(
        { message: sizeValidation.error },
        { status: 400 }
      );
    }

    // 2. Validasi Ekstensi & Tipe MIME
    if (!isAllowedPhotoExtension(file.name) || !isAllowedPhotoMime(file.type, file.name)) {
      return NextResponse.json(
        { 
          message: `Format berkas '${file.name}' tidak didukung! Hanya format gambar (${ALLOWED_PHOTO_EXTENSIONS.join(", ")}) yang diperbolehkan.` 
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Validasi Magic Bytes (Deteksi isi biner asli gambar)
    if (!isValidImageHeader(buffer)) {
      return NextResponse.json(
        { message: "Berkas bukan gambar yang valid! Berkas dokumen (seperti PDF atau DOCX) tidak diizinkan." },
        { status: 400 }
      );
    }

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

    // Upload ke Google Drive
    const stream = Readable.from(buffer);
    let uploadedDriveFileId: string | null = null;

    try {
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

      uploadedDriveFileId = driveResponse.data.id || null;
      if (!uploadedDriveFileId) {
        throw new Error("Gagal mengunggah foto ke Google Drive.");
      }

      const publicUrl = `/api/image/${uploadedDriveFileId}`;

      // Simpan data foto ke PostgreSQL (sertakan isPrivate)
      const newPhoto = await db.photo.create({
        data: {
          title,
          caption,
          url: publicUrl,
          category,
          aspectRatio,
          isPrivate, // SIMPAN STATUS PRIVASI
          tags,
          camera,
          lens,
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
    } catch (dbOrDriveError) {
      // Jika upload ke Google Drive sempat berhasil tetapi proses penyimpanan ke database gagal,
      // bersihkan berkas di Google Drive agar tidak ada berkas tersisa tanpa relasi data di basis data
      if (uploadedDriveFileId) {
        try {
          await drive.files.delete({ fileId: uploadedDriveFileId });
        } catch (cleanupErr) {
          console.error("Gagal membersihkan berkas orphan di Google Drive:", cleanupErr);
        }
      }
      throw dbOrDriveError;
    }
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengunggah foto." },
      { status: 500 }
    );
  }
} 