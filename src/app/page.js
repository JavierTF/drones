import Home from "./Home";
import { cargarDatosIniciales } from "./loadData";

async function Servidor() {
  await cargarDatosIniciales();

  return <div><Home /></div>;
}

export default Servidor;