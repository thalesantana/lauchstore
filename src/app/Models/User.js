const db = require('../../config/db')
const { hash } = require('bcryptjs')
const fs =  require('fs')
const Product = require('../Models/productModel')

module.exports = {
    async findOne(filters){
        try{
            let query = 'SELECT * FROM users'

            Object.keys(filters).map(key =>{
                // WHERE | OR | AND
                query = `${query}
                ${key}
                `
                Object.keys(filters[key]).map(field => {
                    query = `${query} ${field} = '${filters[key] [field]}'`
                })
            })

            const results = await db.query(query)

            return results.rows[0]
        }
        catch (err) {
            console.log(err)
        }
    },
    async create(data) {
        try {
            const query = `
                INSERT INTO users (
                    name,
                    email,
                    password,
                    cpf_cnpj,
                    cep,
                    address
                )VALUES($1, $2, $3, $4, $5, $6)
                RETURNING id
            `
            //hasg of password
            const passwordHash = await hash(data.password, 8)
            
            const values = [
                data.name,
                data.email,
                passwordHash,
                data.cpf_cnpj.replace(/\D/g, ""),
                data.cep.replace(/\D/g, ""),
                data.address
            ]           

            const results = await db.query(query, values)
            return results.rows[0].id
        }
        catch (err) {
            console.log(err)
        }
    },
    async update(id, fields) {
        let query = "UPDATE users SET"

        Object.keys(fields).map((key, index, array) => {
            if((index + 1) < array.length){
                query= `${query}
                    ${key} = '${fields[key]}',
                    `
            }else {
                //last interation
                query = `${query}
                    ${key} = '${fields[key]}'
                    WHERE id = ${id}
                `
            }
        })
        await db.query(query)
        return 
    },
    async delete(id){
        let results = await db.query(`SELECT * FROM products WHERE user_id = ${id}`)
        const products = results.rows

        const allFilesPromise = products.map(product =>
            Product.files(product.id)    
        )

        let promiseResults = await Promise.all(allFilesPromise)
        
        await db.query('DELETE FROM users WHERE id = $1', [id])    

        promiseResults.map(results => {
            results.rows.map(file =>{ 
                try{
                    fs.unlinkSync(file.path)
                }catch(err){
                    console.error(err)
                }
            })
        })

        
    }
}