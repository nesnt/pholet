import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { validatePassword } from "@/utils/validation";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const email = body.email || body.username;
        const { password, name } = body;

        if (!email || !password || !name) {
            return NextResponse.json(
                { message: "Mohon lengkapi semua data input yang diminta!" },
                { status: 400 }
            )
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return NextResponse.json(
                { message: passwordValidation.errors.join(" ") },
                { status: 400 }
            );
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