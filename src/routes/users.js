const express = require('express')
const routes = express.Router()

const SessionController = require('../app/controllers/SessionController')
const UserController = require('../app/controllers/UserController')

const UserValidator =  require('../app/Validators/user')
const SessionValidator = require('../app/Validators/session') 

const {isLoggedRedirectToUsers, onlyUsers} = require('../app/middlewares/session') 
/*
//reset password / forgot
routes.get('/forgot-password',SessionController.forgotForm)
routes.get('/password-reset',SessionController.resetForm)
routes.post('/forgot-password',SessionController.forgot)
routes.post('/password-reset',SessionController.reset)
routes.delete('/', UserController.delete)*/

//login/logout
routes.post('/login',SessionValidator.login,SessionController.login)
routes.get('/login',isLoggedRedirectToUsers,SessionController.loginForm)
routes.post('/logout', SessionController.logout)

// user register UserController

routes.get('/register', UserController.registerForm)
routes.post('/register',UserValidator.post, UserController.post)

routes.get('/',onlyUsers, UserValidator.show, UserController.show)
routes.put('/', UserValidator.update, UserController.update)



module.exports = routes;