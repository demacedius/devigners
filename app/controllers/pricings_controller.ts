import type { HttpContext } from '@adonisjs/core/http'
import axios from 'axios'
import lemonsqueezyConfig from '#config/lemonsqueezy'

export default class PricingController {
  public async index({ auth,view }: HttpContext) {
    try {
      // 1. Récupérer les produits du magasin
      const productsResponse = await axios.get('https://api.lemonsqueezy.com/v1/products', {
        headers: {
          'Authorization': `Bearer ${lemonsqueezyConfig.apiKey}`,
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json'
        },
        params: {
          'filter[store_id]': lemonsqueezyConfig.storeId
        }
      })

      const products = productsResponse.data.data

      const currentPlan = auth.user?.plan || 'Vous avez le plan Gratuit'
     

     
      return view.render('pages/pricing.edge', { products, user: auth.user, currentPlan })
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error)
      if (axios.isAxiosError(error)) {
        console.error('Message d\'erreur:', error.message)
        console.error('Statut:', error.response?.status)
        console.error('Données:', error.response?.data)
      }
      return view.render('pages/pricing', { products: [],user: auth.user,currentPlan: 'Erreur de chargement', error: 'Une erreur est survenue lors de la récupération des données' })
    }
  }
}