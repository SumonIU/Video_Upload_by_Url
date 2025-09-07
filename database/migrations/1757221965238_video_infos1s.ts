import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'video_infos1s'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      // table.increments('id')

      table.string('video_id', 255).notNullable().unique() // Unique videoId
      table.string('title', 255).notNullable() // Video title
      table.string('status',255).notNullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

