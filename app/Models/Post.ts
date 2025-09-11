import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Post extends BaseModel {

  public static table='posts';

  @column({ isPrimary: true })
  public id: number

  @column()
  public title:string

  @column()
  public content:string

  @column({columnName:'user_id'})
  public userId:number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  //Belongs to User
  @belongsTo(()=>User)
  public user:BelongsTo<typeof User>
}
