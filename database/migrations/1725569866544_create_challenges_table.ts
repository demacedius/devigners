import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Challenges extends BaseSchema {
  protected tableName = 'challenges'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // Primary key
      table.string('figma_id').notNullable().unique() // Pour lier au fichier Figma via son ID
      table.string('name').notNullable()
      table.string('figma_link').notNullable()
      table.text('description').nullable()
      table.integer('level').defaultTo(1) // Niveau du challenge
      table.boolean('free').defaultTo(true) // Si le challenge est gratuit ou payant
      table.string('thumbnail_url', 2048).nullable()
      table.boolean('completed').defaultTo(false) 
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}