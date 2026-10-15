import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';

export async function GET() {
  try {
    await requireUser();
    const now=new Date();
    const startToday=new Date(now); startToday.setHours(0,0,0,0);
    const endToday=new Date(now); endToday.setHours(23,59,59,999);
    const start7=new Date(startToday); start7.setDate(start7.getDate()-6);
    const [products,sales,purchases,lowStock,salesAgg,todayAgg,todayCount,profitAgg,recent,chartSales]=await Promise.all([
      prisma.product.count({where:{active:true}}),
      prisma.sale.count(),
      prisma.purchase.count(),
      prisma.product.count({where:{active:true,stock:{lte:5}}}),
      prisma.sale.aggregate({_sum:{total:true}}),
      prisma.sale.aggregate({where:{date:{gte:startToday,lte:endToday}},_sum:{total:true}}),
      prisma.sale.count({where:{date:{gte:startToday,lte:endToday}}}),
      prisma.saleItem.aggregate({_sum:{profit:true}}),
      prisma.sale.findMany({orderBy:{date:'desc'},take:8}),
      prisma.sale.findMany({where:{date:{gte:start7,lte:endToday}},select:{date:true,total:true}})
    ]);
    const days=['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
    const chart=Array.from({length:7},(_,i)=>{const d=new Date(start7);d.setDate(start7.getDate()+i);const key=d.toISOString().slice(0,10);const total=chartSales.filter(x=>new Date(x.date).toISOString().slice(0,10)===key).reduce((a,x)=>a+x.total,0);return {day:days[d.getDay()],total}});
    return NextResponse.json({products,sales,purchases,lowStock,revenue:salesAgg._sum.total||0,profit:profitAgg._sum.profit||0,todayRevenue:todayAgg._sum.total||0,todayTransactions:todayCount,recent,chart});
  } catch { return NextResponse.json({message:'Unauthorized'},{status:401}); }
}
