const http = require('http'); 
const fs = require('fs');
const path = require('path');
const {MongoClient} = require('mongodb');

http.createServer(async (req, res) =>{
    console.log(req.url);
    if(req.url ==='/') { // serve HTML
       fs.readFile(path.join(__dirname,'public','index.html'),(err,content)=>{
            if (err) throw err ;
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(content)
       })
    } else if(req.url ==='/style.css') { // serve CSS
        fs.readFile(path.join(__dirname,'public','style.css'),(err,content)=>{
             if (err) throw err ;
             res.writeHead(200, {'Content-Type': 'text/css'});
             res.end(content)
        })
     } else if(req.url ==='/script.js') { // serve JS
        fs.readFile(path.join(__dirname,'public','script.js'),(err,content)=>{
             if (err) throw err ;
             res.writeHead(200, {'Content-Type': 'text/javascript'});
             res.end(content)
        })
     } else if(req.url ==='/api') { // server Data
        try {
            const uri = "mongodb+srv://vk:vicky@cluster0.qkoht5q.mongodb.net/?retryWrites=true&w=majority";
            const client = new MongoClient(uri);
            try {
                await client.connect();
                const cursor = client.db("billionaires_db").collection("billionaires_index").find({});
                const results = await cursor.toArray();
                res.setHeader("Access-Control-Allow-Origin", "*")
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(results));
            } finally {
                await client.close();
            }
        } catch(err) {
            throw err;
        }
    } else {
        res.end("<h1>404 Nothing is here</h1>")
    }
}).listen(9960,()=>console.log("Server is running"));