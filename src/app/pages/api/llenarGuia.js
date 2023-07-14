import { llenarGuiaUeb } from "../../../../lib/funciones_prisma";

export default async function handle(req, res) {
  try {
    let { guiaId, uebId, mes, anno } = req.body;

    let result = await llenarGuiaUeb(req, guiaId, uebId, mes, anno);

    res.status(200).json(result);
  } catch (error) {
    let message =
      error instanceof Error ? error.message : "Error interno del servidor.";
    res.status(200).json(message);
  }
}
