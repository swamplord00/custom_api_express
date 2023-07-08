// 1. Crear un endpoint que devuelva todos los productos

// 2. Crear un endpoint que devuelva un producto por id

// 3. Crear un endpoint que cree un producto

// 4. Crear un endpoint que modifique un producto

// 5. Crear un endpoint que elimine un producto

// 2.5 Modificar un endpoint que devuelva un producto por id o por nombre

const express = require("express");
const fs = require("fs-extra");

const app = express();
const PORT = process.env.PORT || 3000;

//midleware
app.use(express.json())

app.get("/productos", (req, res) => {
  fs.readFile("./db.js", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("error en el servidor");
    } else {
      res.status(200).send(data);
    }
  });
});

app.get("/productos/:id", (req, res) => {
  fs.readFile("./db.js", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("error en el servidor");
    } else {
      const productos = JSON.parse(data);
      const producto = productos.find(
        (producto) => producto.id === parseInt(req.params.id)
      );
      if (producto) {
        res.status(200).send(producto);
      } else {
        res.status(400).send("Producto no encontrado");
      }
    }
  });
});

app.post('/productos',(req,res)=>{
    fs.readFile('./db.js','utf8',(err,data)=>{
        if(err){
            res.status(500).send('Error en el servidor')
        } else {
            const productos=JSON.parse(data)
            const nuevoProducto={
                id:productos.length +1,
                marca: req.body.marca,
                modelo:req.body.modelo,
                precio:req.body.precio,
                cantidad:req.body.cantidad

            }
            productos.push(nuevoProducto)
            fs.writeFile('./db.js', JSON.stringify(productos),(err)=>{
                if(err){
                    res.status(500).send('Error en el servidor')
                }else{
                    res.status(201).send(`${nuevoProducto.id} agregado satisfactoriamente`)
                }
            })
        }
    })
})

app.put('/productos/:id',(req,res)=>{

    const{marca,modelo,precio,cantidad}=req.body
    console.log(req.body)
    fs.readFile('./db.js','utf8',(err,data)=>{
        if(err){
            res.status(500).send('Error en el servidor')
        }else{
            const productos=JSON.parse(data)
            const producto=productos.find(producto=>producto.id===parseInt(req.params.id))
            if(producto){
                producto.marca=marca
                producto.modelo=modelo
                producto.precio=precio
                producto.cantidad=cantidad
                fs.writeFile('./db.js', JSON.stringify(productos),(err)=>{
                    if(err){
                        res.status(500).send("error en el servidor")
                    }else{
                        res.status(200).send('producto actualizado')
                    }
                })
            }else{
                res.status(400).send(`no se encuentra el producto con el id: ${req.params.id}`)
            }
        }
    })
})

app.delete('/productos/:id',(req,res)=>{
    fs.readFile('./db.js','utf8',(err,data)=>{
        if(err){
            res.status(500).send('error en el servidor')
        }else{
            const productos=JSON.parse(data)
            const producto=productos.find((producto)=>producto.id===parseInt(req.params.id))
            if(producto){
                const index=productos.indexOf(producto)
                productos.splice(index,1)
                fs.writeFile('./db.js',JSON.stringify(productos),(err)=>{
                    if(err){
                        res.status(500).send('error en el servidor')

                    }else{
                        res.status(200).send(`Producto de id: ${req.params.id} eliminado correctamente`)
                    }
                })
            }else{
                res.status(404).send(`no se encuentra el producto de id: ${req.params.id}`)
            }
        }
    })

})

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
