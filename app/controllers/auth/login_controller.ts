import User from '#models/user'
import { loginValidator } from '#validators/register'
import type { HttpContext } from '@adonisjs/core/http'

export default class LoginController {
  
  async show({ view }: HttpContext) {
    return view.render('auth/login')
  }
  
  async store({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(data.email, data.password)
    await auth.use('web').login(user)

    return response.redirect().toPath('/')
  }
  
}