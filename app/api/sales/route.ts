import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';

export async function GET() {
  try { await requireUser(); return NextResponse.json(await prisma.sale.findMany({ include: { items: { include: { product: true } } }, orderBy: { date: 'desc' } })); }
  catch { return NextResponse.json({ message: 'Unauthorized' }, { status: 401 }); }
}

export async function POST(req: Request) {
  try {
    await requireUser(); const b = await req.json(); const items = b.items as {productId:number; quantity:number}[];
    if (!items?.length) return NextResponse.json({ message: 'Minimal 1 barang.' }, { status: 400 });
    const productIds = items.map(i => Number(i.productId));
    const products = await prisma.product.findMany({ where: { id: { in: productIds }, active: true } });
    if (products.length !== productIds.length) return NextResponse.json({ message: 'Ada barang tidak ditemukan.' }, { status: 400 });
    const priceFor = (p:any) => b.buyerType === 'PARTNER' ? p.partnerPrice : p.generalPrice;
    const prepared = items.map(i => {
      const p = products.find(x => x.id === Number(i.productId))!; const qty = Number(i.quantity); const price = priceFor(p);
      return { p, qty, price, subtotal: qty * price, profit: qty * (price - p.purchasePrice) };
    });
    const shortage = prepared.find(x => x.p.stock < x.qty);
    if (shortage) return NextResponse.json({ message: `Stok ${shortage.p.name} tidak cukup. Sisa ${shortage.p.stock}.` }, { status: 400 });
    const total = prepared.reduce((s, x) => s + x.subtotal, 0); const paid = Number(b.paid || 0);
    if (paid < total) return NextResponse.json({ message: 'Pembayaran kurang dari total.' }, { status: 400 });
    const sale = await prisma.$transaction(async tx => {
      const s = await tx.sale.create({ data: { invoiceNo: b.invoiceNo, date: new Date(b.date || Date.now()), buyerType: b.buyerType, paymentMethod: b.paymentMethod, total, paid, change: paid-total } });
      for (const x of prepared) {
        await tx.saleItem.create({ data: { saleId: s.id, productId: x.p.id, quantity: x.qty, unitPrice: x.price, costPrice: x.p.purchasePrice, subtotal: x.subtotal, profit: x.profit } });
        await tx.product.update({ where: { id: x.p.id }, data: { stock: { decrement: x.qty } } });
      }
      return s;
    });
    return NextResponse.json(sale, { status: 201 });
  } catch (e:any) { return NextResponse.json({ message: e.code === 'P2002' ? 'Nomor invoice sudah digunakan.' : 'Gagal menyimpan penjualan.' }, { status: 400 }); }
}
