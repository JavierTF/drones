import prisma from "/lib/prisma";
import salvar_trazas from "../../../../lib/trazas";
import {
  getUsuarioAutenticado,
} from "../../../../lib/funciones_comunes";

prisma.$use(async (params, next) => {
  return salvar_trazas(params, next, prisma);
});

export default async function handle(req, res) {
  try {
    //trazas inicio
    let usuarioAutenticado = await getUsuarioAutenticado(req);
    let usuarioId = 0;
    if (usuarioAutenticado) usuarioId = usuarioAutenticado?.usuarioId;
    //trazas fin

    const { guia_id } = req.body;

    await prisma.ga_cierre_extension.deleteMany({
      where: {
        guia_id: guia_id,
      },
      usuarioAutenticadoId: usuarioId,
    });

    await prisma.ga_plan_medidas.deleteMany({
      where: {
        OR: [
          {
            ga_aspecto_guia: {
              is: {
                guia_id: guia_id,
              },
            },
          },{
            ga_inciso_guia: {
              is: {
                guia_id: guia_id,
              },
            },
          }
        ]
      },
      usuarioAutenticadoId: usuarioId,
    });

    await prisma.ga_guia_aplicacion.deleteMany({
      where: {
        guia_id: guia_id,
      },
      usuarioAutenticadoId: usuarioId,
    });

    await prisma.ga_inciso_guia.deleteMany({
      where: {
        guia_id: guia_id,
      },
      usuarioAutenticadoId: usuarioId,
    });

    await prisma.ga_aspecto_guia.deleteMany({
      where: {
        guia_id: guia_id,
      },
      usuarioAutenticadoId: usuarioId,
    });

    await prisma.ga_norma_guia.deleteMany({
      where: {
        guia_id: guia_id,
      },
      usuarioAutenticadoId: usuarioId,
    });

    await prisma.ga_componente_guia.deleteMany({
      where: {
        guia_id: guia_id,
      },
      usuarioAutenticadoId: usuarioId,
    });

    //ga_usuario_rol_componente
    //ga_inciso_aspecto, ga_aspecto_norma, ga_norma_componente en CASCADE

    await prisma.ga_inciso.deleteMany({
      where: {
        ga_inciso_guia: {
          none: {},
        }
      },
      usuarioAutenticadoId: usuarioId,
    });

    await prisma.ga_aspecto.deleteMany({
      where: {
        ga_aspecto_guia: {
          none: {},
        }
      },
      usuarioAutenticadoId: usuarioId,
    });

    await prisma.ga_norma.deleteMany({
      where: {
        ga_norma_guia: {
          none: {},
        }
      },
      usuarioAutenticadoId: usuarioId,
    });

    await prisma.ga_componente.deleteMany({
      where: {
        ga_componente_guia: {
          none: {},
        }
      },
      usuarioAutenticadoId: usuarioId,
    });

    let result =  await prisma.ga_guia_autocontrol.delete({
      where: {
        id: guia_id,
      },
      usuarioAutenticadoId: usuarioId,
    });

    res.status(200).json(result);
  } catch (error) {
    let message =
      error instanceof Error ? error.message : "Error interno del servidor.";
    res.status(401).json({ message: message });
  }
}
