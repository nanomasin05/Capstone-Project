import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(){ try{await requireAdmin(); return NextResponse.json(await prisma.user.findMany({select:{id:true,name:true,username:true,role:true,active:true,createdAt:true},orderBy:{name:'asc'}}));}catch{return NextResponse.json({message:'Forbidden'},{status:403});}}
export async function POST(req:Request){try{await requireAdmin();const b=await req.json();const hash=await bcrypt.hash(b.password,10);const u=await prisma.user.create({data:{name:b.name,username:b.username,passwordHash:hash,role:b.role==='ADMIN'?'ADMIN':'STAFF'}});return NextResponse.json({id:u.id},{status:201});}catch(e:any){return NextResponse.json({message:e.code==='P2002'?'Username sudah digunakan.':'Gagal membuat pengguna.'},{status:400});}}
