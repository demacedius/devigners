import User from '#models/user'
import { registerValidator } from '#validators/register'
import type { HttpContext } from '@adonisjs/core/http'

export default class RegisterController {
  
  async show({ view }: HttpContext) {
    return view.render('auth/register')
  }
  
  async store({ request, auth, response }: HttpContext) {
    
    const data = await request.validateUsing(registerValidator)

    const user = await User.create(data)

    await auth.use('web').login(user)

    return response.redirect().toPath('/')
  }
}