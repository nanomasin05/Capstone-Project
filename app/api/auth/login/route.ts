import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { makeSession, setSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const username = String(body?.username ?? '').trim();
    const password = String(body?.password ?? '');

    if (!username || !password) {
      return NextResponse.json(
        {
          message: 'Username dan password wajib diisi.',
        },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: 'Username atau password salah.',
        },
        {
          status: 401,
        }
      );
    }

    const passwordValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordValid) {
      return NextResponse.json(
        {
          message: 'Username atau password salah.',
        },
        {
          status: 401,
        }
      );
    }

    if (user.role !== 'ADMIN' && user.role !== 'STAFF') {
      return NextResponse.json(
        {
          message: 'Role pengguna tidak valid.',
        },
        {
          status: 500,
        }
      );
    }

    const role: 'ADMIN' | 'STAFF' = user.role;

    setSession(
      makeSession({
        id: user.id,
        username: user.username,
        role: role,
      })
    );

    return NextResponse.json({
      ok: true,
      role: role,
      name: user.name,
    });
  } catch (error) {
    console.error('Login error:', error);

    return NextResponse.json(
      {
        message: 'Permintaan tidak valid.',
      },
      {
        status: 400,
      }
    );
  }
}