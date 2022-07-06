const Sequelize = require('sequelize');
const connection = require('../databases/database');
const Category = require('../categories/Categorie');

const Article = connection.define('article', {
    title:{
        type:Sequelize.STRING,
        allowNull: false
    },slug:{
        type:Sequelize.STRING,
        allowNull: false
    },body:{
        type:Sequelize.TEXT,
        allowNull: false
    }
})

Category.hasMany(Article); // Uma categoria tem muitos artigos
Article.belongsTo(Category); // Um artigo pertece a uma categoria

//Article.sync({force:true});

module.exports = Article;