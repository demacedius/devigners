import env from '#start/env'

export default {
  apiKey: env.get('LEMONSQUEEZY_API_KEY'),
  storeId: env.get('LEMONSQUEEZY_STORE_ID'),
}