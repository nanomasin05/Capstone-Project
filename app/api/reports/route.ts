import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    await requireUser();
    const { searchParams } = new URL(req.url); const from = searchParams.get('from'); const to = searchParams.get('to');
    const start = from ? new Date(`${from}T00:00:00`) : new Date('2000-01-01T00:00:00');
    const end = to ? new Date(`${to}T23:59:59.999`) : new Date('2100-01-01T00:00:00');
    const sales = await prisma.sale.findMany({ where: { date: { gte: start, lte: end } }, include: { items: { include: { product: true } } }, orderBy: { date: 'desc' } });
    const purchases = await prisma.purchase.findMany({ where: { date: { gte: start, lte: end } }, include: { supplier: true }, orderBy: { date: 'desc' } });
    const revenue = sales.reduce((s,x)=>s+x.total,0); const purchaseTotal = purchases.reduce((s,x)=>s+x.total,0); const profit = sales.reduce((s,x)=>s+x.items.reduce((a,i)=>a+i.profit,0),0);
    const products = await prisma.product.findMany({ where:{active:true}, include:{supplier:true}, orderBy:{stock:'asc'} });
    return NextResponse.json({ sales, purchases, products, summary:{revenue,purchaseTotal,profit,transactions:sales.length} });
  } catch { return NextResponse.json({message:'Unauthorized'}, {status:401}); }
}
