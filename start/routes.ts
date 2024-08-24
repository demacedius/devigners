/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import RegistersController from '#controllers/auth/registers_controller'
import LoginController from '#controllers/auth/login_controller'



router.on('/').render('pages/home').as('home')
router.on('/signIn').render('pages/sign_in.edge').as('signIn')
router.on('/logIn').render('pages/log_in.edge').as('logIn')


router.group(() => {
    router.get('/register', [RegistersController, 'show']).as('register.show')
    router.post('/register', [RegistersController, 'store']).as('register.store')
    router.get('/login', [LoginController, 'show']).as('login.show')
    router.post('/login', [LoginController, 'store']).as('login.store')
}).prefix('/auth').as('auth')