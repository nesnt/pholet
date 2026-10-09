import { NextResponse } from "next/server";
import { drive } from "@/lib/gdrive";
import { Readable } from "stream";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validasi format ID Google Drive untuk mencegah parameter injection / malformed query
    if (!id || !/^[a-zA-Z0-9_-]{10,120}$/.test(id)) {
      return new NextResponse("Identifier berkas tidak valid", { status: 400 });
    }

    // Ambil streaming berkas dari Google Drive
    const response = await drive.files.get(
      { fileId: id, alt: "media" },
      { responseType: "stream" }
    );

    // Konversi Node stream ke Web ReadableStream
    const webStream = Readable.toWeb(response.data as any);

    // Header proteksi & cache 1 tahun
    return new NextResponse(webStream as unknown as BodyInit, {
      headers: {
        "Content-Type": response.headers["content-type"] || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    console.error("Image proxy error:", error?.message || error);
    return new NextResponse("Gambar tidak ditemukan atau gagal dimuat", { status: 404 });
  }
}
