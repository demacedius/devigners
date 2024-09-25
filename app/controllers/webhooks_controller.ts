import type { HttpContext } from '@adonisjs/core/http'


import User from '#models/user'
import logger from '@adonisjs/core/services/logger'

export default class WebhooksController {
  public async handle({ request, response }: HttpContext) {
    try {
      const payload = request.body()
      
      // Vérifier si c'est un mode test
      const isTestMode = payload.meta.test_mode
      
      // Extraire les informations importantes
      const userEmail = payload.data.attributes.user_email
      const productName = payload.data.attributes.first_order_item.product_name
      
      // Trouver l'utilisateur dans la base de données
      const user = await User.findByOrFail('email', userEmail)
      
      // Mettre à jour le plan de l'utilisateur
      user.plan = productName
      await user.save()
      
      logger.info(`Plan mis à jour pour l'utilisateur ${userEmail}: ${productName}`)
      
      // Si c'est un mode test, vous pouvez le logger ou le traiter différemment
      if (isTestMode) {
        logger.info('Ceci est une commande de test')
      }
      
      return response.status(200).send('Webhook traité avec succès')
    } catch (error) {
      logger.error('Erreur lors du traitement du webhook:', error)
      return response.status(400).send('Erreur lors du traitement du webhook')
    }
  }
}