import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Profile extends BaseModel {
  
  public static table='profiles';

  @column({ isPrimary: true })
  public id: number

  @column({columnName:'user_id'})
  public userId:number

  @column({columnName:'full_name'})
  public fullName:string

  @column({columnName:'avatar_url'})
  public avatarUrl:string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
  
  @belongsTo(()=>User)
  public user:BelongsTo<typeof User>
}
