import React, { useState, useEffect } from "react";
import Head from "next/head";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Autocomplete,
  Grid,
  Paper,
  Tab,
  Tabs,
  TextField,
  Card,
  CardContent,
} from "@mui/material";
import CustomizedSnackbars from "../components/comun/Snackbar";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Done from "@mui/icons-material/Done";
import Close from "@mui/icons-material/Close";
import HorizontalRule from "@mui/icons-material/HorizontalRule";
import QuestionMark from "@mui/icons-material/QuestionMark";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";

//Omar
import ExtenderCierre from "../components/aplicacion/ExtenderCierre";
import PlanComponent from "../components/aplicacion/PlanComponent";
import BasicSpeedDial from "../components/aplicacion/BasicSpeedDial";
import { generateDocument } from "../components/aplicacion/docxtemplater";
import SubMenu from "../components/aplicacion/SubMenu";
import {
  DataGrid,
  esES,
  GridRowModes,
  GridActionsCellItem,
} from "@mui/x-data-grid";

import { enviarDatos, cargarEn, mostrarMensaje, meses } from "../../lib/utiles";

import getUsuarioAut from "../../lib/usuarioAutenticado";
import {
  tienePermiso,
  getComponentesPermitidos,
  getUebsPermitidas,
} from "../../lib/funciones_comunes";
import CustomPagination from "../components/comun/CustomPagination";

