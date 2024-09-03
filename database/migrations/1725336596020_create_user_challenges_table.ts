import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_challenges'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.string('challenge_id').notNullable()
      table.timestamp('completed_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}