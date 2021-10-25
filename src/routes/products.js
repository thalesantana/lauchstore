const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')
const{ onlyUsers } = require('../app/middlewares/session')

const productController = require('../app/controllers/productController')
const SearchController = require('../app/controllers/SearchController')

// Search
routes.get('/search', SearchController.index)
//products
routes.get('/create',onlyUsers, productController.create);
routes.get('/:id', productController.show)
routes.get('/:id/edit',onlyUsers, productController.edit)

routes.post('/',onlyUsers,multer.array("photos", 6), productController.post)
routes.put('/',onlyUsers,multer.array("photos", 6), productController.put)
routes.delete('/',onlyUsers,productController.delete)

module.exports = routes;