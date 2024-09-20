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
import SolutionsController from '#controllers/solutions_controller'
import PricingController from '#controllers/pricings_controller'


router.get('/', async (ctx) => {
    await ctx.auth.check()
    return ctx.view.render('pages/home')

}).as('home')


router.group(() => { 
    
    router.get('/register', [RegisterController, 'show']).as('register.show')
    router.post('/register', [RegisterController, 'store']).as('register.store')
    
    router.get('/pricing', [PricingController, 'index']).as('pricing.index')
    
    router.get('/login', [LoginController, 'show']).as('login.show')
    router.post('/login', [LoginController, 'store']).as('login.store')
    router.post('/logout', [LogoutController, 'handle']).as('logout')

})
    .as('auth')

router.group(() => {
    router.get('/challenges', [ChallengesController,'index']).as('challenges.index')
    router.get('/challenges/:id', [ChallengesController, 'show']).as('challenges.show')
    router.post('/challenges/:id/complete', [ChallengesController,'complete']).as('challenges.complete');
    router.post('/solutions', [SolutionsController, 'store']).as('solutions.store').as('solutions.store');
    router.get('/solutions/:id', [SolutionsController, 'show']).as('SolutionsController.show').as('solutions.show');
    router.get('/solutions', [SolutionsController, 'index']).as('SolutionsController.index').as('solutions.index');
    
})
    .use(middleware.auth()).as('challenges')
