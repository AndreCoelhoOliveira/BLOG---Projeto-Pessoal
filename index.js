const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./databases/database');
const session = require('express-session');
//Controllers
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const usersController = require('./users/UserController');
//Models
const Article = require('./articles/Article');
const Category = require('./categories/Categorie');
const User = require('./users/User');
//Inicialize
const { redirect } = require('express/lib/response');
const { response } = require('express');
const app = express();

//View engine
app.set('view engine', 'ejs');

//Redis

//Sessions
app.use(session({
    secret: "jbhsfjklsdfsdfkndsjfjksdbfksbfdsbfhsd",
    cookie:{maxAge: 30000} 
}));

//Dados Staticos
app.use(express.static('public'));

//Body parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//databases
connection.authenticate().then(()=>{
    console.log("Conexão com sucesso!");
}).catch((err)=>{
    console.log("Error: " + err)
})

//Cria uma rota Usando os Controllers
app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', usersController);


app.get('/', (req, res)=>{
    let session = req.session.user;
    Article.findAll({
        order:[
            ['id', 'DESC']
        ],
        limit:4
    }).then(article=>{
        Category.findAll().then(categories =>{
            res.render('index', {article:article, categories:categories, session:session});
        })
        
    })
    
});

app.get('/:slug', function(req, res){
    let slug = req.params.slug
    let session = req.session.user;
        Article.findOne({
            where:{
                slug:slug
            }
        }).then(article=>{
            if (article != undefined){
                Category.findAll().then(categories =>{
                    res.render('articles', {article:article, categories:categories, session});
                })
            }else{
                res.redirect("/")
            }
        }).catch(error=>{
            console.log("Error: " + error)
            res.redirect("/")
        })

})

app.get("/category/:slug",(req, res) =>{
    let slug = req.params.slug;
    let session = req.session.user;
    Category.findOne({
        where:{
            slug:slug
        },
        include:[{model:Article}]
    }).then( category =>{
        if(category != undefined){
            Category.findAll().then(categories =>{
                res.render('index', {
                    article: category.articles, 
                    categories:categories,
                    session:session
                });
            })
        } else{
            res.redirect("/");
        }
    }).catch(err=>{
        res.redirect("/");
        console.log("ERROR:" + err);
    })
})

//Inicia o app na porta 80
app.listen(80, ()=>{
    console.log("O servidor esta rodando !");
})