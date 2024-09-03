
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class User_challenge extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare challenge_id: string

  @column()
  declare completed_at: Date

 
}