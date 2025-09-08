import VideoInfo from "App/Models/VideoInfo";
export default class VideosQuery {

  public async store(
    video_id: string,
    library_id: number,
    duration: number,
    title: string,
    category: string,
    status: string
  ) {
    return await VideoInfo.create({
      video_id,
      library_id,
      duration,
      title,
      category,
      status,
    });
  }
  public async getVideo(videoId: string) {
    return await VideoInfo.query()
      .select("video_id")
      .where("video_id", videoId)
      .first();
  }

  public async deleteVideo(videoId: string) {
    return await VideoInfo.query().where("video_id", videoId).delete();
  }

  public async updateVideo(videoId: string, updates: any) {
    const video = await VideoInfo.findBy("video_id", videoId);
    video?.merge(updates);
    return await video?.save();
  }

  public async getAllVideo() {
    return await VideoInfo.query();
  }
}
