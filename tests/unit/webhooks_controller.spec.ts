import { test } from '@japa/runner'
import User from '#models/user'
import WebhooksController from '#controllers/webhooks_controller'


test.group('WebhooksController', () => {
  test('handle - met à jour le plan de l\'utilisateur', async ({ assert }) => {
    // Créer un utilisateur de test
    const user = await User.create({
      email: 'test3@example.com',
      password: 'password123',
      plan: 'free'
    })


    let responseStatus: number | undefined
    let responseMessage: string | undefined
    
    // Simuler le contexte HTTP
    const ctx = {
      request: {
        body: () => ({
          meta: { test_mode: false },
          data: {
            attributes: {
              user_email: 'test3@example.com',
              first_order_item: { product_name: 'premium' }
            }
          }
        })
      },
      response: {
        status: (code: number) => {
            responseStatus = code
            return {
                send: (message: string) => {
                    responseMessage = message
                }
            }
        }
      }
    }

    await new WebhooksController().handle(ctx as any)

    // Recharger l'utilisateur depuis la base de données
    await user.refresh()

    // Vérifications
    assert.equal(user.plan, 'premium')
    assert.equal(responseStatus, 200)
    assert.equal(responseMessage, 'Webhook traité avec succès')
  })

  test('handle - gère le mode test', async ({ assert }) => {
    let responseStatus: number | undefined
    let responseMessage: string | undefined

    const ctx = {
      request: {
        body: () => ({
          meta: { test_mode: true },
          data: {
            attributes: {
              user_email: 'test3@example.com',
              first_order_item: { product_name: 'premium' }
            }
          }
        })
      },
      response: {
        status: (code: number) => {
          responseStatus = code
          return {
            send: (message: string) => {
              responseMessage = message
            }
          }
        }
      }
    }

    await new WebhooksController().handle(ctx as any)

 

    assert.equal(responseStatus, 200)
    assert.equal(responseMessage, 'Webhook traité avec succès')
  })

  test('handle - gère les erreurs', async ({ assert }) => {
    let responseStatus: number | undefined
    let responseMessage: string | undefined

    const ctx = {
      request: {
        body: () => ({
          meta: { test_mode: false },
          data: {
            attributes: {
              user_email: 'nonexistent@example.com',
              first_order_item: { product_name: 'premium' }
            }
          }
        })
      },
      response: {
        status: (code: number) => {
          responseStatus = code
          return {
            send: (message: string) => {
              responseMessage = message
            }
          }
        }
      }
    }

    await new WebhooksController().handle(ctx as any)
    assert.equal(responseStatus, 400)
    assert.equal(responseMessage, 'Erreur lors du traitement du webhook')
  })
})