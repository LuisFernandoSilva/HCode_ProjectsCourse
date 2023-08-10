const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
/*
let routesIndex = require('./routes/index');
let routesUsers = require('./routes/users');
*/

let app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(expressValidator());

/*
app.use(routesIndex);
app.use('/users',routesUsers);
*/
consign().include('routes').include('utils').into(app);

app.listen(3000, '127.0.0.1', ()=>{
    console.log('servidor rodando');
});






/*

const http = require('http');

let server =  http.createServer((req, res)=>{

    console.log('URL', req.url);
    console.log('METHOD', req.method);

    switch (req.url) {
        case '/':
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end('<h1>Hello World</h1>');
            break;
        case '/users':
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                users:[{
                    name:"Hcode",
                    email:"teste@teste.com",
                    id:1
                }]
            }));
            break;
             break;
        default:
            break;
    }
    

});

server.listen(3000, '127.0.0.1', ()=>{
    console.log('servidor rodando');
});*/