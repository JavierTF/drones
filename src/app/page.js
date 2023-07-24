// Note.js - Server Component

// import db from 'db'; 
// (A1) We import from NoteEditor.js - a Client Component.
import Home from './Home';
import seed from '../pages/api/seed';

async function Servidor(props) {
  const {id, isEditing} = props;
  // (B) Can directly access server data sources during render, e.g. databases
  // const note = await db.posts.get(id);
  
  return (
    <div>
      {/* <h1>{'Jelouuuu'}</h1> */}
      <Home />
      {/* <section>{note.body}</section>
      {isEditing 
        ? <NoteEditor note={note} />
        : null
      } */}
    </div>
  );
}

export default Servidor;