import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser, requireAdmin } from '@/lib/auth';

export async function GET() {
  try { await requireUser(); return NextResponse.json(await prisma.product.findMany({ where: { active: true }, include: { supplier: true }, orderBy: { name: 'asc' } })); }
  catch { return NextResponse.json({ message: 'Unauthorized' }, { status: 401 }); }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const b = await req.json();
    const initialStock = Number(b.initialStock || 0);
    const p = await prisma.product.create({ data: { code: b.code, name: b.name, category: b.category, unit: b.unit, purchasePrice: Number(b.purchasePrice||0), generalPrice: Number(b.generalPrice||0), partnerPrice: Number(b.partnerPrice||0), initialStock, stock: initialStock, minimumStock: Number(b.minimumStock||0), supplierId: b.supplierId ? Number(b.supplierId) : null } });
    return NextResponse.json(p, { status: 201 });
  } catch (e: any) { return NextResponse.json({ message: e.code === 'P2002' ? 'Kode barang sudah digunakan.' : 'Gagal menyimpan barang.' }, { status: 400 }); }
}
