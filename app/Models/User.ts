import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Profile from './Profile'
import Post from './Post';
export default class User extends BaseModel {
  public static table='users';
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public password: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // One-to-One relation
  @hasOne(() => Profile)
  public profile: HasOne<typeof Profile>

  //one-to-many 
  @hasMany(()=>Post)
  public posts:HasMany<typeof Post>
}
