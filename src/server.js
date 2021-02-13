const express = require('express')
const nunjucks = require('nunjucks')
const routes = require("./routes/routes")

const methodOverride = require('method-override')

const server = express()

server.use(express.urlencoded({extended: true}))
server.use(express.static('public'))
server.use(methodOverride('_method'))
server.use(routes)

server.set("view engine","njk")

nunjucks.configure("src/app/views",{
    express: server,
    autoescape: false,
    nocache:true
}) 
server.listen(5000, function(){
    console.log("O PAI TA ON")
})



