import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'drop_video_tables'

  public async up () {
    this.schema.dropTableIfExists('video_infos')
     this.schema.dropTableIfExists('video_infos1s')
  }

  public async down () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
    })
    this.schema.createTable(this.tableName,(table)=>{
      table.increments('id');
    })
  }
}
