// import salvar_trazas from "../../../../lib/trazas";
import prisma from "../../../../lib/prisma";
import executeQuery from "./executeQuery";

// prisma.$use(async (params, next) => {
//   return salvar_trazas(params, next, prisma /*, null*/);
// });

// ADICIONAR, MODIFICAR, ELIMINAR
const Handle = async (req, res) => {
  try {
    console.log("---simpleQuery", req.body);
    let result = await executeQuery(req, res, prisma);
    //console.log("result", result);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    // console.error(error);
    let message = error instanceof Error ? error.message : "Error interno del servidor.";
    res.status(401).json({ message: message });
  }
};

export default Handle;
