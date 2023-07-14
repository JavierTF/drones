import {
  quitarValoresCero,
  numRom,
  extension,
  enviarDatos,
  buscarUltimo,
  mostrarMensaje,
} from "../../lib/utiles";

const Home = () => {
  (async () => {
    let data = {
      tabla: "model",
      accion: "buscar",
    };
    let res = await enviarDatos(data);
    console.log('---RES', res);
  })();

  return <h1>Hola Caracola!</h1>;
};

export default Home;
