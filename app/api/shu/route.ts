import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser, requireAdmin } from '@/lib/auth';

export async function GET() {
  try { await requireUser(); const setting = await prisma.shuSetting.findFirst(); const profitAgg = await prisma.saleItem.aggregate({ _sum: { profit: true } }); const profit = profitAgg._sum.profit || 0; return NextResponse.json({ setting, profit, shu: profit * ((setting?.percentage || 0)/100) }); }
  catch { return NextResponse.json({message:'Unauthorized'}, {status:401}); }
}
export async function PUT(req: Request) {
  try { await requireAdmin(); const b=await req.json(); const setting=await prisma.shuSetting.findFirst(); if (!setting) return NextResponse.json({message:'Pengaturan SHU belum ada.'},{status:400}); const p=Number(b.percentage); if(p<0||p>100) return NextResponse.json({message:'Persentase harus 0-100.'},{status:400}); const updated=await prisma.shuSetting.update({where:{id:setting.id},data:{percentage:p,description:b.description||null}}); return NextResponse.json(updated); }
  catch { return NextResponse.json({message:'Gagal menyimpan pengaturan SHU.'},{status:400}); }
}
