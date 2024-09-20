import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'



export default class Solution extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

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

  @belongsTo(() => User, {
    foreignKey: 'userId',})
  declare user: BelongsTo<typeof User>

  
  
}