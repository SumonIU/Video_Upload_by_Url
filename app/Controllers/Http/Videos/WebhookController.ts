import BunnyStreamService from "App/Controllers/Http/Videos/VideosService";
import chalk from "chalk";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import videosService from './VideosService'
export default class WebhookController {
  public async webhook({ request, response }: HttpContextContract) {
    console.log("Webhook received:");
    console.log(request.all());
    const videoId = request.input("VideoGuid");
    let dbStatus = "uploading";
    // You can handle different statuses here
    const { Status } = request.all();
    if (Status === 0) {
      console.log(`video is queued for encoding`);
    } else if (Status === 1) {
      console.log(`video is processing`);
    } else if (Status === 2) {
      console.log(`video is encoding`);
    } else if (Status === 3) {
      dbStatus = "success";
      console.log(`video encoding has finished`);
    } else if (Status === 4) {
      console.log(chalk.green(`video Resolution finished`));
    } else if (Status === 5) {
      dbStatus = "failed";
      console.log(chalk.red("video uploading has Failed!"));
    }

    // Respond 200 OK to Bunny.net
    if (videoId && (dbStatus == "success" || dbStatus == "failed")) {
      const bunnyService = new BunnyStreamService();
      const videoData = await bunnyService.getVideo(videoId);
      const updates = {
        status: dbStatus,
        category:videoData.category,
        duration: videoData.length || 0,
      };
      await videosService.updateStatus(videoId, updates);
    }

    return response.status(200).send("OK");
  }
}
