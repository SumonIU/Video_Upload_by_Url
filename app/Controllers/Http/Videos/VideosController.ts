import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BunnyStreamService from "App/Controllers/Http/Videos/VideosService";
import VideoValidator from "./VideosValidator";
export default class VideosController {
  private bunnyStreamService: BunnyStreamService;
  private validator: VideoValidator;

  constructor() {
    this.bunnyStreamService = new BunnyStreamService();
    this.validator = new VideoValidator();
  }

  public async uploadFromUrl({ request, response }: HttpContextContract) {
    //validation check
    const payload = await request.validate(this.validator.uploadFromUrl);

    const video = await this.bunnyStreamService.createVideo(payload.title);
    //upload video in bunny.net
    await this.bunnyStreamService.uploadVideoFromUrl(
      video.guid,
      payload.videoUrl,
      payload.title
    );
    return response.ok({
      message: "Video upload initiated successfully",
      data: {
        videoId: video.guid,
        title: video.title,
        video,
      },
    });
  }

  public async show({ params, request, response }: HttpContextContract) {

    const payload = await request.validate({
      ...this.validator.check,
      data: { videoId: params.id },
    });
    const videoId = params.id;

    const video = await this.bunnyStreamService.getVideo(videoId);

    return response.ok({
      message: "Video retrieved successfully",
      data: video,
    });
  }

  public async index({ response }: HttpContextContract) {
    try {
      const videos = await this.bunnyStreamService.listVideos();

      return response.ok({
        message: "Videos retrieved successfully",
        data: videos,
      });
    } catch (error) {
      return response.internalServerError({
        message: "Failed to retrieve videos",
        error: error.message,
      });
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    const payload = await request.validate({
      ...this.validator.updateVideo,
      data: { ...request.all(), videoId: params.id },
    });
    const videoId = params.id;
    const { title, status, category, duration } = payload;
    const updates = {
      title,
      status,
      category,
      duration,
    };
    //updating in the bunny.net
    const video = await this.bunnyStreamService.updateVideo(videoId, updates);

    return response.ok({
      message: "Video updated successfully",
      data: video,
    });
  }

  public async destroy({ params, request, response }: HttpContextContract) {
    const payload = await request.validate({
      ...this.validator.check,
      data: { videoId: params.id },
    });
    const videoId = params.id;
    //deleting from the bunny.net
    await this.bunnyStreamService.deleteVideo(videoId);
    return response.ok({
      message: "Video deleted successfully",
    });
  }
}
