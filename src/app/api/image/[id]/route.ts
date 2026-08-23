import { NextResponse } from "next/server";
import { drive } from "@/lib/gdrive";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch file stream from Google Drive
    const response = await drive.files.get(
      { fileId: id, alt: "media" },
      { responseType: "stream" }
    );

    // Convert Node.js stream to Web ReadableStream
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Readable } = require("stream");
    const webStream = Readable.toWeb(response.data);

    // Set cache control for 1 year (31536000 seconds)
    return new NextResponse(webStream, {
      headers: {
        "Content-Type": response.headers["content-type"] || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return new NextResponse("Error fetching image", { status: 500 });
  }
}
