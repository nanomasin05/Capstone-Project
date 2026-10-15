import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
export async function GET(){try{await requireUser();return NextResponse.json(await prisma.supplier.findMany({orderBy:{name:'asc'}}));}catch{return NextResponse.json({message:'Unauthorized'},{status:401});}}
