import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class VideoInfo extends BaseModel {
  public static table = 'videos'
  // @column({ isPrimary: true })
  // public id: number
   @column({isPrimary: true,columnName:'video_id'})
  public videoId: string  

  @column({columnName:'library_id'})
  public libraryId: number

  @column()
  public duration:number

  @column()
  public title: string

  @column()
  public category:string

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
