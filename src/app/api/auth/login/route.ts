import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { message: "please fill all required data!" },
                { status: 400 }
            )
        }

        const user = await db.user.findUnique({
            where: { email },
        })

        if (!user) {
            return NextResponse.json(
                { message: "email or password is wrong" },
                { status: 400 }
            )
        }

        const passwordValid = await bcrypt.compare(password, user.password);

        if (!passwordValid) {
            return NextResponse.json(
                { message: "email or password is wrong" },
                { status: 400 }
            )
        }

        const response = NextResponse.json({
            message: "login succes",
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                bio: user.bio
            }
        });

        response.cookies.set("userId", user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // Cookie berlaku selama 7 hari
            path: "/",
        });
        return response;
    } catch (err) {
        console.error("Login Error:", err);
        return NextResponse.json(
            { message: "Terjadi kesalahan pada server." },
            { status: 500 }
        );
    }
}