function Aplicacion() {
  const [selectValoracion, setSelectValoracion] = useState([]);
  const [dialog, setDialog] = useState({
    open: false,
    respuesta: undefined,
    dias: undefined,
    retorno: false,
    fechaPrevia: undefined,
    objeto: undefined,
    hoy: undefined,
  });

  const [usuarioActivo, setUsuarioActivo] = useState({});

  const [puedeEditar, setPuedeEditar] = useState();
  const [enTiempo, setEnTiempo] = useState();
  const [modoEdicion, setModoEdicion] = useState("");

  const [value, setValue] = useState();
  const [expanded, setExpanded] = useState(false);
  const [openSMS, setOpenSMS] = useState({});
  const [tabComponente, setTabComponente] = useState([]);
  const [normas, setNormas] = useState([]);
  const [norma, setNorma] = useState([]);
  const [cols, setCols] = useState([]);
  const [disabledComponente, setDisabledComponente] = useState([]);

  const [guia, setGuia] = useState([]);
  const [valueGuia, setValueGuia] = useState("");
  const [inputValueGuia, setInputValueGuia] = useState("");
  const [validarGuia, setValidarGuia] = useState({
    error: true,
    helperText: "El campo es obligatorio",
  });

  const [ueb, setUeb] = useState([]);
  const [valueUeb, setValueUeb] = useState("");
  const [inputValueUeb, setInputValueUeb] = useState("");
  const [validarUeb, setValidarUeb] = useState({
    error: true,
    helperText: "El campo es obligatorio",
  });

  const [mes, setMes] = useState([]);
  const [valueMes, setValueMes] = useState("");
  const [inputValueMes, setInputValueMes] = useState("");
  const [validarMes, setValidarMes] = useState({
    error: true,
    helperText: "El campo es obligatorio",
  });

  const [anno, setAnno] = useState([]);
  const [valueAnno, setValueAnno] = useState("");
  const [inputValueAnno, setInputValueAnno] = useState("");
  const [validarAnno, setValidarAnno] = useState({
    error: true,
    helperText: "El campo es obligatorio",
  });
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [mostrarEdicion, setMostrarEdicion] = useState(false);
  const [mostrarEspecial, setMostrarEspecial] = useState(false);

  const [primeraEjecucion, setPrimeraEjecucion] = useState(true);

  //aplicacion d guia
  const [sendMail, setSendMail] = useState(false);

  const aboutUser = async () => {
    const user = await getUsuarioAut();
    setUsuarioActivo(user);
  };

  useEffect(() => {
    aboutUser();
    valorar();
  }, []);

  useEffect(() => {
    if (dialog?.retorno) {
      if (dialog?.respuesta) {
        validarEnTiempo();
        let fecha = dialog?.dias;
        mostrarMensaje(
          setOpenSMS,
          `Plazo modificado para el ${fecha.getUTCDate()}/${ceroDelante(
            fecha.getUTCMonth() + 1
          )}/${fecha.getUTCFullYear()}`,
          5000,
          "success"
        );
      }
    }
    setDialog({
      ...dialog,
      retorno: false,
    });
  }, [dialog?.respuesta, dialog?.dias]);

  /*useEffect(() => {
    if (!puedeEditar || !enTiempo) {
      columns[3] = { ...columns[3], editable: false };
      columns[4] = { ...columns[4], editable: false };
      columns[5] = { ...columns[5], hidden: true };
      setModoEdicion("");
      //console.log("NO EDITA");
    } else {
      columns[3] = { ...columns[3], editable: true };
      columns[4] = { ...columns[4], editable: true };
      columns[5] = { ...columns[5], hidden: false };
      setModoEdicion("row");
      //console.log("PUEDE EDITAR");
    }
    setCols(columns);
  }, [puedeEditar, enTiempo]);*/

  useEffect(() => {
    if (!expanded) {
      setNorma();
    }
  }, [expanded]);

  useEffect(() => {}, [cols]);

  useEffect(() => {
    const asyn = async () => {
      let data = {
        tabla: "ga_guia_autocontrol",
        accion: "buscar",
        datos: {
          orderBy: {
            fecha_fin: "desc",
          },
        },
      };
      let guide = await cargarEn(data, "simpleQuery", setGuia);
      setGuia(guide);
      if (guide.length > 0) {
        setValueGuia(guide[0]);
      }
      let date = new Date();
      setMes(meses);
      let mes = meses.filter((item) => item.id == date.getUTCMonth() + 1);
      if (mes.length > 0) {
        setValueMes(mes[0]);
      }
      if (usuarioActivo?.roles) {
        /*let uebsUnicas = getUebsPermitidas(
          usuarioActivo,
          "aplicacion_guia_escritura"
        );
        if (uebsUnicas.length == 0) {
          let c = getUebsPermitidas(usuarioActivo, "aplicacion_guia_lectura");
          if (c.length != 0) {
            uebsUnicas = c;
            ////////////////////setPuedeEditar(false);
          }
        } else {
          //////////////////////setPuedeEditar(true);
        }*/
        let uebsUnicasL = getUebsPermitidas(
          usuarioActivo,
          "aplicacion_guia_lectura"
        );
        let uebsUnicasE = getUebsPermitidas(
          usuarioActivo,
          "aplicacion_guia_escritura"
        );
        uebsUnicasL = uebsUnicasL.concat(uebsUnicasE);
        let uebsUnicas = [];
        uebsUnicasL.forEach((item) => {
          if (uebsUnicas.indexOf(item) == -1) {
            uebsUnicas = [...uebsUnicas, item]; //uebsUnicas.push(item);
          }
        });
        uebsUnicas.sort();
        let arr = [];
        //if (uebsUnicas.length > 0 && uebsUnicas[0] == null) {
        if (
          uebsUnicas.length > 0 &&
          uebsUnicas[uebsUnicas.length - 1] == null
        ) {
          let data = {
            tabla: "ueb",
            accion: "buscar",
            datos: {
              where: {
                activo: {
                  equals: true,
                },
              },
            },
          };
          let res = await enviarDatos(data);
          if (res.length > 0) {
            arr.push(res);
            setUeb(arr[0]);
          }
          data = {
            tabla: "buscarUebTrabajador",
            accion: "raw",
            datos: {
              usuarioId: usuarioActivo?.usuarioId,
            },
          };
          let uebUsuario = await enviarDatos(data);

          function checkUebUsuario(el, uebUsuario) {
            if (uebUsuario.length > 0) {
              return el?.id == uebUsuario[0];
            }
            return -1;
          }

          // diferente de null que pertenece a alguna ueb
          if (uebUsuario[0] != null) {
            if (arr[0]?.length > 0 && ind != -1) {
              let ind = arr[0].findIndex(checkUebUsuario);
              setValueUeb(arr[0][ind]);
            }
          } else {
            // asigno el primer valor del arreglo
            if (Array.isArray(arr) && arr[0]?.length > 0) {
              setValueUeb(arr[0][0]);
            }
          }
        } else {
          // si las ueb no devuelven null
          // tiene acceso solamente a algunas
          //este for se puede hacer en una sola consulta usando IN///////////////////
          /*for (let ueb of uebsUnicas) {
            let data = {
              tabla: "ueb",
              accion: "get",
              datos: {
                where: {
                  id: ueb,
                },
              },
            };
            let res = await enviarDatos(data);

            if (res) {
              arr.push(res);
            }
          }*/
          let data = {
            tabla: "ueb",
            accion: "buscar",
            datos: {
              where: {
                id: { in: uebsUnicas },
              },
            },
          };
          let res = await enviarDatos(data);
          if (res) {
            arr = res;
          }
          setUeb(arr);
          if (arr.length > 0) {
            setValueUeb(arr[0]);
          }
        }
        setCols(columns);
      }
      data = {
        tabla: "buscarAnnoUnico",
        accion: "raw",
      };
      let res = await enviarDatos(data);
      if (!res?.message && res != []) {
        res = res.map((item) => {
          return {
            id: item?.anno,
            nombre: `${item?.anno}`,
          };
        });
        setAnno(res);
        //si el anno actual esta entre los annos lo pongo sino el primero
        let annoActual = new Date().getUTCFullYear();
        if (res.find((item) => item.id == annoActual))
          setValueAnno({
            id: annoActual,
            nombre: `${annoActual}`,
          });
        else setValueAnno(res[0]);
      }
    };
    asyn();
    setValue(0);
  }, [usuarioActivo]);

  useEffect(() => {
    setExpanded(false);
    if (valueGuia && valueMes && valueUeb && valueAnno) {
      if (primeraEjecucion) {
        setPrimeraEjecucion(false); //no se si fucione
        llenado().then((result) => {
          setPrimeraEjecucion(true); //no se si fucione
          traerComponentes();
          validarEnTiempo();
        });
      }
    }
    validar(validarGuia, setValidarGuia, valueGuia);
    validar(validarUeb, setValidarUeb, valueUeb);
    validar(validarMes, setValidarMes, valueMes);
    validar(validarAnno, setValidarAnno, valueAnno);
  }, [valueGuia, valueMes, valueUeb, valueAnno]);

  useEffect(() => {
    if (
      typeof value != undefined &&
      valueGuia &&
      valueMes &&
      valueUeb &&
      valueAnno
    ) {
      traerGuia();
    }
  }, [valueGuia, tabComponente, value, valueMes, valueUeb, valueAnno]);

  const puedeEditarFuncion = async () => {
    if (usuarioActivo?.usuarioId) {
      let result = tienePermiso(usuarioActivo, {
        permiso: "aplicacion_guia_escritura",
        ueb: valueUeb?.id,
      });
      setMostrarEdicion(result);
      setPuedeEditar(result); //Puede(pero debe) olvidar los otros permisos///////////////////
      result = tienePermiso(usuarioActivo, {
        permiso: "aplicacion_guia_especial",
      });
      setMostrarEspecial(result);
    } else {
      let usuarioAut = await getUsuarioAut();
      let result = tienePermiso(usuarioAut, {
        permiso: "aplicacion_guia_escritura",
        ueb: valueUeb?.id,
      });
      setMostrarEdicion(result);
      setPuedeEditar(result); //Puede(pero debe) olvidar los otros permisos///////////////////
      result = tienePermiso(usuarioAut, {
        permiso: "aplicacion_guia_especial",
      });
      setMostrarEspecial(result);
    }
  };

  useEffect(() => {
    puedeEditarFuncion();
  }, [valueUeb, usuarioActivo]);

  const evaluar = (valor) => {
    switch (valor) {
      case 1:
      case "1":
        return (
          <div style={{ marginLeft: "14px" }}>
            <Done color={"success"} size={10} />
          </div>
        );
      case 2:
      case "2":
        return (
          <div style={{ marginLeft: "42px" }}>
            <Close color={"error"} />
          </div>
        );
      case 3:
      case "3":
        return (
          <div style={{ marginLeft: "75px" }}>
            <HorizontalRule color={"secondary"} />
          </div>
        );
      default:
        return (
          <div>
            <QuestionMark color={"light"} />
          </div>
        );
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "Id",
      width: 20,
      editable: false,
      hidden: true,
      sortable: false,
    },
    {
      field: "numero",
      headerName: "No.",
      width: 60,
      editable: false,
      sortable: false,
    },
    {
      field: "nombre",
      headerName: "ASPECTOS/INCISOS A VERIFICAR",
      width: 600,
      editable: false,
      sortable: false,
    },
    {
      field: "valoracion_id",
      headerName: "?  | Sí  |  No  | Npc",
      type: "singleSelect",
      width: 140,
      editable: true,
      sortable: false,
      valueOptions: () => selectValoracion,
      getOptionValue: (value) => value.value,
      getOptionLabel: (value) => value.label,
      valueFormatter: ({ id, value, field, api }) => {
        if (value?.label) {
          selectValoracion.find((opt) => opt.value === value.label);
        }
      },
      renderCell: (params) => (
        <LightTooltip
          title={params.row.valor ? params.row.valor : "Por definir"}
          arrow
        >
          {evaluar(params.row.valoracion_id)}
        </LightTooltip>
      ),
    },
    {
      field: "fundamentacion",
      headerName: "Fundamentación",
      width: 180,
      editable: true,
      sortable: false,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Acciones",
      width: 100,
      hidden: false,
      sortable: false,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <LightTooltip title={"Guardar"} arrow>
              <GridActionsCellItem
                icon={<SaveIcon color="primary" />}
                label="Guardar"
                onClick={handleSaveClick(id)}
              />
            </LightTooltip>,
            <LightTooltip title="Cancelar" arrow>
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
              />
            </LightTooltip>,
          ];
        } else if (puedeEditar && enTiempo) {
          return [
            <GridActionsCellItem
              icon={
                <LightTooltip title={"Editar"} arrow>
                  <EditIcon color="success" />
                </LightTooltip>
              }
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />,
            <PlanComponent
              aplicacion_id={id}
              setOpenSMS={setOpenSMS}
              mostrarEdicion={mostrarEdicion}
              enTiempo={enTiempo}
              mostrarEspecial={mostrarEspecial}
            />,
          ];
        } else {
          return [
            <PlanComponent
              aplicacion_id={id}
              setOpenSMS={setOpenSMS}
              mostrarEdicion={mostrarEdicion}
              enTiempo={enTiempo}
              mostrarEspecial={mostrarEspecial}
            />,
          ];
        }
      },
    },
  ];

  const columnVisibilityModel = {
    id: false,
    //actions: puedeEditar && enTiempo,
  };

  const validarEnTiempo = async () => {
    let ahora = new Date();
    //let fecha_inicio = new Date(valueGuia?.fecha_inicio.slice(0, 10));
    //let fecha_fin = new Date(valueGuia?.fecha_fin.slice(0, 10));
    //if (ahora >= fecha_inicio && ahora <= fecha_fin) {
    //se busca si hay una fecha de cierre definida en particular
    let data = {
      tabla: "buscarCierreExtension",
      accion: "raw",
      datos: {
        anno: valueAnno?.id,
        mes: valueMes?.id,
        ueb_id: valueUeb?.id,
        guia_id: valueGuia?.id,
      },
    };

    let res = await enviarDatos(data);
    if (res.length != 0) {
      // SI EXISTE GUARDAR ESTE ID EN UNA PROPIEDAD DE DIALOG Y PASARLO AL DIALOG, PARA ALLI NO TENER QUE BUSCAR DE NUEVO
      setDialog({ ...dialog, objeto: res[0]?.id });
      let tiempofechaExtension = res[0]?.fecha_extension.slice(0, 10);
      let dateFechaExtension = new Date(tiempofechaExtension);
      setDialog({ ...dialog, fechaPrevia: dateFechaExtension, hoy: ahora });

      if (ahora > dateFechaExtension) {
        setEnTiempo(false);
      } else {
        setEnTiempo(true);
      }
    } else {
      //se busca la fecha de cierre por defecto para una ueb
      if (!valueUeb?.es_direccion) {
        let data = {
          tabla: "configuracion",
          accion: "buscar",
          datos: {
            where: {
              nombre: "fecha_cierre_ueb",
            },
          },
        };
        let res = await enviarDatos(data);
        if (res.length != 0) {
          let dateFechaExtension = new Date(
            valueAnno?.id +
              "-" +
              ceroDelante(valueMes?.id + 1) +
              "-" +
              ceroDelante(res[0]?.valor)
          );
          setDialog({
            ...dialog,
            fechaPrevia: dateFechaExtension,
            hoy: ahora,
          });

          if (ahora > dateFechaExtension) {
            setEnTiempo(false);
          } else {
            setEnTiempo(true);
          }
        } else {
          setEnTiempo(false);
        }
      } else {
        //se busca la fecha de cierre por defecto para una direccion
        let data = {
          tabla: "configuracion",
          accion: "buscar",
          datos: {
            where: {
              nombre: "fecha_cierre_direccion",
            },
          },
        };
        let res = await enviarDatos(data);
        if (res.length != 0) {
          let dateFechaExtension = new Date(
            valueAnno?.id +
              "-" +
              ceroDelante(valueMes?.id + 1) +
              "-" +
              ceroDelante(res[0]?.valor)
          );
          setDialog({
            ...dialog,
            fechaPrevia: dateFechaExtension,
            hoy: ahora,
          });

          if (ahora > dateFechaExtension) {
            setEnTiempo(false);
          } else {
            setEnTiempo(true);
          }
        } else {
          setEnTiempo(false);
        }
      }
    }
    /*} else {
      setEnTiempo(false);
    }*/
  };

  const salvar = async (obj) => {
    let aplic = await aplicar(obj);
    if (!obj?.numero) {
      //es un inciso
      if (aplic && aplic?.id) {
        mostrarMensaje(setOpenSMS, "Inciso guardado!", 2500, "success");
        //actualizar el aspecto de este inciso segun sis y nos
        let tmp = await filaAspecto(obj?.aspecto);
        aplicar(tmp);
        return tmp;
      } else {
        if (aplic && aplic?.message) {
          mostrarMensaje(setOpenSMS, aplic?.message, 3000, "error");
        }
      }
    } else {
      //es un aspecto
      if (aplic && aplic?.id) {
        mostrarMensaje(setOpenSMS, "Aspecto guardado!", 2500, "success");
      } else {
        if (aplic && aplic?.message) {
          mostrarMensaje(setOpenSMS, aplic?.message, 3000, "error");
        }
      }
    }
    return false;
  };

  const aplicar = async (newRow) => {
    if (newRow?.aplicacionId) {
      let data = {
        accion: "modificar",
        tabla: "ga_guia_aplicacion",
        datos: {
          fundamentacion: newRow?.fundamentacion,
          valoracion_id: newRow?.valoracion_id
            ? Number(newRow?.valoracion_id)
            : null,
        },
      };

      return await enviarDatos(
        data,
        null,
        "/api/db/simpleQuery?id=" + newRow?.aplicacionId
      );
    }
  };

  // Falta por optimizar
  let data = {};
  const obtenerAplicacionGuiaPorComponente = async (
    aplicacionGuiaCompleta = false,
    sendMail = false
  ) => {
    data = {
      tabla: "aplicacionGuiaPorComponente",
      accion: "raw",
      datos: {
        //----------------
        componente_id: "",
        //----------------
        norma_id: norma?.id,
        guia_id: valueGuia?.id,
        ueb_id: valueUeb?.id,
        mes: valueMes?.id,
        anno: valueAnno?.id,
      },
    };

    try {
      //console.log('sendMail: ', sendMail);

      if (aplicacionGuiaCompleta) {
        const launchAllComponent = await Promise.all(
          tabComponente.map(async (item) => {
            data.datos["componente_id"] = item.id;

            let result = await enviarDatos(data);
            generateDocument(
              result,
              item.nombre,
              valueMes.nombre,
              valueAnno.nombre
            );
          })
        );
        aplicacionGuiaCompleta = false;
      } else {
        data.datos["componente_id"] = tabComponente[value]?.id;

        let result = await enviarDatos(data);
        generateDocument(
          result,
          tabComponente[value].nombre,
          valueMes.nombre,
          valueAnno.nombre,
          sendMail
        );
      }
      //poner mensajes de
    } catch (error) {}
    //return result;
  };

  //para que cuando actualice el id de la valoracion, tambien actualice el tooltip que se muestra
  const actToolTip = (rowTmp) => {
    if (rowTmp?.valoracion_id == 1) rowTmp.valor = "Sí";
    else if (rowTmp?.valoracion_id == 2) rowTmp.valor = "No";
    else if (rowTmp?.valoracion_id == 3) rowTmp.valor = "No procede";
    else rowTmp.valor = "Por definir";
    return rowTmp;
  };

  const processRowUpdate = async (newRow) => {
    newRow = actToolTip(newRow);
    //newNewRow es la fila del aspecto donde se actualiza segun sis y nos de incisos
    let newNewRow = await salvar(newRow);
    let updatedAspRow = {};
    if (newNewRow) {
      newNewRow = actToolTip(newNewRow);
      updatedAspRow = { ...newNewRow, isNew: false };
    }

    const updatedRow = { ...newRow, isNew: false };
    // la siguiente linea actualiza todas las filas de la tabla
    //setRows(rows.map((row) => (row.id === newRow?.id ? updatedRow : row)));
    setRows(
      rows.map((row) =>
        row.id === newRow?.id
          ? updatedRow
          : row.id === newNewRow?.id
          ? updatedAspRow
          : row
      )
    );
    return updatedRow;
  };



  const valorar = async () => {
    let data = {
      tabla: "ga_valoracion",
      accion: "buscar",
      datos: {
        where: {
          activo: true,
        },
      },
    };
    let valoracion = await cargarEn(data, "simpleQuery", setSelectValoracion);
    if (valoracion.length > 0) {
      valoracion = valoracion.map((item) => {
        let obj = {
          value: item.id,
          label: item.valor,
        };
        return obj;
      });
    }
    setSelectValoracion(valoracion);
  };

  const validar = (objeto, setObjeto, valor) => {
    if (!valor) {
      setObjeto({
        ...objeto,
        error: true,
        helperText: "El campo es obligatorio",
      });
    } else {
      setObjeto({
        ...objeto,
        error: false,
        helperText: "",
      });
    }
  };

  const traerComponentes = async () => {
    /*let componentesUnicos = getComponentesPermitidos(
      usuarioActivo,
      "aplicacion_guia_escritura"
    );
    if (componentesUnicos.length == 0) {
      let c = getComponentesPermitidos(
        usuarioActivo,
        "aplicacion_guia_lectura"
      );
      if (c.length != 0) {
        componentesUnicos = c;
        /////////////////////setPuedeEditar(false);
      }
    } else {
      if (puedeEditar) {
        /////////////////////setPuedeEditar(true);
      }
    }*/
    let componentesUnicosL = getComponentesPermitidos(
      usuarioActivo,
      "aplicacion_guia_lectura"
    );
    let componentesUnicosE = getComponentesPermitidos(
      usuarioActivo,
      "aplicacion_guia_escritura"
    );
    componentesUnicosL = componentesUnicosL.concat(componentesUnicosE);
    let componentesUnicos = [];
    componentesUnicosL.forEach((item) => {
      if (componentesUnicos.indexOf(item) == -1) {
        componentesUnicos.push(item);
      }
    });
    componentesUnicos.sort();

    let arrC = [];
    let componentes = await buscarComponentesPorGuia(valueGuia?.id);
    //if (componentesUnicos[0] == null) {
    if (
      componentesUnicos.length > 0 &&
      componentesUnicos[componentesUnicos.length - 1] == null
    ) {
      let arr = [];
      for (let comp of componentes) {
        ////////////comp[0];
        arr.push(comp.ga_componente);
      }
      setTabComponente(arr);
    } else {
      // LO QUE ESTA PASANDO ES QUE COMPONENTES TRAE LOS QUE UNOS Y COMPONENTES UNICOS TRAE OTROS
      // DEJAR PASAR LOS DE COMPONENTES UNICOS QUE ESTEN EN COMPONENTES
      // FILTRAR LOS COMPONENTES DE COMPONENTES QUE COINCIDEN CON LOS COMPONENTES UNICOS
      let ar = [];
      for (let a of componentes) {
        if (componentesUnicos.includes(a?.ga_componente?.id)) {
          ar.push(a?.ga_componente?.id);
        }
      }

      if (ar.length == 0) {
        setTabComponente([]);
        setNormas([]);
      } else {
        //este for se puede hacer en una sola consulta usando IN///////////////////
        for (let item of ar) {
          let data = {
            tabla: "ga_componente",
            accion: "get",
            datos: {
              where: {
                id: item,
              },
            },
          };
          let res = await enviarDatos(data);
          if (res) {
            arrC.push(res);
            if (arrC.length > 0) {
              setTabComponente(arrC);
            }
          }
        }
      }
    }
  };

  const llenado = async () => {
    let data1 = {
      tabla: "configuracion",
      accion: "buscar",
      datos: {
        where: {
          nombre: "llenar_guia_en_ejecucion",
        },
      },
    };
    let res1 = await enviarDatos(data1);

    let data = {
      guiaId: valueGuia?.id,
      uebId: valueUeb?.id,
      mes: valueMes?.id,
      anno: valueAnno?.id,
    };
    //la segunda vez que se llama se espera un tiempo
    if (res1 && res1.length > 0 && res1[0].valor == 1) {
      setTimeout(async () => {
        //console.log('----CON timeout')
        let res = await enviarDatos(data, setOpenSMS, "/api/db/llenarGuia");
        if (res !== true) {
          mostrarMensaje(setOpenSMS, res.message, 6000, "error");
        }
      }, 1000);
    } else {
      //console.log('----SIN timeout')
      let res = await enviarDatos(data, setOpenSMS, "/api/db/llenarGuia");
      if (res !== true) {
        mostrarMensaje(setOpenSMS, res.message, 6000, "error");
      }
    }
  };

  async function traerGuia() {
    if (valueGuia?.id) {
      if (tabComponente.length > 0) {
        let data = {
          tabla: "getNormasPorGuiaComponente",
          accion: "raw",
          datos: {
            componente_id: tabComponente[value]?.id,
            guia_id: valueGuia?.id,
          },
        };
        let normas = await enviarDatos(data);

        if (normas.length > 0) {
          setNormas(normas);
        } else {
          setDisabledComponente(tabComponente);
        }
      } else {
        setNormas([]);
      }
    }

    /*if (usuarioActivo?.roles) {
      let rolesPermisos = usuarioActivo?.roles[0]?.rol?.rol_permiso;
      if (typeof rolesPermisos === "object") {
        try {
          rolesPermisos = Object.values(rolesPermisos);
        } catch (error) {
          // error
        }
      }

      if (rolesPermisos && Array.isArray(rolesPermisos)) {
        let escritura = rolesPermisos.filter(
          (item) => item.permiso.nombre === "aplicacion_guia_escritura"
        );
        let lectura = rolesPermisos.filter(
          (item) => item.permiso.nombre === "aplicacion_guia_lectura"
        );
        if (escritura.length > 0 || lectura.length > 0) {
          if (valueGuia?.id) {
            if (tabComponente.length > 0) {
              let data = {
                tabla: "ga_norma_componente",
                accion: "buscar",
                datos: {
                  where: {
                    componente_id: {
                      equals: tabComponente[value]?.id,
                    },
                  },
                  select: {
                    ga_norma: true,
                  },
                },
              };
              let normas = await enviarDatos(data);

              if (normas.length > 0) {
                normas = normas.map((item) => item?.ga_norma);
                setNormas(normas);
              } else {
                setDisabledComponente(tabComponente);
              }
            } else {
              setNormas([]);
            }
          }
        }
      }
    }*/
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const contarValoracion = async (aspectoId) => {
    let data = {
      tabla: "contar_valoracion",
      accion: "raw",
      datos: {
        aspectoId: aspectoId,
        guiaId: valueGuia?.id,
        fechaInicial: new Date(fechas().fechaInicial),
        fechaFinal: new Date(fechas().fechaFinal),
        uebId: valueUeb?.id,
      },
    };
    let valoracion = await enviarDatos(data);

    if (valoracion) {
      return valoracion;
    }
    return false;
  };

  const ceroDelante = (valor) => {
    return Number(valor) < 10 ? `0${valor}` : valor;
  };

  const fechas = () => {
    //cambiar por mes y anno//////////////////////////////////
    let fechaInicial = `${valueAnno?.id}-${ceroDelante(valueMes?.id)}-01`;
    let fechaFinal = `${valueAnno?.id}-${ceroDelante(valueMes.id)}-28`;
    let fechas = { fechaInicial, fechaFinal };
    return fechas;
  };

  const buscarComponentesPorGuia = async (guiaId) => {
    let data = {
      tabla: "ga_componente_guia",
      accion: "buscar",
      datos: {
        where: {
          guia_id: {
            equals: guiaId,
          },
        },
        select: {
          ga_componente: true,
        },
      },
    };
    return await enviarDatos(data);
  };

  const buscarAspectosPorNorma = async (normaId) => {
    let data = {
      tabla: "buscarAspectosPorNorma",
      accion: "raw",
      datos: {
        norma_id: normaId,
        guia_id: valueGuia?.id,
        ueb_id: valueUeb?.id,
        mes: valueMes?.id,
        anno: valueAnno?.id,
      },
    };
    return await enviarDatos(data);
  };

  const filaAspecto = async (aspecto) => {
    let aspectoValoracion = await contarValoracion(aspecto?.aspecto_id);

    let sis = 0;
    let nos = 0;
    if (aspectoValoracion.length > 0) {
      sis = aspectoValoracion.filter((item) => item.valoracion_id == 1);
      nos = aspectoValoracion.filter((item) => item.valoracion_id == 2);
    }

    let tmp = {
      ...aspecto,
    };

    if (sis.length > 0) {
      sis = sis.length > 0 ? sis[0]?.count_valoracion : 0;
      nos = nos.length > 0 ? nos[0]?.count_valoracion : 0;

      let valoracionTemp = null;
      let valor;
      if (sis > nos) {
        valoracionTemp = 1;
        valor = sis[0]?.valor;
      } else if (sis < nos) {
        valoracionTemp = 2;
        valor = nos[0]?.valor;
      } else if (sis == nos) {
        valoracionTemp = null;
        valor = "Por definir";
      }
      tmp = {
        ...tmp,
        valoracion_id: valoracionTemp,
        valor: valor,
      };
    }
    return tmp;
  };

  const handleChangeAcc =
    (normaNombre, normaId) => async (event, isExpanded) => {
      setExpanded(isExpanded ? normaNombre : false);
      if (isExpanded) {
        try {
          let norma = {
            id: normaId,
            nombre: normaNombre,
          };
          setNorma(norma);
          let arr = [];
          setRows(arr);

          //busca los aspectos y los incisos
          let aspectos_incisos = await buscarAspectosPorNorma(normaId);

          let aspecto_actual = {};
          for (let a of aspectos_incisos) {
            //si no hay inciso_id entonces es un aspecto
            if (!a?.inciso_id) {
              aspecto_actual = {
                id: a?.aplicacion_id,
                aspecto_id: a?.aspecto_id,
                nombre: a?.aspecto_nombre,
                numero: a?.aspecto_numero,
                aplicacionId: a?.aplicacion_id,
                aspectoGuiaId: a?.aspecto_guia_id,
                fundamentacion: a?.fundamentacion,
                valoracion_id: a?.valoracion_id,
                valor: a?.valor,
              };
              arr = [...arr, aspecto_actual];
            } else {
              let obj = {
                id: a?.aplicacion_id,
                inciso_id: a?.inciso_id,
                nombre: `${a?.inciso_letra}) ${a?.inciso_nombre}`,
                numero: undefined,
                fundamentacion: a?.fundamentacion,
                valoracion_id: a?.valoracion_id,
                valor: a?.valor,
                aplicacionId: a?.aplicacion_id,
                aspecto: aspecto_actual,
              };

              arr = [...arr, obj];
            }
          }
          setRows(arr);
        } catch (error) {
          //
        }
      }
    };

  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  return (
    <>
      <Head>
        <title>GAMAz, Aplicar guía </title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Card elevation={10} className="mt-2">
        <CardContent>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ pb: 3 }}
          >
            <Grid>
              <font color="green">
                <h6>Aplicar guía</h6>
              </font>
            </Grid>
            <Grid>
              {Object.keys(usuarioActivo).length !== 0 && (
                <BasicSpeedDial
                  usuarioActivo={usuarioActivo}
                  dialog={dialog}
                  enTiempo={enTiempo}
                  setDialog={setDialog}
                  /* completa */
                  obtenerAplicacionGuiaPorComponente={
                    obtenerAplicacionGuiaPorComponente
                  }
                  valueAnno={valueAnno}
                  valueGuia={valueGuia}
                  valueMes={valueMes}
                  valueUeb={valueUeb}
                  ueb_s={ueb}
                  extender={
                    <ExtenderCierre
                      dialog={dialog}
                      setDialog={setDialog}
                      valueGuia={valueGuia}
                      valueMes={valueMes}
                      valueUeb={valueUeb}
                    />
                  }
                />
              )}
            </Grid>
          </Grid>

          <Grid
            container
            spacing={1}
            direction="row"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item sm={12} md={9} xl={3} lg={3}>
              <Autocomplete
                fullWidth
                value={valueGuia || null}
                onChange={(_event, newValue2) => {
                  setValueGuia(newValue2);
                }}
                inputValue={inputValueGuia}
                onInputChange={(_event, newInputValue2) => {
                  setInputValueGuia(newInputValue2);
                }}
                id="guia"
                options={guia}
                autoHighlight
                getOptionLabel={
                  (option) => `${option.version}` // ${option.version} / ${option.anno}
                }
                style={{ height: 40 }}
                size={"small"}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    variant="outlined"
                    fullWidth
                    label="Buscar guía por versión"
                    size={"small"}
                    error={validarGuia.error}
                    helperText={validarGuia.helperText}
                  />
                )}
              />
            </Grid>
            <Grid item sm={12} md={9} xl={3} lg={3}>
              <Autocomplete
                fullWidth
                value={valueUeb || null}
                onChange={(_event, newValue2) => {
                  setValueUeb(newValue2);
                }}
                inputValue={inputValueUeb}
                onInputChange={(_event, newInputValue2) => {
                  setInputValueUeb(newInputValue2);
                }}
                id="ueb"
                options={ueb}
                autoHighlight
                getOptionLabel={(option) => `${option.alias}`}
                style={{ height: 40 }}
                size={"small"}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    variant="outlined"
                    fullWidth
                    label="Filtrar por UEB"
                    size={"small"}
                    error={validarUeb.error}
                    helperText={validarUeb.helperText}
                  />
                )}
              />
            </Grid>
            <Grid item sm={12} md={9} xl={3} lg={3}>
              <Autocomplete
                fullWidth
                value={valueMes || null}
                onChange={(_event, newValue2) => {
                  setValueMes(newValue2);
                }}
                inputValue={inputValueMes}
                onInputChange={(_event, newInputValue2) => {
                  setInputValueMes(newInputValue2);
                }}
                id="mes"
                options={mes}
                autoHighlight
                getOptionLabel={(option) => option.nombre}
                style={{ height: 40 }}
                size={"small"}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    variant="outlined"
                    fullWidth
                    label="Filtrar por mes"
                    size={"small"}
                    error={validarMes.error}
                    helperText={validarMes.helperText}
                  />
                )}
              />
            </Grid>
            <Grid item sm={12} md={9} xl={3} lg={3}>
              <Autocomplete
                fullWidth
                value={valueAnno || null}
                onChange={(_event, newValue2) => {
                  setValueAnno(newValue2);
                }}
                inputValue={inputValueAnno}
                onInputChange={(_event, newInputValue2) => {
                  setInputValueAnno(newInputValue2);
                }}
                id="anno"
                options={anno}
                autoHighlight
                getOptionLabel={(option) => option.nombre}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                style={{ height: 40 }}
                size={"small"}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    variant="outlined"
                    fullWidth
                    label="Filtrar por año"
                    size={"small"}
                    error={validarAnno.error}
                    helperText={validarAnno.helperText}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Box sx={{ width: "100%", mt: 2, height: "20px" }}></Box>
          {valueGuia && valueUeb && valueMes && (
            <Paper variant="elevation" elevation={10}>
              <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                    aria-label="scrollable force tabs example visible arrows"
                    sx={{
                      "& .MuiTabs-scrollButtons.Mui-disabled": {
                        opacity: 0.3,
                      },
                      "& .MuiTab-textColorInherit.Mui-selected": {
                        color: "#008000",
                        // color: "#9CCC3C",
                      },
                    }}
                    textColor="inherit"
                    TabIndicatorProps={{
                      sx: {
                        bgcolor: "#008000",
                        // bgcolor: "#9CCC3C",
                      },
                    }}
                  >
                    {tabComponente &&
                      tabComponente.map((item) => (
                        <Tab
                          key={`tab-${item?.id}`}
                          /* label={item.nombre} */
                          label={
                            <SubMenu
                              component={item.nombre} //para mostrar Menu_tres puntos
                              obtenerAplicacionGuiaPorComponente={
                                obtenerAplicacionGuiaPorComponente
                              }
                            />
                          }
                          disabled={disabledComponente.includes(item)}
                          /*  sx={{ fontWeight: 350 }} */
                          sx={{
                            /* fontWeight: 350,                             */
                            "&:hover": {
                              /* bgcolor: 'success.dark', // use summary hover background  */
                              color: "success.dark", // use summary hover color
                            },
                          }}
                        />
                      ))}
                  </Tabs>

                  {normas &&
                    normas.map((item) => (
                      <Accordion
                        key={`accordion-${item?.nombre}`}
                        expanded={expanded === `${item?.nombre}`}
                        onChange={handleChangeAcc(item?.nombre, item?.id)}
                      >
                        <AccordionSummary
                          /* style={{ backgroundColor: "66FF99" }} */
                          expandIcon={
                            <ArrowDropDownIcon color="success" size={25} />
                          }
                          sx={{
                            "&:hover": {
                              color: "success.light", // text hover color
                            },
                          }}
                        >
                          <Typography>{item?.nombre}</Typography> {/* normas */}
                        </AccordionSummary>

                        <AccordionDetails>
                          <Box sx={{ height: 400, width: "100%" }}>
                            <DataGrid
                              /*  autoHeight */
                              key={item?.id}
                              density="compact"
                              localeText={
                                esES.components.MuiDataGrid.defaultProps
                                  .localeText
                              }
                              rows={rows}
                              columns={columns}
                              //columns={cols}
                              columnVisibilityModel={columnVisibilityModel}
                              initialState={{
                                pagination: {
                                  paginationModel: {
                                    pageSize: 25,
                                  },
                                },
                              }}
                              pageSizeOptions={[25]}
                              //checkboxSelection
                              disableMultipleRowSelection={true}
                              /* editMode={modoEdicion} */
                              getRowHeight={() => "auto"}
                              slots={{
                                pagination: CustomPagination,
                              }}
                              editMode={enTiempo && puedeEditar && "row"}
                              rowModesModel={rowModesModel}
                              onRowModesModelChange={handleRowModesModelChange}
                              onRowEditStart={handleRowEditStart}
                              onRowEditStop={handleRowEditStop}
                              processRowUpdate={
                                item?.id == norma?.id && processRowUpdate
                              }
                              slotProps={{
                                toolbar: { setRows, setRowModesModel },
                              }}
                            />
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                </Box>
              </Box>
            </Paper>
          )}
        </CardContent>
      </Card>
      <CustomizedSnackbars openSMS={openSMS} setOpenSMS={setOpenSMS} />
    </>
  );
}

export default Aplicacion;
