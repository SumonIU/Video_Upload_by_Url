import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User';

export default class Role extends BaseModel {
  public static table='roles';

  @column({ isPrimary: true })
  public id: number

  @column ()
  public name:string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(()=>User,{
    pivotTable:'role_users',
  })
  public users: ManyToMany<typeof User>
}
