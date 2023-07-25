// global.js
import fs from "fs";
import mysql from "mysql2";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 14400 });

let executed = cache.get("executed") || false;

export async function cargarDatosIniciales() {
//   let executed = false;
//   let executed = cache.get("executed");

  setTimeout(() => {
    executed = true;
    cache.set("executed", true, 14400);
  }, 10000);

  if (!executed) {
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "mariadb",
      database: "musala",
    });

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

    const runSQLScript = async () => {
      try {
        let sqlScript = await leer("src/pages/api/musala.sql");
        sqlScript = sqlScript.replace(/(\r\n|\n|\r)/gm, " ");

        const queries = sqlScript
          .split(";")
          .filter((query) => query.trim() !== "");

        for (const query of queries) {
          await executeQuery(query);
        }
        console.log("All queries executed successfully!");
      } catch (error) {
        console.error("Error executing queries:", error);
      } finally {
        connection.end();
      }
    };

    const executeQuery = async (query) => {
      return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
    };

    await runSQLScript();
    executed = true;

    // cache.set("executed", executed, 14400);
  }

  return executed;
}

export function getExecutedState() {
  return cache.get("executed");
}

export function clearCache() {
  cache.flushAll();
}
