import Home from "./Home";
import Waiting from "./Waiting";
import { cargarDatosIniciales } from "./loadData";

async function Servidor() {
  const executed = await cargarDatosIniciales();

  return <div>{!executed ? <Waiting /> : <Home />}</div>;
}

export default Servidor;