
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Challenge extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare figma_id: string

  @column()
  declare figma_link: string

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare thumbnail_url: string

  @column()
  declare completed: boolean

  @column()
  declare free: boolean

  @column()
  declare level: number


}