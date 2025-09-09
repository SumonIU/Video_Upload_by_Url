import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BunnyVideoService from "App/Controllers/Http/Videos/VideosService";
import VideoValidator from "./VideosValidator";
export default class VideosController {
  private videoService: BunnyVideoService;
  private validator: VideoValidator;

  constructor() {
    this.videoService = new BunnyVideoService();
    this.validator = new VideoValidator();
  }

  public async uploadVideoByUrl(ctx: HttpContextContract) {
    const payload =await this.validator.uploadVideoValidator(ctx);
    await this.videoService.uploadVideo(payload);
    return ctx.response.ok({
      message: "Video upload initiated successfully",
    });
  }

  public async showSingleVideo(ctx: HttpContextContract) {
    const payload = this.validator.videoIdValidator(ctx);
    const video = await this.videoService.getVideo(payload);

    return ctx.response.ok({
      message: "Video retrieved successfully",
      data: video,
    });
  }

  public async showAllVideos({ response }: HttpContextContract) {
    try {
      const videos = await this.videoService.listVideos();

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

  public async updateVideo(ctx: HttpContextContract) {
    const payload =await this.validator.updateVideoValidator(ctx);

    await this.videoService.updateVideo(payload);

    return ctx.response.ok({
      message: "Video updated successfully",
    });
  }

  public async destroyVideo(ctx: HttpContextContract) {
    const payload =await this.validator.videoIdValidator(ctx);
    await this.videoService.deleteVideo(payload);
    return ctx.response.ok({
      message: "Video deleted successfully",
    });
  }

  public async BunnyWebHookResponse(ctx: HttpContextContract) {
    const payload=await this.validator.webHookValidator(ctx);
    this.videoService.updateVideoStatus(payload);
    return ctx.response.status(200).send("OK");
  }
}

