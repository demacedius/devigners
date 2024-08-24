import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'


export default class UsersController {

  async index({ view }: { view: any }) {
    const users = await User.all()
    return view.render('users.index', { users })
  }

  async create({view }: HttpContext) {
    return view.render('users.create')
  }

  async store({ request, response }: HttpContext) {
    const userData = request.only(['email', 'password'])
    const user = await User.create(userData)
    return response.status(201).json(user)
  }

  /**
   * Show individual record
   */
  async show({ params, view }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return view.render('users.show', { user })
  }

  /**
   * Edit individual record
   */
  async edit({ params, view }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return view.render('users.edit', { user })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    user.merge(request.only(['email', 'password']))
    await user.save()
    return response.status(200).json(user)
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()
    return response.status(204).json(null)
  }
}