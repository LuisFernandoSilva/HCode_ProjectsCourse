module.exports  = {

    user:(app,req, res)=>{
        req.assert('name', 'o nome e obrigatorio').notEmpty();
        req.assert('email', 'O e-mail está inválido.').notEmpty().isEmail();

        let error = req.validationErrors();

        if (error) {
            app.utils.error.send(error,req,res);
            return false;
        } else{
            return true;
        }
    }

};