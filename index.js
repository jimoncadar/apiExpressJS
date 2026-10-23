import express from 'express'
import pool from './db.js';

const app = express();
app.use(express.json());
const PORT = 3000;

app.get('/', (req, res)=>{
    res.json({
        mensaje:"Bienvenidos a mi app"
    });
});

app.get('/usuarios', async(req, res)=>{
    try{
        const [respuesta] = await pool.query("select * from usuarios");
        res.json(respuesta);    
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            mensaje:`Error: problemas con el servidor`
        });
    }
});

app.get('/usuarios/:id', async(req, res)=>{
    try{
        const id = parseInt(req.params.id);

        if(isNaN(id)){
            return res.status(400).json({
                mensaje:"Solo se permiten números en el id"
            })
        }

        const [respuesta] = await pool.query("select * from usuarios where id=?",[id]);

        if(respuesta.length == 0){
            return res.status(404).json({mensaje:"Usuario no encontrado"});
        }

        res.json(respuesta);    
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            mensaje:`Error: problemas con el servidor`
        });
    }
});

app.post('/usuarios', async (req, res)=>{
    try{
        const {nombre} = req.body;

        if(!nombre){
            return res.status(400).json({
                mensaje:"Debe enviar algo en nombre"
            });
        }

        const [resultado] = await pool.query(
            "insert into usuarios(nombre) values(?)",
            [nombre]
        );

        if(resultado.affectedRows == 0){
            return res.status(404).json({
                mensaje:"Usuario no registrado"
            });
        }

        res.status(201).json({
            mensaje:"Usuario registrado",
            usuario:{
                id:resultado.insertId,
                nombre:nombre
            }            
        });        
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            mensaje:`Error: problemas con el servidor: ${error}`
        });
    }
});

app.put('/usuarios/:id', async(req, res)=>{    
    try{
        const id = req.params.id;

        if(isNaN(id)){
            return res.status(400).json({
                mensaje:"Solo se permiten números en el id"
            })
        }

        const {nombre} = req.body;

        if(!nombre){
            return res.status(400).json({
                mensaje:"Debe enviar algo en nombre"
            });
        }

        const [resultado] = await pool.query("update usuarios set nombre=? where id=?",[nombre, id]);

        if(resultado.affectedRows==0){
            return res.status(404).json({
                mensaje:"Usuario no encontrado"
            })
        }

        res.json({
            mensaje:"Usuario modificado",
            usuario:{
                id:id,
                nombre:nombre
            }
        });        
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            mensaje:`Error: problemas con el servidor: ${error}`
        });
    }    
});

app.delete('/usuarios/:id', async(req, res)=>{
     try{
        const id = req.params.id;

        if(isNaN(id)){
            return res.status(400).json({
                mensaje:"Solo se permiten números en el id"
            })
        }

        const [resultado] = await pool.query("delete from usuarios where id=?",[id]);

        if(resultado.affectedRows==0){
            return res.status(404).json({
                mensaje:"Usuario no encontrado"
            })
        }

        res.json({
            mensaje:"Usuario eliminado",
            usuario:{
                id:id            
            }
        });        
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            mensaje:`Error: problemas con el servidor: ${error}`
        });
    }    
});

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});