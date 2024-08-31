/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/


import LoginController from '#controllers/auth/login_controller'
import LogoutController from '#controllers/auth/logout_controller'
import RegisterController from '#controllers/auth/register_controller'
import ChallengesController from '#controllers/challenges_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'


router.get('/', async (ctx) => {
    await ctx.auth.check()
    return ctx.view.render('pages/home')

})

router.group(() => { 

    router.get('/register', [RegisterController, 'show']).as('register.show')
    router.post('/register', [RegisterController, 'store']).as('register.store')

    router.get('/login', [LoginController, 'show']).as('login.show')
    router.post('/login', [LoginController, 'store']).as('login.store')

    router.post('/logout', [LogoutController, 'handle']).as('logout')
})
    .as('auth')

router.group(() => {
    router.get('/challenges', [ChallengesController,'index']).as('challenges.index')
    router.get('/challenges/:id', [ChallengesController, 'show']).as('challenges.show')
    
})
    .use(middleware.auth()).as('challenges')
