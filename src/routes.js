const express = require('express')
const routes = express.Router()
const productController = require('./app/controllers/productController')


routes.get('/',function(req,res){
    return res.render("layout.njk")
});

routes.get('/products/create', productController.create);
routes.post('/products', productController.post)

// Alias
routes.get('/ads/create', function(req,res){
    return res.redirect("/products/create")
});


module.exports = routes;