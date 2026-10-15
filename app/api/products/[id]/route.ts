import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(); const id = Number(params.id); const b = await req.json();
    const p = await prisma.product.update({ where: { id }, data: { code: b.code, name: b.name, category: b.category, unit: b.unit, purchasePrice: Number(b.purchasePrice||0), generalPrice: Number(b.generalPrice||0), partnerPrice: Number(b.partnerPrice||0), minimumStock: Number(b.minimumStock||0), supplierId: b.supplierId ? Number(b.supplierId) : null } });
    return NextResponse.json(p);
  } catch { return NextResponse.json({ message: 'Gagal memperbarui barang.' }, { status: 400 }); }
}
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try { await requireAdmin(); await prisma.product.update({ where: { id: Number(params.id) }, data: { active: false } }); return NextResponse.json({ ok: true }); }
  catch { return NextResponse.json({ message: 'Gagal menghapus barang.' }, { status: 400 }); }
}
