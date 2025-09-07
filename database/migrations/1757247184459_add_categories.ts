import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'video_infos1s'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('category',255).notNullable()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
    })
  }
}
