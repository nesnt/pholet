// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ message: "Logout berhasil!" });

    // Hapus cookie userId dengan mengatur tanggal kedaluwarsa ke masa lalu (expires: 0)
    response.cookies.set("userId", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
    });

    return response;
}