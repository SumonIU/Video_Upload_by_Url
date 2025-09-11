import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'profiles'
  public async up () {
    this.schema.dropTableIfExists(this.tableName)
    this.schema.alterTable(this.tableName, (table) => {

    })
  }

  public async down () {
    this.schema.createTableIfNotExists(this.tableName,(table)=>{})
    this.schema.alterTable(this.tableName, (table) => {
    })
  }
}
