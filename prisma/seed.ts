import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    await prisma.categoria.createMany({
        data: [
            { nome: 'Salário', tipo: 'receita' },
            { nome: 'Freelance', tipo: 'receita' },
            { nome: 'Alimentação', tipo: 'despesa' },
            { nome: 'Transporte', tipo: 'despesa' },
            { nome: 'Moradia', tipo: 'despesa' },
        ],
        skipDuplicates: true,
    });

    console.log('Seed concluído.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
