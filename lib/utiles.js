// import { enviarDatos } from "../lib/db_funciones";

// export const extension = (id_elemento) => {
//   const fileName = document.getElementById(id_elemento).files[0].name;
//   return fileName.split(".").reverse()[0];
// };

export const quitarValoresCero = (d, valor) => {
  var cero = 0;
  if (typeof valor !== "undefined") {
    cero = valor;
  }
  let obj = { ...d };
  const claves = Object.keys(obj);
  claves.forEach((el) => {
    if (obj[el] === cero) {
      delete obj[el];
    }
  });
  return obj;
};

export const numRom = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VI",
  "VII",
  "IX",
  "X",
  "XI",
  "XII",
  "XIII",
  "XIV",
  "XV",
  "XVI",
  "XVII",
  "XVIII",
  "XIX",
  "XX",
];

export const meses = [
  {id: 1, nombre: "enero"},
  {id: 2, nombre: "febrero"},
  {id: 3, nombre: "marzo"},
  {id: 4, nombre: "abril"},
  {id: 5, nombre: "mayo"},
  {id: 6, nombre: "junio"},
  {id: 7, nombre: "julio"},
  {id: 8, nombre: "agosto"},
  {id: 9, nombre: "septiembre"},
  {id: 10, nombre: "octubre"},
  {id: 11, nombre: "noviembre"},
  {id: 12, nombre: "diciembre"},
];

export const extension = (ref) => {
  const fileName = ref.files[0].name;
  return fileName.split(".").reverse()[0];
};

// set es de tipo función
export const cargarEn = async (
  data, // lo que se envía
  url, // simpleQuery o executeQuery
  set, // useState
  // results,
  convertToArray // boolean
  // noLimit
) => {
  // if (typeof results === 'undefined') {
  //   results = true;
  // }
  if (typeof convertToArray === "undefined") {
    convertToArray = false;
  }
  try {
    let response;
    if (typeof url === undefined || url === "simpleQuery") {
      response = await enviarDatos(data);
    } else {
      response = await enviarDatos(data, undefined, "executeQuery");
    }
    //   const params = new URLSearchParams([['limit', '50000']]);
    //   response = await client.get(`${url}`, { params });
    // console.log("RESPONSE", response);
    let datos = response;
    // console.log('datos', datos);
    // if (results == true) {
    //   datos = response.data.results;
    // } else {
    //   datos = response.data;
    // }
    if (convertToArray) {
      datos = [datos];
    }
    if (Array.isArray(set)) {
      for (let x of set) {
        x(datos);
      }
    } else {
      set(datos);
    }
    // console.log("datos", datos);
    return datos;
  } catch (error) {
   // console.log(error);
  }
  //   return datos;
};

// // export const mostrarErrores = (e) => {
// //   let x = e.response.data;
// //   for (let op in x) {
// //     setMessage({ text: `Error en ${op}: ${x[op]}`, severity: 'error' });
// //   }
// // };

export const existe = async (
  value,
  obj,
  campo,
  campoEnFormulario,
  idObjeto
) => {
  let x = obj.filter(
    (item) => item[`${campo}`] === value && item.id !== idObjeto
  );
  if (x.length > 0) {
    // poner en setOpenSMS
    console.log({
      text: `El valor ${value} ya existe para el campo ${campoEnFormulario}`,
      severity: "error",
    });
  }
  return x;
};

export const enviarDatos = async (
  data,
  setOpenSMS,
  url,
  mensajeOk,
  mensajeError
) => {
  const ruta = "http://localhost:3000";
  // const ruta = process.env.NEXT_PUBLIC_URL_SITE;
  // const ruta = .ENV;
  if (typeof url === "undefined" || url === "simpleQuery") {
    url = ruta.concat("/api/simpleQuery");
  }
  if (typeof mensajeOk === "undefined") {
    mensajeOk = "Ejecutado con éxito.";
  }
  if (typeof mensajeError === "undefined") {
    mensajeError = "Error al ejecutar la consulta.";
  }
  try {

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const res = await response.json();
    if (response.status === 200) {
      if (setOpenSMS) {
        setOpenSMS({
          open: true,
          sms: mensajeOk,
          typeSMS: "success",
        });
      }
    } else {
      let customErr = res?.message;
      if (!customErr) customErr = mensajeError;
      if (setOpenSMS) {
        setOpenSMS({
          open: true,
          sms: customErr,
          typeSMS: "error",
        });
      }
    }
    return res;
  } catch (error) {
    if (typeof setOpenSMS !== "undefined") {
      setOpenSMS({
        open: true,
        sms: mensajeError,
        typeSMS: "error",
      });
    }
  }
};

export const buscarUltimo = (func, arrOfObj, propiedad, termino) => {
  let claves = Object.keys(arrOfObj);
  let ultimo = arrOfObj[claves.length - 1];
  if (ultimo[propiedad]){
    return ultimo[propiedad].toLowerCase().includes(termino)
    ? buscarUltimo(buscarUltimo, ultimo)
    : ultimo;
  } else {
    return null;
  }  
};

export const mostrarMensaje = async (
  setOpenSMS,
  mensaje,
  tiempoMensaje,
  tipoMensaje
) => {
  setOpenSMS({
    open: false,
  });
  let tiempo = 6000;
  if (typeof tiempoMensaje !== "undefined") {
    tiempo = tiempoMensaje;
  }
  // tipo == error | warning | success | info
  let tipo = "success";
  if (typeof tipoMensaje !== "undefined") {
    tipo = tipoMensaje;
  }
  setOpenSMS({
    open: true,
    sms: `${mensaje}`,
    typeSMS: `${tipo}`,
  });
  setTimeout(() => {
    setOpenSMS({
      open: false,
    });
  }, tiempo);
};
