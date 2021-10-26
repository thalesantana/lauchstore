const { formatPrice } = require('../../lib/utils')

const Product = require('../Models/productModel')


module.exports = {
    async index(req,res){
        try {
            let results = await Product.all()
            const products = results.rows

            if(!products) return results.send("Products not Found!")

            async function getImage(productId){
                let results = await Product.files(productId)
                const files = results.rows.map(file =>(`${req.protocol}://${req.headers.host}${file.path.replace("public","")}`))
                let file = files[0]
                try {
                    file = files[0].replace(/\\/g, '/')
                } catch {}
                return file
            }

            const productsPromisse = products.map(async product =>{
                product.img = await getImage(product.id)
                product.oldPrice = formatPrice(product.old_price)
                product.price = formatPrice(product.price)
                return product
            }).filter((product, index) => index > 2 ? false:true)

            const lastAdded = await Promise.all(productsPromisse)

            return res.render("home/index", {products: lastAdded})
        } catch (error) {
            throw error
        }
        
    }
}