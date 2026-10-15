import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';

export async function GET() {
  try { await requireUser(); return NextResponse.json(await prisma.purchase.findMany({ include: { supplier: true, items: { include: { product: true } } }, orderBy: { date: 'desc' } })); }
  catch { return NextResponse.json({ message: 'Unauthorized' }, { status: 401 }); }
}

export async function POST(req: Request) {
  try {
    await requireUser(); const b = await req.json();
    const items = b.items as { productId:number; quantity:number; unitPrice:number }[];
    if (!items?.length) return NextResponse.json({ message: 'Minimal 1 barang.' }, { status: 400 });
    const total = items.reduce((s, i) => s + Number(i.quantity) * Number(i.unitPrice), 0);
    const purchase = await prisma.$transaction(async tx => {
      const p = await tx.purchase.create({ data: { invoiceNo: b.invoiceNo, date: new Date(b.date || Date.now()), method: b.method, supplierId: b.supplierId ? Number(b.supplierId) : null, total, notes: b.notes || null } });
      for (const i of items) {
        const qty = Number(i.quantity), price = Number(i.unitPrice);
        await tx.purchaseItem.create({ data: { purchaseId: p.id, productId: Number(i.productId), quantity: qty, unitPrice: price, subtotal: qty * price } });
        await tx.product.update({ where: { id: Number(i.productId) }, data: { stock: { increment: qty }, purchasePrice: price } });
      }
      return p;
    });
    return NextResponse.json(purchase, { status: 201 });
  } catch (e:any) { return NextResponse.json({ message: e.code === 'P2002' ? 'Nomor invoice sudah digunakan.' : 'Gagal menyimpan pengadaan.' }, { status: 400 }); }
}
