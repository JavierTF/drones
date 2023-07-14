import { getUsuarioAutenticado } from "../../../../lib/funciones_comunes";
import { getReporteDatos } from "../db/reportes/consultas_reportes";

// ADICIONAR, MODIFICAR, ELIMINAR
export async function executeQuery(req, res, prisma, newData = null) {
  //codigo de isis inicio////
  let usuarioAutenticado = await getUsuarioAutenticado(req);
  let usuarioId = 0;
  if (usuarioAutenticado) usuarioId = usuarioAutenticado?.usuarioId;
  //codigo de isis fin////
  let currentData = {};
  if (newData) {
    currentData.tabla = newData.tabla;
    currentData.accion = newData.accion;
    currentData.datos = newData.datos;
  } else {
    currentData.tabla = req.body.tabla;
    currentData.accion = req.body.accion;
    currentData.datos = req.body.datos;
  }

  var result;
  if (!currentData?.accion) currentData.accion = "adicionar";

  if (currentData.accion === "adicionar") {
    result = await prisma[`${currentData.tabla}`].create({
      data: { ...currentData.datos },
      usuarioAutenticadoId: usuarioId, //codigo de isis modificacion
    });
  }

  if (currentData.accion !== "adicionar") {
    var id = Number(req?.query?.id);
  }

  if (currentData.accion === "modificar") {
    result = await prisma[`${currentData.tabla}`].update({
      where: {
        id, //...req.query,//codigo de isis modificacion
      },
      data: {
        ...currentData.datos, //...req.body,//codigo de isis modificacion
      },
      usuarioAutenticadoId: usuarioId, //codigo de isis modificacion
    });
  }

  if (currentData.accion === "update") {
    //console.log("currentData", currentData);
    result = await prisma[`${currentData.tabla}`].update({
      where: {
        id: currentData.datos.id, //...req.query,//codigo de isis modificacion
      },
      data: {
        ...currentData.datos, //...req.body,//codigo de isis modificacion
      },
      usuarioAutenticadoId: usuarioId, //codigo de isis modificacion
    });
  }

  if (currentData.accion === "eliminar") {
    result = await prisma[`${currentData.tabla}`].delete({
      where: {
        id,
      },
      usuarioAutenticadoId: usuarioId, //codigo de isis modificacion
    });
  }

  if (currentData.accion === "get") {
    result = await prisma[`${currentData.tabla}`].findUnique({
      ...currentData.datos,
    });
  }

  if (currentData.accion === "buscar") {
    result = await prisma[`${currentData.tabla}`].findMany({
      ...currentData.datos,
    });
  }

  if (currentData.accion === "upsert") {
    result = await prisma[`${currentData.tabla}`].upsert({
      ...currentData.datos,
    });
  }

  if (currentData.accion === "agrupar") {
    result = await prisma[`${currentData.tabla}`].groupBy({
      ...currentData.datos,
    });
  }

  if (currentData.accion === "raw") {
    result = [];

    if (currentData.tabla === "reportes") {
      //de isis
      result = await getReporteDatos(prisma, currentData);
    } else if (currentData.tabla === "medidasList") {

      result = await prisma.$queryRaw`SELECT ga_plan_medidas.*, ga_plan_medidas.id AS acciones
      FROM ga_plan_medidas
      WHERE ((aspecto_guia_id = ${currentData.datos.aspecto_guia_id} AND aspecto_guia_id IS NOT NULL)
        OR (inciso_guia_id = ${currentData.datos.inciso_guia_id} AND inciso_guia_id IS NOT NULL))
      AND ueb_id = ${currentData.datos.ueb_id}
      ORDER BY fecha_limite;`;

      result = JSON.parse(
        JSON.stringify(result, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );

    } else if (currentData.tabla === "contar_valoracion") {
      result =
        await prisma.$queryRaw`SELECT ga_guia_aplicacion.id, ga_inciso_aspecto.aspecto_id, ga_guia_aplicacion.valoracion_id, ga_valoracion.valor, ga_guia_aplicacion.fundamentacion, COUNT(ga_guia_aplicacion.valoracion_id) AS count_valoracion
        FROM ga_guia_aplicacion
        JOIN ga_valoracion ON ga_valoracion.id = ga_guia_aplicacion.valoracion_id
          JOIN ga_inciso_guia ON ga_inciso_guia.id = ga_guia_aplicacion.inciso_guia_id
          JOIN ga_inciso_aspecto ON ga_inciso_aspecto.inciso_id = ga_inciso_guia.inciso_id
        JOIN ga_aspecto_guia ON ga_aspecto_guia.aspecto_id = ga_inciso_aspecto.aspecto_id
          WHERE ga_guia_aplicacion.guia_id = ${currentData.datos.guiaId} AND ga_guia_aplicacion.ueb_id = ${currentData.datos.uebId} AND (ga_guia_aplicacion.mes BETWEEN ${currentData.datos.fechaInicial} AND ${currentData.datos.fechaFinal})
          AND ga_aspecto_guia.guia_id = ${currentData.datos.guiaId} AND ga_aspecto_guia.aspecto_id = ${currentData.datos.aspectoId}
          GROUP BY ga_inciso_aspecto.aspecto_id, ga_guia_aplicacion.valoracion_id;`;
      // result =
      //   await prisma.$queryRaw`SELECT COUNT(ga_guia_aplicacion.valoracion_id)
      //   FROM ga_guia_aplicacion
      //   WHERE ga_guia_aplicacion.aspecto_guia_id = ${currentData.datos.aspecto_guia_id}
      //   AND ga_guia_aplicacion.guia_id = ${currentData.datos.guia_id}
      //   AND ga_guia_aplicacion.valoracion_id = ${currentData.datos.valoracion_id} AND (ga_guia_aplicacion.mes BETWEEN ${currentData.datos.fechaInicial} AND ${currentData.datos.fechaFinal});`;

      result = JSON.parse(
        JSON.stringify(result, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
    } else if (currentData.tabla === "buscarUebTrabajador") {
      result = await prisma.$queryRaw`SELECT trabajador.ueb_id
        FROM trabajador
          LEFT JOIN ueb ON ueb.id = trabajador.ueb_id
          LEFT JOIN usuario ON usuario.id = trabajador.usuario_id
        WHERE usuario.id = ${currentData.datos.usuarioId};`;

      result = JSON.parse(
        JSON.stringify(result, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
    } else if (currentData.tabla === "buscarAnnoUnico") {
      result = await prisma.$queryRaw`SELECT DISTINCT(YEAR(ga_guia_autocontrol.fecha_inicio)) AS anno
      FROM ga_guia_autocontrol 
      UNION
      SELECT DISTINCT(YEAR(ga_guia_autocontrol.fecha_fin)) AS anno
      FROM ga_guia_autocontrol 
      ORDER BY anno DESC;`;

      result = JSON.parse(
        JSON.stringify(result, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
    } else if (currentData.tabla === "buscarUltimaGuia") {
      result = await prisma.$queryRaw`SELECT *
      FROM ga_guia_autocontrol
      ORDER BY YEAR(ga_guia_autocontrol.fecha_fin) DESC
      LIMIT 1;`;
      ////////ORDER BY ga_guia_autocontrol.anno DESC

      result = JSON.parse(
        JSON.stringify(result, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
    } else if (currentData.tabla === "buscarCierreExtension") {

      result = await prisma.$queryRaw`SELECT *
        FROM ga_cierre_extension
        WHERE MONTH(mes) = ${currentData.datos.mes} 
        AND YEAR(mes) = ${currentData.datos.anno}
        AND (ga_cierre_extension.ueb_id = ${currentData.datos.ueb_id}  OR ga_cierre_extension.ueb_id IS NULL)
        AND ga_cierre_extension.guia_id = ${currentData.datos.guia_id}
        ORDER BY id DESC;`;

      result = JSON.parse(
        JSON.stringify(result, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
    } else if (currentData.tabla === "buscarComponentesTrabajador") {
      result = await prisma.$queryRaw`SELECT *
        FROM ga_componente
          LEFT JOIN ga_componente_guia ON ga_componente_guia.componente_id = ga_componente.id
        WHERE ga_componente_guia.guia_id = ${currentData.datos.guiaId};`;

      result = JSON.parse(
        JSON.stringify(result, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
    } else if (currentData.tabla === "upsertInciso") {
      result =
        await prisma.$queryRaw`UPDATE ga_guia_aplicacion SET valoracion_id=${currentData.datos.valoracion_id}, fundamentacion=${currentData.datos.fundamentacion} WHERE id=${currentData.datos.id};`;
      // result =
      //   await prisma.$queryRaw`UPDATE ga_guia_aplicacion SET fundamentacion=${currentData.datos.fundamentacion} WHERE id=${currentData.datos.id};`;

      result = JSON.parse(
        JSON.stringify(result, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );

    } else if (currentData.tabla === "createInciso") {
      result =
        await prisma.$queryRaw`INSERT INTO ga_guia_aplicacion VALUES valoracion_id=${currentData.datos.valoracion_id}, fundamentacion=${currentData.datos.fundamentacion};`;

      result = JSON.parse(
        JSON.stringify(result, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
    } else if (currentData.tabla === "buscarInciso") {
      result = await prisma.$queryRaw`SELECT ga_guia_aplicacion.id
        FROM ga_guia_aplicacion
          LEFT JOIN ueb ON ga_guia_aplicacion.ueb_id = ueb.id
          LEFT JOIN ga_valoracion ON ga_guia_aplicacion.valoracion_id = ga_valoracion.id
          LEFT JOIN ga_aspecto_guia ON ga_guia_aplicacion.aspecto_guia_id = ga_aspecto_guia.id
          LEFT JOIN ga_inciso_guia ON ga_guia_aplicacion.inciso_guia_id = ga_inciso_guia.id
          LEFT JOIN ga_guia_autocontrol ON ga_guia_aplicacion.guia_id = ga_guia_autocontrol.id
        WHERE ueb.id = ${currentData.datos.uebId}
        AND (ga_aspecto_guia.guia_id = ${currentData.datos.guiaId} OR ga_aspecto_guia.guia_id is null)
        AND (ga_inciso_guia.guia_id = ${currentData.datos.guiaId} OR ga_inciso_guia.guia_id is NULL)
        AND ga_valoracion.activo = 1
        AND (ga_guia_aplicacion.inciso_guia_id = ${currentData.datos.incisoGuiaId} OR ga_guia_aplicacion.inciso_guia_id is NULL)
        AND (ga_guia_aplicacion.aspecto_guia_id = ${currentData.datos.aspectoGuiaId} OR ga_guia_aplicacion.aspecto_guia_id is NULL)
        AND (ga_guia_aplicacion.mes BETWEEN ${currentData.datos.fechaInicial} AND ${currentData.datos.fechaFinal});`;

      result = JSON.parse(
        JSON.stringify(result, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
    } else if (currentData.tabla === "buscarInciso") {
      result = await prisma.$queryRaw`SELECT ga_guia_aplicacion.id
        FROM ga_guia_aplicacion
          LEFT JOIN ueb ON ga_guia_aplicacion.ueb_id = ueb.id
          LEFT JOIN ga_valoracion ON ga_guia_aplicacion.valoracion_id = ga_valoracion.id
          LEFT JOIN ga_aspecto_guia ON ga_guia_aplicacion.aspecto_guia_id = ga_aspecto_guia.id
          LEFT JOIN ga_inciso_guia ON ga_guia_aplicacion.inciso_guia_id = ga_inciso_guia.id
          LEFT JOIN ga_guia_autocontrol ON ga_guia_aplicacion.guia_id = ga_guia_autocontrol.id
        WHERE ueb.id = ${currentData.datos.uebId}
        AND (ga_aspecto_guia.guia_id = ${currentData.datos.guiaId} OR ga_aspecto_guia.guia_id is null)
        AND (ga_inciso_guia.guia_id = ${currentData.datos.guiaId} OR ga_inciso_guia.guia_id is NULL)
        AND ga_valoracion.activo = 1
        AND (ga_guia_aplicacion.inciso_guia_id = ${currentData.datos.incisoGuiaId} OR ga_guia_aplicacion.inciso_guia_id is NULL)
        AND (ga_guia_aplicacion.aspecto_guia_id = ${currentData.datos.aspectoGuiaId} OR ga_guia_aplicacion.aspecto_guia_id is NULL)
        AND (ga_guia_aplicacion.mes BETWEEN ${currentData.datos.fechaInicial} AND ${currentData.datos.fechaFinal});`;

      result = JSON.parse(
        JSON.stringify(result, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
    } else if (currentData.tabla === "inciso_con_fecha") {
      result =
        await prisma.$queryRaw`SELECT ga_aspecto.id AS aspecto_id, ga_aspecto.nombre AS aspecto_nombre, ga_aspecto.numero, 
        ga_inciso.id AS inciso_id, ga_inciso.nombre AS inciso_nombre, ga_inciso.letra, ga_guia_aplicacion.fundamentacion,
        ga_guia_aplicacion.valoracion_id, ga_valoracion.valor
        FROM ga_norma
          JOIN ga_norma_guia ON ga_norma_guia.norma_id = ga_norma.id
          JOIN ga_aspecto_norma ON ga_aspecto_norma.norma_id = ga_norma.id
          JOIN ga_aspecto ON ga_aspecto.id = ga_aspecto_norma.aspecto_id
        LEFT  JOIN ga_inciso_aspecto ON ga_inciso_aspecto.aspecto_id = ga_aspecto.id
        LEFT  JOIN ga_inciso ON ga_inciso.id = ga_inciso_aspecto.inciso_id
        LEFT  JOIN ga_aspecto_guia ON ga_aspecto_guia.aspecto_id = ga_aspecto.id
        LEFT  JOIN ga_inciso_guia ON ga_inciso_guia.inciso_id = ga_inciso.id
        LEFT  JOIN ga_guia_aplicacion ON ga_inciso_guia.id = ga_guia_aplicacion.inciso_guia_id
        LEFT  JOIN ga_valoracion ON ga_valoracion.id = ga_guia_aplicacion.valoracion_id
        WHERE ga_norma.id = ${currentData.datos.norma_id}
        AND ga_norma_guia.guia_id = ${currentData.datos.guia_id}
        AND (ga_aspecto_guia.guia_id = ${currentData.datos.guia_id} OR ga_aspecto_guia.guia_id is null)
        AND (ga_inciso_guia.guia_id = ${currentData.datos.guia_id} OR ga_inciso_guia.guia_id is NULL)
        AND ga_valoracion.activo = 1
        AND (ga_guia_aplicacion.mes BETWEEN ${currentData.datos.fechaInicial} AND ${currentData.datos.fechaFinal})
        ORDER BY ga_aspecto.id, ga_inciso.letra;`;

      result = JSON.parse(
        JSON.stringify(result, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
    } else if (currentData.tabla === "inciso_por_aspecto") {
      result =
        await prisma.$queryRaw`SELECT ga_inciso.id AS inciso_id, ga_inciso.letra AS inciso_letra, ga_inciso.nombre AS inciso_nombre, ga_valoracion.valor, ga_guia_aplicacion.fundamentacion, ga_guia_aplicacion.valoracion_id, ga_guia_aplicacion.id AS aplicacion_id
        FROM ga_guia_aplicacion
        INNER JOIN ga_inciso_guia ON ga_inciso_guia.id = ga_guia_aplicacion.inciso_guia_id
        INNER JOIN ga_inciso ON ga_inciso.id = ga_inciso_guia.inciso_id
        INNER JOIN ga_inciso_aspecto ON ga_inciso_aspecto.inciso_id = ga_inciso.id
        INNER JOIN ga_valoracion ON ga_valoracion.id = ga_guia_aplicacion.valoracion_id
        WHERE MONTH(mes) = ${currentData.datos.mes}
        AND ga_guia_aplicacion.guia_id = ${currentData.datos.guia_id}
        AND ga_inciso_guia.guia_id = ${currentData.datos.guia_id}
        AND ga_inciso_aspecto.aspecto_id = ${currentData.datos.aspecto_id}
        AND ueb_id = ${currentData.datos.ueb_id}
        ORDER BY ga_inciso.letra;`;

      result = JSON.parse(
        JSON.stringify(result, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
    } else if (currentData.tabla === "resumenGuiaAspectosNegativo") {
      result =
        await prisma.$queryRaw`SELECT ga_componente.id AS componente_id, ga_componente.nombre AS componente_nombre, ga_componente.numero_romano AS componente_numero_romano, ga_norma.id AS norma_id, ga_norma.nombre AS norma_nombre, ga_aspecto.id AS aspecto_id, ga_aspecto.numero AS aspecto_numero, ga_aspecto.nombre  AS aspecto_nombre, null AS inciso_id, null AS inciso_letra, null AS inciso_nombre
      FROM ga_guia_aplicacion
      INNER JOIN ga_aspecto_guia ON ga_aspecto_guia.id = ga_guia_aplicacion.aspecto_guia_id
      INNER JOIN ga_aspecto ON ga_aspecto.id = ga_aspecto_guia.aspecto_id
      INNER JOIN ga_aspecto_norma ON ga_aspecto_norma.aspecto_id = ga_aspecto.id
      INNER JOIN ga_norma ON ga_norma.id = ga_aspecto_norma.norma_id
      INNER JOIN ga_norma_guia ON ga_norma_guia.norma_id = ga_norma.id
      INNER JOIN ga_norma_componente ON ga_norma_componente.norma_id = ga_norma.id
      INNER JOIN ga_componente ON ga_componente.id = ga_norma_componente.componente_id
      INNER JOIN ga_componente_guia ON ga_componente_guia.componente_id = ga_componente.id
      WHERE MONTH(mes) = ${currentData.datos.mes} 
      AND YEAR(mes) = ${currentData.datos.anno}
      AND ga_guia_aplicacion.guia_id = ${currentData.datos.guia_id}
      AND ga_aspecto_guia.guia_id = ${currentData.datos.guia_id}
      AND ga_norma_guia.guia_id = ${currentData.datos.guia_id}
      AND ga_componente_guia.guia_id = ${currentData.datos.guia_id}
      AND ueb_id = ${currentData.datos.ueb_id}
      AND ga_guia_aplicacion.valoracion_id = 2
      UNION
      SELECT ga_componente.id AS componente_id, ga_componente.nombre AS componente_nombre, ga_componente.numero_romano AS componente_numero_romano, ga_norma.id AS norma_id, ga_norma.nombre AS norma_nombre, ga_aspecto.id AS aspecto_id, ga_aspecto.numero AS aspecto_numero, ga_aspecto.nombre  AS aspecto_nombre, ga_inciso.id AS inciso_id, ga_inciso.letra AS inciso_letra, ga_inciso.nombre AS inciso_nombre
      FROM ga_guia_aplicacion
      INNER JOIN ga_inciso_guia ON ga_inciso_guia.id = ga_guia_aplicacion.inciso_guia_id
      INNER JOIN ga_inciso ON ga_inciso.id = ga_inciso_guia.inciso_id
      INNER JOIN ga_inciso_aspecto ON ga_inciso_aspecto.inciso_id = ga_inciso.id
      INNER JOIN ga_aspecto ON ga_aspecto.id = ga_inciso_aspecto.aspecto_id
      INNER JOIN ga_aspecto_guia ON ga_aspecto_guia.aspecto_id = ga_aspecto.id
      INNER JOIN ga_aspecto_norma ON ga_aspecto_norma.aspecto_id = ga_aspecto.id
      INNER JOIN ga_norma ON ga_norma.id = ga_aspecto_norma.norma_id
      INNER JOIN ga_norma_guia ON ga_norma_guia.norma_id = ga_norma.id
      INNER JOIN ga_norma_componente ON ga_norma_componente.norma_id = ga_norma.id
      INNER JOIN ga_componente ON ga_componente.id = ga_norma_componente.componente_id
      INNER JOIN ga_componente_guia ON ga_componente_guia.componente_id = ga_componente.id
      WHERE MONTH(mes) = ${currentData.datos.mes}
      AND YEAR(mes) = ${currentData.datos.anno}
      AND ga_guia_aplicacion.guia_id = ${currentData.datos.guia_id}
      AND ga_inciso_guia.guia_id = ${currentData.datos.guia_id}
      AND ga_aspecto_guia.guia_id = ${currentData.datos.guia_id}
      AND ga_norma_guia.guia_id = ${currentData.datos.guia_id}
      AND ga_componente_guia.guia_id = ${currentData.datos.guia_id}
      AND ueb_id = ${currentData.datos.ueb_id}
      AND ga_guia_aplicacion.valoracion_id = 2
      ORDER BY componente_id, norma_id, aspecto_numero, inciso_letra;`;
      result = JSON.parse(
        JSON.stringify(result, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
    } else if (currentData.tabla === "buscarAspectosPorNorma") {
      result =
        await prisma.$queryRaw`SELECT ga_aspecto.id AS aspecto_id, ga_aspecto.numero AS aspecto_numero, ga_aspecto.nombre AS aspecto_nombre, null AS inciso_id, null AS inciso_letra, null AS inciso_nombre, ga_valoracion.valor, ga_guia_aplicacion.fundamentacion, ga_guia_aplicacion.valoracion_id, ga_guia_aplicacion.id AS aplicacion_id, ga_aspecto_guia.id AS aspecto_guia_id
        FROM ga_guia_aplicacion
        INNER JOIN ga_aspecto_guia ON ga_aspecto_guia.id = ga_guia_aplicacion.aspecto_guia_id
        INNER JOIN ga_aspecto ON ga_aspecto.id = ga_aspecto_guia.aspecto_id
        INNER JOIN ga_aspecto_norma ON ga_aspecto_norma.aspecto_id = ga_aspecto.id
        LEFT JOIN ga_valoracion ON ga_valoracion.id = ga_guia_aplicacion.valoracion_id
        WHERE MONTH(mes) = ${currentData.datos.mes}
        AND YEAR(mes) = ${currentData.datos.anno}
        AND ga_guia_aplicacion.guia_id = ${currentData.datos.guia_id}
        AND ga_aspecto_guia.guia_id = ${currentData.datos.guia_id}
        AND ga_aspecto_norma.norma_id = ${currentData.datos.norma_id}
        AND ueb_id = ${currentData.datos.ueb_id}
        UNION	
        SELECT ga_inciso_aspecto.aspecto_id AS aspecto_id, ga_aspecto.numero AS aspecto_numero, null AS aspecto_nombre, ga_inciso.id AS inciso_id, ga_inciso.letra AS inciso_letra, ga_inciso.nombre AS inciso_nombre, ga_valoracion.valor, ga_guia_aplicacion.fundamentacion, ga_guia_aplicacion.valoracion_id, ga_guia_aplicacion.id AS aplicacion_id, ga_aspecto_guia.id AS aspecto_guia_id
        FROM ga_guia_aplicacion
        INNER JOIN ga_inciso_guia ON ga_inciso_guia.id = ga_guia_aplicacion.inciso_guia_id
        INNER JOIN ga_inciso ON ga_inciso.id = ga_inciso_guia.inciso_id
        INNER JOIN ga_inciso_aspecto ON ga_inciso_aspecto.inciso_id = ga_inciso.id
        INNER JOIN ga_aspecto ON ga_aspecto.id = ga_inciso_aspecto.aspecto_id
        INNER JOIN ga_aspecto_guia ON ga_aspecto_guia.aspecto_id = ga_inciso_aspecto.aspecto_id
        INNER JOIN ga_aspecto_norma ON ga_aspecto_norma.aspecto_id = ga_inciso_aspecto.aspecto_id
        LEFT JOIN ga_valoracion ON ga_valoracion.id = ga_guia_aplicacion.valoracion_id
        WHERE MONTH(mes) = ${currentData.datos.mes}
        AND YEAR(mes) = ${currentData.datos.anno}
        AND ga_guia_aplicacion.guia_id = ${currentData.datos.guia_id}
        AND ga_inciso_guia.guia_id = ${currentData.datos.guia_id}
        AND ga_aspecto_guia.guia_id = ${currentData.datos.guia_id}
        AND ga_aspecto_norma.norma_id = ${currentData.datos.norma_id}
        AND ueb_id = ${currentData.datos.ueb_id}
        ORDER BY aspecto_numero, inciso_letra;`;

      result = JSON.parse(
        JSON.stringify(result, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
  
    } else if (currentData.tabla === "planMedidasporUeb") {

      result =
        await prisma.$queryRaw`SELECT ga_componente.id AS componente_id, ga_componente.nombre AS componente_nombre, ga_componente.numero_romano AS comp_numero, ga_norma.id AS norma_id, ga_norma.nombre AS norma_nombre, ga_aspecto.id AS aspecto_id, ga_aspecto.numero AS aspecto_numero, ga_aspecto.nombre  AS aspecto_nombre, null AS inciso_id, null AS inciso_letra, null  AS inciso_nombre, ga_plan_medidas.id AS medida_id,  ga_plan_medidas.medida, ga_plan_medidas.reponsable, ga_plan_medidas.ejecuta, ga_plan_medidas.fecha_limite, IF(ga_plan_medidas.fecha_cumplido > ga_plan_medidas.fecha_limite AND ga_plan_medidas.fecha_cumplido <= ${currentData.datos.fecha}, CONCAT('Cumplida con Retraso. ', ga_plan_medidas.observaciones), ga_plan_medidas.observaciones) observaciones
        FROM ga_plan_medidas
        INNER JOIN ga_aspecto_guia ON ga_aspecto_guia.id = ga_plan_medidas.aspecto_guia_id
        INNER JOIN ga_aspecto ON ga_aspecto.id = ga_aspecto_guia.aspecto_id
        INNER JOIN ga_aspecto_norma ON ga_aspecto_norma.aspecto_id = ga_aspecto.id
        INNER JOIN ga_norma ON ga_norma.id = ga_aspecto_norma.norma_id
        INNER JOIN ga_norma_guia ON ga_norma_guia.norma_id = ga_aspecto_norma.norma_id
        INNER JOIN ga_norma_componente ON ga_norma_componente.norma_id = ga_norma_guia.norma_id
        INNER JOIN ga_componente ON ga_componente.id = ga_norma_componente.componente_id
        INNER JOIN ga_componente_guia ON ga_componente_guia.componente_id = ga_componente.id
        WHERE ga_plan_medidas.fecha_creacion <= ${currentData.datos.fecha}
        AND (ga_plan_medidas.fecha_cumplido is null OR ga_plan_medidas.fecha_cumplido > ga_plan_medidas.fecha_limite OR (ga_plan_medidas.fecha_cumplido is not null AND ga_plan_medidas.fecha_cumplido > ${currentData.datos.fecha}))
        AND ga_aspecto_guia.guia_id = ${currentData.datos.guia_id}
        AND ga_norma_guia.guia_id = ${currentData.datos.guia_id}
        AND ga_componente_guia.guia_id = ${currentData.datos.guia_id}
        AND ga_plan_medidas.ueb_id = ${currentData.datos.ueb_id}
        UNION
        SELECT ga_componente.id AS componente_id, ga_componente.nombre AS componente_nombre, ga_componente.numero_romano AS comp_numero, ga_norma.id AS norma_id, ga_norma.nombre AS norma_nombre, ga_aspecto.id AS aspecto_id, ga_aspecto.numero AS aspecto_numero, ga_aspecto.nombre  AS aspecto_nombre, ga_inciso.id AS inciso_id, ga_inciso.letra AS inciso_letra, ga_inciso.nombre AS inciso_nombre,ga_plan_medidas.id AS medida_id, ga_plan_medidas.medida, ga_plan_medidas.reponsable, ga_plan_medidas.ejecuta, ga_plan_medidas.fecha_limite, IF(ga_plan_medidas.fecha_cumplido > ga_plan_medidas.fecha_limite AND ga_plan_medidas.fecha_cumplido <= ${currentData.datos.fecha}, CONCAT('Cumplida con Retraso. ', ga_plan_medidas.observaciones), ga_plan_medidas.observaciones) observaciones
        FROM ga_plan_medidas
        INNER JOIN ga_inciso_guia ON ga_inciso_guia.id = ga_plan_medidas.inciso_guia_id
        INNER JOIN ga_inciso ON ga_inciso.id = ga_inciso_guia.inciso_id
        INNER JOIN ga_inciso_aspecto ON ga_inciso_aspecto.inciso_id = ga_inciso.id
        INNER JOIN ga_aspecto ON ga_aspecto.id = ga_inciso_aspecto.aspecto_id
        INNER JOIN ga_aspecto_guia ON ga_aspecto_guia.aspecto_id = ga_aspecto.id
        INNER JOIN ga_aspecto_norma ON ga_aspecto_norma.aspecto_id = ga_aspecto.id
        INNER JOIN ga_norma ON ga_norma.id = ga_aspecto_norma.norma_id
        INNER JOIN ga_norma_guia ON ga_norma_guia.norma_id = ga_aspecto_norma.norma_id
        INNER JOIN ga_norma_componente ON ga_norma_componente.norma_id = ga_norma_guia.norma_id
        INNER JOIN ga_componente ON ga_componente.id = ga_norma_componente.componente_id
        INNER JOIN ga_componente_guia ON ga_componente_guia.componente_id = ga_componente.id
        WHERE ga_plan_medidas.fecha_creacion <=  ${currentData.datos.fecha}
        AND (ga_plan_medidas.fecha_cumplido is null OR ga_plan_medidas.fecha_cumplido > ga_plan_medidas.fecha_limite OR (ga_plan_medidas.fecha_cumplido is not null AND ga_plan_medidas.fecha_cumplido > ${currentData.datos.fecha}))
        AND ga_inciso_guia.guia_id = ${currentData.datos.guia_id}
        AND ga_aspecto_guia.guia_id = ${currentData.datos.guia_id}
        AND ga_norma_guia.guia_id = ${currentData.datos.guia_id}
        AND ga_componente_guia.guia_id = ${currentData.datos.guia_id}
        AND ga_plan_medidas.ueb_id = ${currentData.datos.ueb_id}
        ORDER BY componente_id, norma_id, aspecto_numero, inciso_letra;`;

      result = JSON.parse(
        JSON.stringify(result, (key, value) => 
          typeof value === "bigint" ? value.toString() : value
        )
      );
      } else if (currentData.tabla === "planMedidasGeneral") {

        result =
          await prisma.$queryRaw`SELECT ga_componente.id AS componente_id, ga_componente.nombre AS componente_nombre, ga_componente.numero_romano AS componente_numero_romano, ga_norma.id AS norma_id, ga_norma.nombre AS norma_nombre, ga_aspecto.id AS aspecto_id, ga_aspecto.numero AS aspecto_numero, ga_aspecto.nombre  AS aspecto_nombre, null AS inciso_id, null AS inciso_letra, null AS inciso_nombre
          FROM ga_guia_aplicacion
          INNER JOIN ga_aspecto_guia ON ga_aspecto_guia.id = ga_guia_aplicacion.aspecto_guia_id
          INNER JOIN ga_aspecto ON ga_aspecto.id = ga_aspecto_guia.aspecto_id
          INNER JOIN ga_aspecto_norma ON ga_aspecto_norma.aspecto_id = ga_aspecto.id
          INNER JOIN ga_norma ON ga_norma.id = ga_aspecto_norma.norma_id
          INNER JOIN ga_norma_guia ON ga_norma_guia.norma_id = ga_norma.id
          INNER JOIN ga_norma_componente ON ga_norma_componente.norma_id = ga_norma.id
          INNER JOIN ga_componente ON ga_componente.id = ga_norma_componente.componente_id
          INNER JOIN ga_componente_guia ON ga_componente_guia.componente_id = ga_componente.id
          WHERE MONTH(mes) =  ${currentData.datos.mes}
          AND YEAR(mes) =  ${currentData.datos.anno}
          AND ga_guia_aplicacion.guia_id = ${currentData.datos.guia_id}
          AND ga_aspecto_guia.guia_id = ${currentData.datos.guia_id}
          AND ga_norma_guia.guia_id = ${currentData.datos.guia_id}
          AND ga_componente_guia.guia_id = ${currentData.datos.guia_id}
          AND ga_guia_aplicacion.valoracion_id = 2
          UNION
          SELECT ga_componente.id AS componente_id, ga_componente.nombre AS componente_nombre, ga_componente.numero_romano AS componente_numero_romano, ga_norma.id AS norma_id, ga_norma.nombre AS norma_nombre, ga_aspecto.id AS aspecto_id, ga_aspecto.numero AS aspecto_numero, ga_aspecto.nombre  AS aspecto_nombre, ga_inciso.id AS inciso_id, ga_inciso.letra AS inciso_letra, ga_inciso.nombre AS inciso_nombre
          FROM ga_guia_aplicacion
          INNER JOIN ga_inciso_guia ON ga_inciso_guia.id = ga_guia_aplicacion.inciso_guia_id
          INNER JOIN ga_inciso ON ga_inciso.id = ga_inciso_guia.inciso_id
          INNER JOIN ga_inciso_aspecto ON ga_inciso_aspecto.inciso_id = ga_inciso.id
          INNER JOIN ga_aspecto ON ga_aspecto.id = ga_inciso_aspecto.aspecto_id
          INNER JOIN ga_aspecto_guia ON ga_aspecto_guia.aspecto_id = ga_aspecto.id
          INNER JOIN ga_aspecto_norma ON ga_aspecto_norma.aspecto_id = ga_aspecto.id
          INNER JOIN ga_norma ON ga_norma.id = ga_aspecto_norma.norma_id
          INNER JOIN ga_norma_guia ON ga_norma_guia.norma_id = ga_norma.id
          INNER JOIN ga_norma_componente ON ga_norma_componente.norma_id = ga_norma.id
          INNER JOIN ga_componente ON ga_componente.id = ga_norma_componente.componente_id
          INNER JOIN ga_componente_guia ON ga_componente_guia.componente_id = ga_componente.id
          WHERE MONTH(mes) =  ${currentData.datos.mes}
          AND YEAR(mes) =  ${currentData.datos.anno}
          AND ga_guia_aplicacion.guia_id = ${currentData.datos.guia_id}
          AND ga_inciso_guia.guia_id = ${currentData.datos.guia_id}
          AND ga_aspecto_guia.guia_id = ${currentData.datos.guia_id}
          AND ga_norma_guia.guia_id = ${currentData.datos.guia_id}
          AND ga_componente_guia.guia_id = ${currentData.datos.guia_id}
          AND ga_guia_aplicacion.valoracion_id = 2
          GROUP BY aspecto_id, inciso_id
          ORDER BY componente_id, norma_id, aspecto_numero, inciso_letra;`;
  
        result = JSON.parse(
          JSON.stringify(result, (key, value) => 
            typeof value === "bigint" ? value.toString() : value
          )
        );
    } else if (currentData.tabla === "aplicacionGuiaPorComponente") {
      result =
        await prisma.$queryRaw`SELECT ga_norma.id AS norma_id, ga_norma.nombre AS norma_nombre, ga_aspecto.id AS aspecto_id, ga_aspecto.numero AS aspecto_numero, ga_aspecto.nombre  AS aspecto_nombre, null AS inciso_id, null AS inciso_letra, null AS inciso_nombre, ga_valoracion.valor, ga_guia_aplicacion.fundamentacion
        FROM ga_guia_aplicacion
        INNER JOIN ga_aspecto_guia ON ga_aspecto_guia.id = ga_guia_aplicacion.aspecto_guia_id
        INNER JOIN ga_aspecto ON ga_aspecto.id = ga_aspecto_guia.aspecto_id
        INNER JOIN ga_aspecto_norma ON ga_aspecto_norma.aspecto_id = ga_aspecto.id
        INNER JOIN ga_norma ON ga_norma.id = ga_aspecto_norma.norma_id
        INNER JOIN ga_norma_guia ON ga_norma_guia.norma_id = ga_norma.id
        INNER JOIN ga_norma_componente ON ga_norma_componente.norma_id = ga_norma.id
        LEFT JOIN ga_valoracion ON ga_valoracion.id = ga_guia_aplicacion.valoracion_id
        WHERE MONTH(mes) = ${currentData.datos.mes} AND YEAR(mes) = ${currentData.datos.anno}
        AND ga_guia_aplicacion.guia_id = ${currentData.datos.guia_id} 
        AND ga_aspecto_guia.guia_id = ${currentData.datos.guia_id} 
        AND ga_norma_guia.guia_id = ${currentData.datos.guia_id} 
        AND ga_norma_componente.componente_id = ${currentData.datos.componente_id} 
        AND ueb_id = ${currentData.datos.ueb_id} 
        UNION 
        SELECT ga_norma.id AS norma_id, ga_norma.nombre AS norma_nombre, ga_aspecto.id AS aspecto_id, ga_aspecto.numero AS aspecto_numero, ga_aspecto.nombre  AS aspecto_nombre, ga_inciso.id AS inciso_id, ga_inciso.letra AS inciso_letra, ga_inciso.nombre AS inciso_nombre, ga_valoracion.valor, ga_guia_aplicacion.fundamentacion
        FROM ga_guia_aplicacion
        INNER JOIN ga_inciso_guia ON ga_inciso_guia.id = ga_guia_aplicacion.inciso_guia_id
        INNER JOIN ga_inciso ON ga_inciso.id = ga_inciso_guia.inciso_id
        INNER JOIN ga_inciso_aspecto ON ga_inciso_aspecto.inciso_id = ga_inciso.id
        INNER JOIN ga_aspecto ON ga_aspecto.id = ga_inciso_aspecto.aspecto_id
        INNER JOIN ga_aspecto_guia ON ga_aspecto_guia.aspecto_id = ga_aspecto.id
        INNER JOIN ga_aspecto_norma ON ga_aspecto_norma.aspecto_id = ga_aspecto.id
        INNER JOIN ga_norma ON ga_norma.id = ga_aspecto_norma.norma_id
        INNER JOIN ga_norma_guia ON ga_norma_guia.norma_id = ga_norma.id
        INNER JOIN ga_norma_componente ON ga_norma_componente.norma_id = ga_norma.id
        LEFT JOIN ga_valoracion ON ga_valoracion.id = ga_guia_aplicacion.valoracion_id
        WHERE MONTH(mes) = ${currentData.datos.mes} AND YEAR(mes) = ${currentData.datos.anno}
        AND ga_guia_aplicacion.guia_id = ${currentData.datos.guia_id} 
        AND ga_inciso_guia.guia_id = ${currentData.datos.guia_id} 
        AND ga_aspecto_guia.guia_id = ${currentData.datos.guia_id} 
        AND ga_norma_guia.guia_id = ${currentData.datos.guia_id} 
        AND ga_norma_componente.componente_id = ${currentData.datos.componente_id} 
        AND ueb_id = ${currentData.datos.ueb_id} 
        ORDER BY norma_id, aspecto_numero, inciso_letra;`;

      result = JSON.parse(
        JSON.stringify(result, (key, value) =>
          typeof value === "bigint" ? value.toString() : value 
        )
      );
    } else if (currentData.tabla === "negativosTresMeses") {
      result = await prisma.$queryRaw`SELECT ga_guia_aplicacion.id AS id, ueb.alias AS ueb, ga_aspecto.id AS aspecto_id, CONCAT(ga_aspecto.numero, '- ', ga_aspecto.nombre) AS aspecto, ga_guia_autocontrol.version AS guia, count(aspecto_guia_id) AS count
        FROM ga_guia_aplicacion
          JOIN ueb ON ga_guia_aplicacion.ueb_id = ueb.id
          JOIN ga_aspecto_guia ON ga_guia_aplicacion.aspecto_guia_id = ga_aspecto_guia.id
          JOIN ga_aspecto ON ga_aspecto.id = ga_aspecto_guia.aspecto_id
          JOIN ga_guia_autocontrol ON ga_guia_aplicacion.guia_id = ga_guia_autocontrol.id
        WHERE valoracion_id = 2
        AND (ga_guia_aplicacion.mes BETWEEN ${currentData.datos.fechaInicial} AND ${currentData.datos.fechaFinal})
        GROUP BY aspecto_guia_id, ueb_id
        ORDER BY ga_guia_aplicacion.guia_id, ueb.id, ga_aspecto.id;`;

      result = JSON.parse(
        JSON.stringify(result, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
    }
    else if (currentData.tabla === "trazasUltimaAplicacion") {
      result = await prisma.$queryRaw`SELECT audit_trail.id AS id, ueb.alias AS ueb, changed_date
        FROM audit_trail
          JOIN ga_guia_aplicacion ON ga_guia_aplicacion.id = audit_trail.record_id
          JOIN ueb ON ga_guia_aplicacion.ueb_id = ueb.id
        WHERE action = 'modificar'
        GROUP BY ueb.id
        ORDER BY changed_date DESC;`;

      result = JSON.parse(
        JSON.stringify(result, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
    }
    else if (currentData.tabla === "getNormasPorGuiaComponente") {
      result =
      await prisma.$queryRaw`SELECT ga_norma.id, ga_norma.nombre
      FROM ga_norma
      INNER JOIN ga_norma_guia ON ga_norma_guia.norma_id = ga_norma.id
      INNER JOIN ga_norma_componente ON ga_norma_componente.norma_id = ga_norma.id
      WHERE ga_norma_guia.guia_id = ${currentData.datos.guia_id} 
      AND ga_norma_componente.componente_id = ${currentData.datos.componente_id} 
      ORDER BY ga_norma.id;`;

      result = JSON.parse(
        JSON.stringify(result, (key, value) =>
          typeof value === "bigint" ? value.toString() : value 
        )
      );
    }
    else {
      result = await prisma.$queryRaw`${currentData.datos.consulta}`;

      result = JSON.parse(
        JSON.stringify(result, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
    }

    if (currentData.accion === "aggregate") {
      result = await prisma[`${currentData.tabla}`].aggregate({
        ...currentData.datos,
        usuarioAutenticadoId: usuarioId, //codigo de isis modificacion
      });
    }
  }

  return result;
}

export default executeQuery;
