import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json(
        { message: 'Silakan masuk terlebih dahulu!' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { name, bio } = data;

    // Batasan input (Input Boundary Validation)
    if (name !== undefined && (typeof name !== 'string' || !name.trim() || name.length > 100)) {
      return NextResponse.json(
        { message: 'Nama harus berupa teks valid (1-100 karakter)!' },
        { status: 400 }
      );
    }

    if (bio !== undefined && (typeof bio !== 'string' || bio.length > 500)) {
      return NextResponse.json(
        { message: 'Bio maksimal 500 karakter!' },
        { status: 400 }
      );
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(bio !== undefined && { bio: bio.trim() }),
      },
    });

    return NextResponse.json({
      message: 'Profil berhasil diperbarui!',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar,
      },
    });

  } catch (error: any) {
    console.error('Update user error:', error);
    // Hindari membocorkan detail error internal/database ke pengguna
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server saat memperbarui data profil.' },
      { status: 500 }
    );
  }
}
