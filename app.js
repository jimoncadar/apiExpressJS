const express = require('express');

const app = express();
const port = 3000;

const estudiantes = [
    {
        id:1,
        Nombre:"Pere Gill",
        Clase:"BDD1",
        Nota:90
    },
    {
        id:2,
        Nombre:"Elena Nito",
        Clase:"BDD2",
        Nota:95
    },
    {
        id:3,
        Nombre:"Agri Pino",
        Clase:"Seminario Software",
        Nota:71
    }
]

app.get('/', (req, res) => {
  res.json({
    "Mensaje": "Bienvenidos a mi API"
  });
});

app.get('/estudiantes',(req, res)=>{
    res.json(estudiantes);
});

app.get('/estudiantes/:id', (req, res)=>{
     const id = req.params.id;

     const estudiante = estudiantes.find((alumno)=>{
        return alumno.id == id;
     });

     if(!estudiante){
        res.json({
            "Mensaje":"Alumno no encontrado"
        })
     }

     res.json(estudiante);
});

app.use((req, res)=>{
    res.status(404).json(
        {
            Mensaje:"Ruta no encontrada"
        }
    );
});

app.listen(port, () => {
  console.log(`Servidor ejecutandose en http://localhost:${port}`);
});