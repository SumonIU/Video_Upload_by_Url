import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class VideoInfo extends BaseModel {
  public static table = 'video_infos1s'
  // @column({ isPrimary: true })
  // public id: number
   @column({isPrimary: true})
  public video_id: string   // maps to video_id in DB

  @column()
  public title: string

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
