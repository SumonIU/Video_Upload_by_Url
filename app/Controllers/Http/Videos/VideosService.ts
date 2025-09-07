import axios, { AxiosResponse } from "axios";
import Env from "@ioc:Adonis/Core/Env";
import VideoInfo from "App/Models/VideoInfo";
import VideosQuery from "./VideosQuery";

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
  private libraryId: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = Env.get("BUNNY_STREAM_API_KEY");
    this.libraryId = Env.get("BUNNY_STREAM_LIBRARY_ID");
    this.baseUrl = Env.get(
      "BUNNY_STREAM_BASE_URL",
      "https://video.bunnycdn.com"
    );
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
      await VideoInfo.create({
        video_id: videoId,
        title: title,
        status: "uploading",
      });

      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to upload video from URL: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  public async getVideo(videoId: string): Promise<BunnyVideoUploadResponse> {
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
    try {
      await axios.delete(
        `${this.baseUrl}/library/${this.libraryId}/videos/${videoId}`,
        {
          headers: {
            AccessKey: this.apiKey,
          },
        }
      );

      //deleting from the MySQL database
      await VideosQuery.deleteVideoById(videoId);

      return { message: "Video deleted successfully" };
    } catch (error) {
      throw new Error(
        `Failed to delete video: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  public async listVideos(
    page: number = 1,
    itemsPerPage: number = 100,
    search?: string,
    collection?: string,
    orderBy?: string
  ): Promise<{
    items: BunnyVideoUploadResponse[];
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
  }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        itemsPerPage: itemsPerPage.toString(),
      });

      if (search) params.append("search", search);
      if (collection) params.append("collection", collection);
      if (orderBy) params.append("orderBy", orderBy);

      const response = await axios.get(
        `${this.baseUrl}/library/${this.libraryId}/videos?${params.toString()}`,
        {
          headers: {
            AccessKey: this.apiKey,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to list videos: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  public async updateVideo(
    videoId: string,
    updates: {
      title?: string;
      collectionId?: string;
      chapters?: any[];
      moments?: any[];
      metaTags?: any[];
    }
  ): Promise<BunnyVideoUploadResponse> {
    try {
      const response: AxiosResponse<BunnyVideoUploadResponse> =
        await axios.post(
          `${this.baseUrl}/library/${this.libraryId}/videos/${videoId}`,
          updates,
          {
            headers: {
              AccessKey: this.apiKey,
              "Content-Type": "application/json",
            },
          }
        );

      //updating in MySQL
      const new_updates = {
        title: updates.title,
        status: "uploading",
      };
      VideosQuery.updateVideo(videoId, new_updates);

      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to update video: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }
}
