const { formatPrice } = require('../../lib/utils')

const Category = require('../Models/categoryModel')
const Product = require('../Models/productModel')


module.exports = {
    create(req,res){
        //pegar Categorias
        Category.all().then(function(results){
            const categories = results.rows

            return res.render("products/create",{categories})

        }).catch(function(err){
            throw new Error(err)
        })

    },
    async post(req,res){
        //Logica de salvar

        const keys= Object.keys(req.body) // retorna chave de todos vetores

        for(key of keys){
            if(req.body[key] == ""){ // Verifica se tem campos vazios
                return res.send("Please, fill all fields!")
            }
        }

        let results = await Product.create(req.body)
        const productId = results.rows[0].id

        results = await Category.all()
        const categories = results.rows

        return res.redirect(`/products/${productId}/edit`)
    },
    async edit(req, res){
        let results = await Product.find(req.params.id)
        const product = results.rows[0]
    
        if (!product) return res.send("Product not found!")

        product.old_price = formatPrice(product.old_price)
        product.price = formatPrice(product.price)
        
        results = await Category.all()
        const categories = results.rows
        console.log(product)
        console.log(categories)
        return res.render("products/edit",{ product, categories })
    },
    async put(req, res){
        const keys= Object.keys(req.body) // retorna chave de todos vetores

        for(key of keys){
            if(req.body[key] == ""){ // Verifica se tem campos vazios
                return res.send("Please, fill all fields!")
            }
        }
        
        req.body.price = req.body.price.replace(/\D/g,"")
        
        if(req.body.old_price != req.body.price){
            const oldProduct = await Product.find(req.body.id)
            req.body.old_price = oldProduct.rows[0].price
        }
            
            
            await Product.update(req.body)
            
            return res.redirect(`/products/${req.body.id}/edit`)
        
    }

    
}

