/*
let express = require('express');
let routes = express.Router();


routes.get('/',(req, res)=>{
    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({
        users:[{
            name:"Hcode",
            email:"teste@teste.com",
            id:1
             }]
        });

});


routes.get('/admin',(req, res)=>{
    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({
        users:[{
            name:"Hcode admin",
            email:"teste@teste.com",
            id:2
             }]
        });

});

module.exports = routes;
*/
//com consign

let NeDB = require('nedb');
let db = new NeDB({
    filename:'user.db',
    autoload:true


});


module.exports = app => {

    let route = app.route('/users');

    route.get((req, res)=>{

        db.find({}).sort({name:1}).exec((err, users)=>{


            if (err) {
                app.utils.error.send(err,req,res);
            }else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({users});//quando a chave e igual a que vai ser chamada noa precisa os dois pontos
            }    

        });
    
    });
    
    
    route.post((req, res)=>{
                
       if(!app.utils.validator.user(app,req, res))return false;

        db.insert(req.body, (err, user)=>{

            if (err) {
                app.utils.error.send(err,req,res);
            }else{
                res.status(200).json(user);
            }


        });
    
    });

    let routeId = app.route('/users/:id');

    routeId.get((req, res)=>{


        db.findOne({_id:req.params.id}).exec((err, user)=>{
            if (err) {
                app.utils.error.send(err,req,res);
            }else{
                res.status(200).json(user);
            }
        });

    });

    routeId.put((req, res)=>{


        if(!app.utils.validator.user(app,req, res))return false;

        db.update({_id:req.params.id},req.body, err =>{
            if (err) {
                app.utils.error.send(err,req,res);
            }else{
                res.status(200).json(Object.assign(req.params,req.body));
            }
        });

    });


    routeId.delete((req, res)=>{


        db.remove({_id:req.params.id},{}, err =>{
            if (err) {
                app.utils.error.send(err,req,res);
            }else{
                res.status(200).json(req.params);
            }
        });

    });


};