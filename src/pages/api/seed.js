const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
var path = require("path");

const prisma = new PrismaClient();

async function seed() {
  console.log("CURRENT", __dirname);
  console.log("Iniciando...");
  const sql = fs.readFileSync(path.join(__dirname, + "/api/musala.sql"), "utf8");
  console.log('SQL_TEXT', sql);

  let res = await prisma.$queryRaw(sql);
  console.log("RES PRISMA", res);

  if (res) {
    await prisma.$disconnect();
  } else {
    console.error(e);
    process.exit(1);
  }
}

export default seed;
