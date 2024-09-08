import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Solution extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare challenge_id: number

  @column()
  declare description: string

  @column()
  declare image_url: string

  @column()
  declare repository_url: string

  @column()
  declare figma_url: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  
}