import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, name } = body;

        if (!email || !password || !name) {
            return NextResponse.json(
                { message: "mohon isi semua data input yang di minta" },
                { status: 400 }
            )
        }

        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "email is already been taken" },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            }
        });

        return NextResponse.json(
            {
                message: "Register is Complete",
                user: {
                    id: newUser.id,
                    email: newUser.email,
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