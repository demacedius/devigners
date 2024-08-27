import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/register'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
 register({ view }: HttpContext) {
    return view.render('auth/register')
 }

  async handleRegister({ request, session, response }: HttpContext) {
    const { email, password } = await request.validateUsing(registerValidator)

    await User.create({ email, password })
    session.flash("success", "inscription Ok!!!")
    return response.redirect().toRoute("auth.login")
  }

  login({ view }: HttpContext) {
    return view.render('auth/login')
  }

  async handleLogin({ request, auth, session, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    await auth.use("web").login(user)
    session.flash("success", "Connexion Ok!!!")
    return response.redirect().toRoute("home")
  }
}