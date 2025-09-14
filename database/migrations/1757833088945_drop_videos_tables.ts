import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'drop_videos_tables'

  public async up () {
    this.schema.dropTableIfExists('videos')
  }

  public async down () {
    this.schema.createTable(this.tableName,(table)=>{
      table.increments('id');
    })
  }
}
