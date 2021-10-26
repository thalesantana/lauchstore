const { formatPrice, date } = require('../../lib/utils')
const Category = require('../Models/categoryModel')
const Product = require('../Models/productModel')
const File = require('../Models/fileModel')



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
    async show(req, res){
        let results = await Product.find(req.params.id)
        const product = results.rows[0]

        if(!product) return res.send("Product Not Found")

        const{day, hour, minutes, month} = date(product.updated_at)

        product.published ={
            day:  `${day}/${month}`,
            hour:  `${hour}h${minutes}`,
        }
        
        product.old_price = formatPrice(product.old_price)
        product.price = formatPrice(product.price)

        results = await Product.files(product.id)
        const files = results.rows.map(file =>({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
        }))
        
        return res.render("products/show",{ product, files })
    },
    async post(req,res){
        //Logica de salvar

        const keys= Object.keys(req.body) // retorna chave de todos vetores
        //console.log(req.body)
        for(key of keys){
            if(req.body[key] == ""){ // Verifica se tem campos vazios
                return res.send("Please, fill all fields!")
            }
        }
        const { userId: id } = req.session
        
        let results = await Product.create(req.body,id)
        const productId = results.rows[0].id

        const filesPromise = req.files.map(file => File.create({...file, product_id: productId}))
        await Promise.all(filesPromise)

        return res.redirect(`/products/${productId}/edit`)
    },
    async edit(req, res){
        let results = await Product.find(req.params.id)
        const product = results.rows[0]
    
        if (!product) return res.send("Product not found!")

        product.old_price = formatPrice(product.old_price)
        product.price = formatPrice(product.price)
        
        // get categories
        results = await Category.all()
        const categories = results.rows

        // get images
        results = await Product.files(product.id)
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src:`${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("products/edit",{ product, categories, files })
    },
    async put(req, res){
        const keys= Object.keys(req.body) // retorna chave de todos vetores

        for(key of keys){
            if(req.body[key] == "" && key != "removed_files"){ // Verifica se tem campos vazios
                return res.send("Please, fill all fields!")
            }
        }
        
        if (req.files.length != 0) {
            const newFilesPromise = req.files.map(file =>
                File.create({...file, product_id:req.body.id}))

            await Promise.all(newFilesPromise)
        }

        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",")
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex,1)

            const removedFilesPromise = removedFiles.map(id => File.delete(id))

            await Promise.all(removedFilesPromise)


        }

            req.body.price = req.body.price.replace(/\D/g, "")
    
            if (req.body.old_price != req.body.price) {
              const oldProduct = await Product.find(req.body.id)
              req.body.old_price = oldProduct.rows[0].price
            }
        
            await Product.update(req.body)
        
            return res.redirect(`/products/${req.body.id}`)
        
    },
    async delete(req, res){
        await Product.delete(req.body.id)

        return res.redirect('products/create')
    }
    
}

