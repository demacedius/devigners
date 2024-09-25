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
import WebhooksController from '#controllers/webhooks_controller'
import SkipCsrf from '#middleware/skip_csrf'
import logger from '@adonisjs/core/services/logger'
import { HttpContext } from '@adonisjs/core/http'

router.get('/', async (ctx) => {
    await ctx.auth.check()
    return ctx.view.render('pages/home')

}).as('home')


router.group(() => { 
    
    router.get('/register', [RegisterController, 'show']).as('register.show')
    router.post('/register', [RegisterController, 'store']).as('register.store')
    
    
    router.get('/login', [LoginController, 'show']).as('login.show')
    router.post('/login', [LoginController, 'store']).as('login.store')
    router.post('/logout', [LogoutController, 'handle']).as('logout')
    
})
.as('auth')

router.post('/api/order', async (ctx: HttpContext) => {
    logger.info('Route /api/order appelée')
    logger.info('Headers de la requête:', JSON.stringify(ctx.request.headers()))
    logger.info('Corps de la requête:', JSON.stringify(ctx.request.body()))
    
    logger.info('Avant l\'appel au contrôleur')
    const result = await new WebhooksController().handle(ctx)
    logger.info('Après l\'appel au contrôleur')
    return result
}).middleware(() => {
    return new SkipCsrf()
}).as('order')

router.group(() => {
    router.get('/pricing', [PricingController, 'index']).as('pricing.index')
    router.get('/challenges', [ChallengesController,'index']).as('challenges.index')
    router.get('/challenges/:id', [ChallengesController, 'show']).as('challenges.show')
    router.post('/challenges/:id/complete', [ChallengesController,'complete']).as('challenges.complete');
    router.post('/solutions', [SolutionsController, 'store']).as('solutions.store').as('solutions.store');
    router.get('/solutions/:id', [SolutionsController, 'show']).as('SolutionsController.show').as('solutions.show');
    router.get('/solutions', [SolutionsController, 'index']).as('SolutionsController.index').as('solutions.index');
    
})
    .use(middleware.auth()).as('challenges')
