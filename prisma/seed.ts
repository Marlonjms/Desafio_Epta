import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Criando usuários iniciais...');

  await prisma.user.createMany({
    data: [
      {
        name: 'Admin',
        email: 'admin@teste.com',
        password: bcrypt.hashSync('123456', 10),
        role: 'VISTORIADOR',
      },
      {
        name: 'Vendedor',
        email: 'vendedor@teste.com',
        password: bcrypt.hashSync('123456', 10),
        role: 'VENDEDOR',
      },
    ],
  });

  console.log('Sed executado com sucesso');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
