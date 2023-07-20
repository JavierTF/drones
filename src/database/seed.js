'use client'

const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const prisma = new PrismaClient();

async function main() {
  const sql = fs.readFileSync("database/musala.sql", "utf8");
  await prisma.$queryRaw(sql);
  console.log("Database data restored successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
