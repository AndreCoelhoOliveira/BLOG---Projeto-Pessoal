const express = require('express');
const router = express.Router();
const Category = require('./Categorie');
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/categories/new', adminAuth,(req, res) =>{
    res.render('admin/categories/new');
});

router.post('/categories/save', adminAuth,(req, res) =>{
    let title = req.body.title;
    if(title != undefined){

        Category.create({
            title:title,
            slug: slugify(title)
        }).then(() => {
            res.redirect('/admin/categories');
        })
    }else{
        res.redirect('/admin/categories/new')
    }
})

router.get('/admin/categories', adminAuth,(req, res) =>{
    Category.findAll().then(category =>{
        res.render('admin/categories/index', {
            categories:category
        });
    })
})

router.post('/categories/delete', adminAuth,(req, res) =>{
    let id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Category.destroy({
                where:{id:id}
            }).then(()=>{
                res.redirect('/admin/categories')
            })
        }else{//Se não for numero
            res.redirect('/admin/categories')
        }
    }else{ // Se for Nullo
        res.redirect('/admin/categories')
    }
})

router.get('/admin/categories/edit/:id', adminAuth,(req, res) =>{
    let id = req.params.id;

    if(isNaN(id)){
        res.redirect('/admin/categories')    
    }

    Category.findByPk(id).then(categories=>{
        if(categories != undefined){

            res.render('admin/categories/edit',{
                categories:categories
            });

        }else{
            res.redirect('/admin/categories') 
        }
    }).catch(error=>{
        console.log("Erro:" + error)
    })
});

router.post('/categories/edit', adminAuth,(req, res) =>{
    id = req.body.id;
    title = req.body.title; 
    if(id != undefined){
        if(!isNaN(id)){
            Category.update({
                title:title,
                slug:slugify(title)
            },{
            where:{id:id}
        }).then(()=>{
            res.redirect('/admin/categories')
        })
        }
    }else{
        res.redirect('/admin/categories')
    }
})


module.exports = router;