export const validateSerialNumber = (serialNumber, arr) => {
  return serialNumber.toString() != "" &&
    serialNumber.toString().length <= 100 &&
    Array.isArray(arr) &&
    !arr.includes(serialNumber)
    ? true
    : false;
};

export const addWeights = (updatedV) => {
  if (updatedV.length === 0) return 0;
  let suma = 0;
  for (let elem of updatedV) {
    suma += parseFloat(elem.weight);
  }
  return suma;
};

export const validateRange = (field, top) => {
  if (typeof top !== "number") return false;
  return parseInt(field) > 0 && parseInt(field) <= parseInt(top) ? true : false;
};

export const validateString = (field, regex) => {
  return regex.test(field);
};

export const extension = (ref) => {
  const fileName = ref.files[0].name;
  return fileName.split(".").reverse()[0];
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
