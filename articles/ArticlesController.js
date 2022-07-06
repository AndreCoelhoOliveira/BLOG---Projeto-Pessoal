const express = require('express');
const Article = require('./Article');
const Category = require('../categories/Categorie');
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth');
const router = express.Router();

router.get('/admin/articles', adminAuth,(req, res) =>{
    Article.findAll({
        include:[{model:Category}]
    }).then(articles =>{
        res.render('admin/articles/index', {articles: articles})
    })
});

router.get('/admin/articles/new', adminAuth, (req, res) =>{
   
    Category.findAll().then(categories=>{
        res.render('admin/articles/new', {categories: categories});
    })
});

router.post('/articles/save', adminAuth, (req, res) =>{
    let title = req.body.title;
    let content = req.body.content;
    let category = req.body.categorie;
    Article.create({
        title: title,
        slug: slugify(title),
        body: content,
        categoryId:category

    }).then(() => res.redirect('/admin/articles'))
})

router.post('/article/delete', adminAuth, (req, res) =>{
    let id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Article.destroy({
                where:{id:id}
            }).then(()=>{
                res.redirect('/admin/articles')
            })
        }else{//Se não for numero
            res.redirect('/admin/articles')
        }
    }else{ // Se for Nullo
        res.redirect('/admin/articles')
    }
})

router.get('/admin/article/edit/:id', adminAuth, (req, res) =>{
    let id = req.params.id;

    if(isNaN(id)){
        res.redirect('/admin/articles')    
    }

    Article.findByPk(id, {include:[{model:Category}]}).then(articles=>{
        if(articles != undefined){
            Category.findAll().then( categories =>{
                res.render('admin/articles/edit',{
                    articles:articles,
                    categories:categories
                });
        })

        }else{
            res.redirect('/admin/categories') 
        }
    }).catch(error=>{
        console.log("Erro:" + error)
    })
});

router.post('/articles/edit', adminAuth,(req, res) =>{
    id = req.body.id;
    title = req.body.title; 
    body = req.body.content;
    categories = req.body.categorie;
    if(id != undefined){
        if(!isNaN(id)){
            Article.update({
                title:title,
                body:body,
                categoryId:categories,
                slug:slugify(title)
            },{
            where:{id:id}
        }).then(()=>{
            res.redirect('/admin/articles')
        })
        }
    }else{
        res.redirect('/admin/articles')
    }
})

router.get("/articles/page/:num", (req, res) =>{
    let num = req.params.num;;
    let offset = 0;

    if(isNaN(num) || num == 1){
        offset = 0;

    }else{
        offset = parseInt(num -1)*4;
    }

    Article.findAndCountAll({
        order:[
            ['id', 'DESC']
        ],
        limit:4,
        offset: offset
    }).then( articles =>{
        let next;
        let paginas = articles.count / 4;

        if(articles.count %= 0){
            paginas = paginas
        }else{
            paginas = paginas + 1 
        }
        paginas = parseInt(paginas);
        if (offset + 4 >= articles.count){
            next= false;
        }else{
            next = true;
        }
        num = parseInt(num);
        let result={
            next: next,
            articles: articles
        }
       Category.findAll().then( category =>{
            res.render('admin/articles/page', {categories: category, result: result, paginas:paginas, num:num});
       })
    });
})

module.exports = router;