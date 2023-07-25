import Home from "./Home";
import Waiting from "./Waiting";
import fs from "fs";
import mysql from "mysql2";

async function Servidor() {
  let executed = false;

  if (!executed){
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
        executed = true;
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
  
    runSQLScript();
    executed = true;
  }

  return <div>
    {!executed && <Waiting />}
    {executed && <Home executed={executed} />}
    </div>;
}

export default Servidor;
