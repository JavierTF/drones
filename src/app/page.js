import Home from "./Home";
import fs from "fs";
import prisma from '../../lib/prisma'

async function Servidor() {
  let sql;

  const leer = (filePath) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };

  const main = async () => {
    try {
      sql = await leer("src/pages/api/musala.sql");
      if (sql) {
        const queries = sql.split(";").filter((query) => query.trim() !== "");

        // almost, error 1064
        /* Although a file exported by HeidiSQL is used, it gives this error, taking into account the pressure of time, the developer decides to leave it at this point and opt for a slightly more orthodox variant. */
        for (const query of queries) {
          try {
            await prisma.$queryRaw`${query}`;
          } catch (error) {
            console.error("Error en la consulta:", error.message);
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      await prisma.$disconnect();
    }
  };

  main();

  return (
    <div>
      <Home />
    </div>
  );
}

export default Servidor;
