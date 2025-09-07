import VideoInfo from 'App/Models/VideoInfo'

export default class VideosQuery {
  
  // Delete a video record from MySQL by video_id
  public static async deleteVideoById(videoId: string) {
    const videoInfo = await VideoInfo.findBy('video_id', videoId)
    if (videoInfo) {
      await videoInfo.delete()
    }
  }

  //Update a video title record in MySQL by video_id
  public static async updateVideo(videoId: string, updates: any) {
    const videoInfo = await VideoInfo.findBy('video_id', videoId)
    if (videoInfo) {
      Object.assign(videoInfo, updates)  // dynamically update fields
      await videoInfo.save()
    }
  }

}
