const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const productController = require('../app/controllers/productController')
const SearchController = require('../app/controllers/SearchController')

// Search
routes.get('/search', SearchController.index)
//products
routes.get('/create', productController.create);
routes.get('/:id', productController.show)
routes.get('/:id/edit', productController.edit)

routes.post('/',multer.array("photos", 6), productController.post)
routes.put('/',multer.array("photos", 6), productController.put)
routes.delete('/', productController.delete)

module.exports = routes;