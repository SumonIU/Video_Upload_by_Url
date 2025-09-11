import VideoInfo from "App/Models/VideoInfo";
export default class VideosQuery {
  public async store(
    videoId: string,
    libraryId: number,
    duration: number,
    title: string,
    category: string,
    status: string
  ) {
    return await VideoInfo.create({
      videoId,
      libraryId,
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
    return await VideoInfo.query().where("video_id", videoId).update(updates);
  }

  public async getAllVideo() {
    return await VideoInfo.query();
  }
}
