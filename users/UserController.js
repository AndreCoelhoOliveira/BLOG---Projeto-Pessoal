const express = require('express');
const Users = require('./User');
const router = express.Router();
const bcrypt = require('bcryptjs');
const adminAuth = require('../middlewares/adminAuth');
const User = require('./User');

router.get("/admin/users/create", adminAuth,(req, res)=>{
    res.render("admin/users/users");
});
router.post("/admin/create", adminAuth,(req, res)=>{
    let {email, password} = req.body;
    
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt); 

    Users.findOne({where:{email: email}}).then( user =>{
        if(user == undefined){
            User.create({
                email: email,
                password: hash
            }).then(
                res.redirect("/admin/users")
            ).catch((err)=>{
                res.redirect("/admin/users/create")
            })
        }else{
            res.redirect("/admin/users/create")
        }
    })
});
router.get("/admin/users", adminAuth,(req, res)=>{
    User.findAll().then(user =>{
        res.render("admin/users/listUsers", {user:user});
    });
});

router.get("/login", (req, res)=>{
    res.render("admin/users/login");
});

router.post("/authenticate", (req, res)=>{
    let {email, password} = req.body;
    
    User.findOne({where:{email:email}}).then( user =>{
        if(user == undefined){ //Ver se existe um usuario com esse email
            res.redirect("/login")
        }else{
            //Validar Senha
            let correct = bcrypt.compareSync(password, user.password);

            if(correct){
                req.session.user = {
                    id: user.id,
                    emial: user.email
                }
                res.redirect("/admin/articles")
            }else{
                res.redirect("/login")
            }
        }
    });

});

router.get("/logout", (req, res)=>{
    req.session.user = undefined;
    res.redirect("/");
})

module.exports = router;