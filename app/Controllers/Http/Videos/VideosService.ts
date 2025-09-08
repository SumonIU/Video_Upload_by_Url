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

  public async createVideo(
    title: string,
    collectionId?: string
  ): Promise<BunnyVideoUploadResponse> {
    try {
      const requestBody: any = { title };
      if (collectionId) {
        requestBody.collectionId = collectionId;
      }

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
      throw new Error(
        `Failed to create video: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  public async uploadVideoFromUrl(
    videoId: string,
    videoUrl: string,
    title: string
  ): Promise<BunnyUploadUrlResponse> {
    try {
      const response: AxiosResponse<BunnyUploadUrlResponse> = await axios.post(
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

      //storing in mysql
      await this.videoQuery.store(
        videoId,
        this.libraryId,
        0,
        title,
        "Unknown",
        "Uploading"
      );
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to upload video from URL: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  public async getVideo(videoId: string) {
    const video = await this.videoQuery.getVideo(videoId);
    if(!video){
      throw new Exception('Video Not Found',400,'E_INVALID_REQUEST');
    }
    return video;
  }

  public async getVideoFromBunny(videoId: string) {
    try {
      const response: AxiosResponse<BunnyVideoUploadResponse> = await axios.get(
        `${this.baseUrl}/library/${this.libraryId}/videos/${videoId}`,
        {
          headers: {
            AccessKey: this.apiKey,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to get video: ${error.response?.data?.message || error.message}`
      );
    }
  }

  public async deleteVideo(videoId: string): Promise<{ message: string }> {

    const video = await this.videoQuery.getVideo(videoId);
    if (!video) {
      throw new Exception("Video Not Found", 400, "E_INVALID_REQUEST");
    }
    await this.videoQuery.deleteVideo(videoId);

    const exist=this.getVideoFromBunny(videoId);

    if(!exist){
      throw new Exception('Video Not Found',400,'E_INVALID_REQUEST');
    }
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

  public async listVideos() {
    // try {
    //   const response = await axios.get(
    //     `${this.baseUrl}/library/${this.libraryId}/videos`,
    //     {
    //       headers: {
    //         AccessKey: this.apiKey,
    //       },
    //     }
    //   );

    //   return response.data;
    // } catch (error) {
    //   throw new Error(
    //     `Failed to list videos: ${
    //       error.response?.data?.message || error.message
    //     }`
    //   );
    // }

    return await this.videoQuery.getAllVideo();
  }

  public async updateVideo(
    videoId: string,
    updates: any,
  ): Promise<BunnyVideoUploadResponse> {
    const video = this.videoQuery.getVideo(videoId);
    if (!video) {
      throw new Exception("Video Not Found", 400, "E_INVALID_REQUEST");
    }

    //updating in MySQL
    await this.videoQuery.updateVideo(videoId, updates);

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
}
