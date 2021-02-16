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

        return res.render("products/create",{productId, categories})
    }
}