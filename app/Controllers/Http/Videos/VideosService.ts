import axios, { AxiosResponse } from "axios";
import Env from "@ioc:Adonis/Core/Env";
import VideosQuery from "./VideosQuery";
import { Exception } from "@adonisjs/core/build/standalone";

export interface BunnyVideoUploadResponse {
  videoLibraryId: string;
  guid: string;
  title: string;
  dateUploaded: string;
  views: number;
  isPublic: boolean;
  length: number;
  status: number;
  framerate: number;
  rotation: number;
  width: number;
  height: number;
  availableResolutions: string;
  thumbnailCount: number;
  encodeProgress: number;
  storageSize: number;
  captions: any[];
  hasMP4Fallback: boolean;
  collectionId: string;
  thumbnailFileName: string;
  averageWatchTime: number;
  totalWatchTime: number;
  category: string;
  chapters: any[];
  moments: any[];
  metaTags: any[];
}

export interface BunnyUploadUrlResponse {
  message: string;
  task: string;
}

export default class BunnyStreamService {
  private apiKey: string;
  private libraryId: number;
  private baseUrl: string;
  private videoQuery: VideosQuery;

  constructor() {
    this.apiKey = Env.get("BUNNY_STREAM_API_KEY");
    this.libraryId = Env.get("BUNNY_STREAM_LIBRARY_ID");
    this.baseUrl = Env.get(
      "BUNNY_STREAM_BASE_URL",
      "https://video.bunnycdn.com"
    );
    this.videoQuery = new VideosQuery();
  }

  public async createVideoIdInBunny(
    title: string
  ): Promise<BunnyVideoUploadResponse> {
    try {
      const requestBody: any = { title };
      const response: AxiosResponse<BunnyVideoUploadResponse> =
        await axios.post(
          `${this.baseUrl}/library/${this.libraryId}/videos`,
          requestBody,
          {
            headers: {
              AccessKey: this.apiKey,
              "Content-Type": "application/json",
            },
          }
        );

      return response.data;
    } catch (error) {
      throw new Exception(
        "Failed to Create VideoId In Bunny",
        400,
        "E_INVALID_REQUEST"
      );
    }
  }
  public async uploadVideoInBunny(payload: any) {
    const { title, videoUrl } = payload;
    const videoData = await this.createVideoIdInBunny(title);
    const videoId = videoData.guid;
    try {
      const res = await axios.post(
        `${this.baseUrl}/library/${this.libraryId}/videos/${videoId}/fetch`,
        {
          url: videoUrl,
        },
        {
          headers: {
            AccessKey: this.apiKey,
            "Content-Type": "application/json",
          },
        }
      );
      let dbStatus = "uploading";
      if (!res.data.success) dbStatus = "failed";
      return { title, videoId, dbStatus };
    } catch (error) {
      throw new Exception(
        "Failed to Video Upload In Bunny",
        400,
        "E_INVALID_REQUEST"
      );
    }
  }
  public async uploadVideo(payload) {
    const { title, videoId, dbStatus } = await this.uploadVideoInBunny(payload);
    const video_id = videoId;
    await this.videoQuery.store(
      video_id,
      this.libraryId,
      0,
      title,
      "Unknown",
      dbStatus
    );
  }
  public async deleteVideoFromBunny(videoId: string) {
    await axios.delete(
      `${this.baseUrl}/library/${this.libraryId}/videos/${videoId}`,
      {
        headers: {
          AccessKey: this.apiKey,
        },
      }
    );
    return { message: "Video deleted successfully" };
  }
  public async getVideo(payload) {
    const { videoId } = payload;
    const video = await this.videoQuery.getVideo(videoId);
    if (!video) {
      throw new Exception("Video Not Found", 400, "E_INVALID_REQUEST");
    }
    return video;
  }

  public async getVideoFromBunny(videoId: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/library/${this.libraryId}/videos/${videoId}`,
        {
          headers: {
            AccessKey: this.apiKey,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Exception("Video Not Found", 400, "E_INVALID_REQEUST");
    }
  }

  public async deleteVideo(payload:any) {
    const { videoId } = payload;

    const video = await this.videoQuery.getVideo(videoId);
    if (!video) {
      throw new Exception("Video Not Found", 400, "E_INVALID_REQUEST");
    }
    await this.videoQuery.deleteVideo(videoId);

    const exist = await this.getVideoFromBunny(videoId);

    if (!exist) {
      throw new Exception("Video Not Found In Bunny", 400, "E_INVALID_REQUEST");
    }
    await this.deleteVideoFromBunny(videoId);
  }

  public async listVideos() {
    return await this.videoQuery.getAllVideo();
  }

  public async updateVideoInBunny(videoId: string, updates: any) {
    const response: AxiosResponse<BunnyVideoUploadResponse> = await axios.post(
      `${this.baseUrl}/library/${this.libraryId}/videos/${videoId}`,
      updates,
      {
        headers: {
          AccessKey: this.apiKey,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }

  public async updateVideo(payload): Promise<BunnyVideoUploadResponse> {
    const { videoId, title, category, status, duration } = payload;
    const updates = {
      title,
      category,
      status,
      duration,
    };
    const video = await this.videoQuery.getVideo(videoId);
    if (!video) {
      throw new Exception("Video Not Found", 400, "E_INVALID_REQUEST");
    }
    
    //update in MySQL
    await this.videoQuery.updateVideo(videoId, updates);

    //update in Bunny
    return await this.updateVideoInBunny(videoId, updates);
  }

  public async updateVideoStatus(payload:any) {
    const { VideoGuid, Status } = payload;
    const videoId = VideoGuid;
    let dbStatus = "uploading";
    console.log("Webhook Status");
    console.log(Status);
    if (Status == 4 || Status == 5) {
      if (Status == 4) dbStatus = "success";
      else dbStatus = "failed";
    }
    if (videoId && (dbStatus == "success" || dbStatus == "failed")) {
      const videoData = await this.getVideoFromBunny(videoId);
      const updates = {
        video_id: videoId,
        status: dbStatus,
        category: videoData?.category,
        duration: videoData?.length || 0,
      };
      await this.videoQuery.updateVideo(videoId, updates);
    }
  }
}
