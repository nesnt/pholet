import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { username, password, name } = body;

        if (!username || !password || !name) {
            return NextResponse.json(
                { message: "mohon isi semua data input yang di minta" },
                { status: 400 }
            )
        }

        const existingUser = await db.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "username or email is already been taken" },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.user.create({
            data: {
                username,
                name,
                password: hashedPassword,
            }
        });

        return NextResponse.json(
            {
                message: "Register is Complete",
                user: {
                    ud: newUser.id,
                    username: newUser.username,
                    name: newUser.name,
                },
            },
            { status: 201 }
        );
    } catch (err) {
        console.error("register err: ", err);
        return NextResponse.json(
            { message: "something happen, please try again next time" },
            { status: 500 }
        )
    }
}