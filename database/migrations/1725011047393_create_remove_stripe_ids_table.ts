
import { BaseSchema } from '@adonisjs/lucid/schema'


export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable((this.tableName), (table) => {
       table.dropColumn('stripeId')
     })
  }

  public async down () {

    this.schema.table(this.tableName, (table) => {
      table.string('stripeId').notNullable().defaultTo('free')
    })
  }

}