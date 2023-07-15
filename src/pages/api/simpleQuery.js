import prisma from "../../../lib/prisma";

// prisma.$use(async (params, next) => {
//   return salvar_trazas(params, next, prisma /*, null*/);
// });

const Handle = async (req, res) => {
  try {
    const { table, action, datos } = req.body;
    let currentData = { table, action, datos };

    var result;
    if (!currentData?.action) currentData.action = "create";

    if (currentData.action === "create") {
      result = await prisma[`${currentData.table}`].create({
        data: { ...currentData.datos },
      });
    }

    if (currentData.action !== "create") {
      var id = Number(req?.query?.id);
    }

    if (currentData.action === "update") {
      result = await prisma[`${currentData.table}`].update({
        where: {
          id,
        },
        data: {
          ...currentData.datos,
        },
      });
    }

    if (currentData.action === "update") {
      result = await prisma[`${currentData.table}`].update({
        where: {
          id: currentData.datos.id,
        },
        data: {
          ...currentData.datos,
        },
      });
    }

    if (currentData.action === "delete") {
      result = await prisma[`${currentData.table}`].delete({
        where: {
          id,
        },
      });
    }

    if (currentData.action === "findUnique") {
      result = await prisma[`${currentData.table}`].findUnique({
        ...currentData.datos,
      });
    }

    if (currentData.action === "findMany") {
      result = await prisma[`${currentData.table}`].findMany({
        ...currentData.datos,
      });
    }

    if (currentData.action === "upsert") {
      result = await prisma[`${currentData.table}`].upsert({
        ...currentData.datos,
      });
    }

    if (currentData.action === "groupBy") {
      result = await prisma[`${currentData.table}`].groupBy({
        ...currentData.datos,
      });
    }

    if (currentData.action === "raw") {
      result = [];

      if (currentData.table === "getDrones") {
        result =
          await prisma.$queryRaw`SELECT d.serial_number, d.id, modelo.name AS model, d.weight_limit, d.battery_capacity, s.name AS state,
          CONCAT_WS(', ', GROUP_CONCAT(m.name SEPARATOR ', ')) AS medication
          FROM drone d
          LEFT JOIN drone_medication dm ON d.id = dm.drone_id
          LEFT JOIN medication m ON dm.medication_id = m.id
          LEFT JOIN state s ON s.id = d.state
          LEFT JOIN model modelo ON modelo.id = d.model
          WHERE ${currentData.datos.model_id} IS NULL OR modelo.id = ${currentData.datos.model_id}
          GROUP BY d.serial_number, d.id, modelo.name, d.weight_limit, d.battery_capacity, s.name;`;

        result = JSON.parse(
          JSON.stringify(result, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
          )
        );
      } else if (currentData.table === "loadingDrone") {
        result =
          await prisma.$queryRaw`SELECT d.id, d.serial_number, modelo.name AS model, d.weight_limit, d.battery_capacity, s.name AS state,
          GROUP_CONCAT(m.name SEPARATOR ', ') AS medications
          FROM drone d
          LEFT JOIN state s ON s.id = d.state
          LEFT JOIN drone_medication dm ON d.id = dm.drone_id
          LEFT JOIN medication m ON dm.medication_id = m.id
          LEFT JOIN model modelo ON modelo.id = d.model
          WHERE s.name = 'IDLE' OR s.name = 'LOADING'
          GROUP BY d.id, d.serial_number, modelo.name, d.weight_limit, d.battery_capacity, s.name;`;

        result = JSON.parse(
          JSON.stringify(result, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
          )
        );
      } else if (currentData.table === "getMedicationByDrone") {
        result =
          await prisma.$queryRaw`SELECT m.id, m.name, m.weight, m.code, m.image
          FROM medication m
          LEFT JOIN drone_medication dm ON dm.medication_id = m.id
          LEFT JOIN drone d ON d.id = dm.drone_id
          WHERE d.id = ${currentData.datos.drone_id}`;

        result = JSON.parse(
          JSON.stringify(result, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
          )
        );
      } else if (currentData.table === "deleteMedicationByDrone") {
        result =
          await prisma.$queryRaw`DELETE 
          FROM drone_medication
          WHERE drone_medication.drone_id = ${currentData.datos.drone_id}`;

        result = JSON.parse(
          JSON.stringify(result, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
          )
        );
      } else if (currentData.table === "getDrone") {
        result =
          await prisma.$queryRaw`SELECT *
          FROM drone d
          WHERE d.serial_number = 'ert_ert';`;

        result = JSON.parse(
          JSON.stringify(result, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
          )
        );
      } else {
        result = await prisma.$queryRaw`${currentData.datos.consulta}`;

        result = JSON.parse(
          JSON.stringify(result, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
          )
        );
      }
    }

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    // console.error(error);
    let message =
      error instanceof Error ? error.message : "Internal Server Error.";
    res.status(401).json({ message: message });
  }
};

export default Handle;
