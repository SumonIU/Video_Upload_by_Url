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
    const payload = await this.validator.uploadVideoValidator(ctx);
    return await this.videoService.uploadVideo(payload);
  }

  public async showSingleVideo(ctx: HttpContextContract) {
    const payload = this.validator.videoIdValidator(ctx);
    return await this.videoService.getVideo(payload);
  }

  public async showAllVideos() {
      return await this.videoService.listVideos();
  }
  public async updateVideo(ctx: HttpContextContract) {
    const payload = await this.validator.updateVideoValidator(ctx);
    return await this.videoService.updateVideo(payload);
  }

  public async destroyVideo(ctx: HttpContextContract) {
    const payload = await this.validator.videoIdValidator(ctx);
    return await this.videoService.deleteVideo(payload);
  }

  public async BunnyWebHookResponse(ctx: HttpContextContract) {
    const payload = await this.validator.webHookValidator(ctx);
    this.videoService.updateVideoStatus(payload);
    return ctx.response.status(200).send("OK");
  }
}
