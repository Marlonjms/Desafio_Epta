import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o seed do banco de dados...');

  // 1. Hash da senha padrão (123456)
  const password = await bcrypt.hash('123456', 10);

  // 2. Criar ou Atualizar Usuário VISTORIADOR (Admin)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@teste.com' },
    update: {},
    create: {
      email: 'admin@teste.com',
      name: 'Admin Vistoriador',
      password,
      role: Role.VISTORIADOR,
    },
  });
  console.log(`✅ Usuário criado: ${admin.email} (VISTORIADOR)`);

  // 3. Criar ou Atualizar Usuário VENDEDOR
  const vendedor = await prisma.user.upsert({
    where: { email: 'vendedor@teste.com' },
    update: {},
    create: {
      email: 'vendedor@teste.com',
      name: 'João Vendedor',
      password,
      role: Role.VENDEDOR,
    },
  });
  console.log(`✅ Usuário criado: ${vendedor.email} (VENDEDOR)`);

  // 4. Criar Motivos de Reprovação Padrão
  await prisma.motivoReprovacao.createMany({
    data: [
      { descricao: 'Pneu Careca' },
      { descricao: 'Vidro Trincado' },
      { descricao: 'Chassi Adulterado' },
      { descricao: 'Documentação Irregular' },
      { descricao: 'Farol Queimado' },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Motivos de reprovação inseridos.');

  console.log('🚀 Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
