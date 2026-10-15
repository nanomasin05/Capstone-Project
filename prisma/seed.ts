import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminHash = await bcrypt.hash('admin123', 10);
  const staffHash = await bcrypt.hash('staff123', 10);

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: { passwordHash: adminHash, role: 'ADMIN', active: true },
    create: { name: 'Pengurus UT Shop', username: 'admin', passwordHash: adminHash, role: 'ADMIN' }
  });
  await prisma.user.upsert({
    where: { username: 'staff' },
    update: { passwordHash: staffHash, role: 'STAFF', active: true },
    create: { name: 'Staf UT Shop', username: 'staff', passwordHash: staffHash, role: 'STAFF' }
  });

  const supplier1 = await prisma.supplier.upsert({
    where: { name: 'Koperasi Karunika' },
    update: {},
    create: { name: 'Koperasi Karunika' }
  });
  const supplier2 = await prisma.supplier.upsert({
    where: { name: 'Toko Terdekat' },
    update: {},
    create: { name: 'Toko Terdekat' }
  });

  const products = [
    { code: 'UT-MUG', name: 'Mug Merchandise UT', category: 'Merchandise UT', unit: 'pcs', purchasePrice: 45000, generalPrice: 60000, partnerPrice: 55000, initialStock: 20, minimumStock: 5, supplierId: supplier1.id },
    { code: 'UT-TOTEBAG', name: 'Totebag UT', category: 'Merchandise UT', unit: 'pcs', purchasePrice: 50000, generalPrice: 70000, partnerPrice: 65000, initialStock: 15, minimumStock: 4, supplierId: supplier1.id },
    { code: 'MIN-AQUA', name: 'Air Mineral', category: 'Minuman', unit: 'botol', purchasePrice: 4000, generalPrice: 6000, partnerPrice: 5500, initialStock: 50, minimumStock: 10, supplierId: supplier2.id },
    { code: 'POP-MIE', name: 'Pop Mie', category: 'Makanan', unit: 'pcs', purchasePrice: 6000, generalPrice: 9000, partnerPrice: 8500, initialStock: 30, minimumStock: 8, supplierId: supplier2.id }
  ];

  for (const p of products) {
    await prisma.product.upsert({ where: { code: p.code }, update: p, create: { ...p, stock: p.initialStock } });
  }

  await prisma.shuSetting.upsert({
    where: { name: 'SHU Default' },
    update: {},
    create: { name: 'SHU Default', percentage: 0, description: 'Isi setelah persentase resmi pembagian SHU dikonfirmasi pihak UT.' }
  });

  console.log('Seed selesai. Login admin/admin123 atau staff/staff123');
}

main().finally(() => prisma.$disconnect());
