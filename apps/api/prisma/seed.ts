import { PrismaClient } from '@prisma/client';
import { generateEmployees } from '../src/seed/generate-employees';

const EMPLOYEE_COUNT = 10_000;
const SEED = 42;
const BATCH_SIZE = 1_000;

const prisma = new PrismaClient();

async function main(): Promise<void> {
  // Idempotent: a fresh, reproducible dataset every run.
  await prisma.employee.deleteMany();

  const employees = generateEmployees(EMPLOYEE_COUNT, SEED);

  for (let start = 0; start < employees.length; start += BATCH_SIZE) {
    await prisma.employee.createMany({ data: employees.slice(start, start + BATCH_SIZE) });
  }

  const total = await prisma.employee.count();
  // eslint-disable-next-line no-console
  console.log(`Seeded ${total} employees (seed=${SEED}).`);
}

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Seeding failed:', error);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
