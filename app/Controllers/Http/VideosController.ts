// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VideoUploadValidator from 'App/Validators/VideoUploadValidator'
import VideoUpdateValidator from 'App/Validators/VideoUpdateValidator'
import BunnyStreamService from 'App/Services/BunnyStreamService'

export default class VideosController {
  private bunnyStreamService: BunnyStreamService

  constructor() {
    this.bunnyStreamService = new BunnyStreamService()
  }

  /**
   * Upload video from URL to Bunny.net
   */
  public async uploadFromUrl({ request, response }: HttpContextContract) {
    try {
      // Validate request data
      const payload = await request.validate(VideoUploadValidator)
      const { videoUrl, title, collectionId } = payload

      // Create video in Bunny Stream
      const video = await this.bunnyStreamService.createVideo(title, collectionId)

      // Upload video from URL
      const uploadResult = await this.bunnyStreamService.uploadVideoFromUrl(video.guid, videoUrl)

      return response.ok({
        message: 'Video upload initiated successfully',
        data: {
          videoId: video.guid,
          title: video.title,
          uploadTask: uploadResult.task,
          // video,
        },
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to upload video',
        error: error.message,
      })
    }
  }

  /**
   * Get video details
   */
  public async show({ params, response }: HttpContextContract) {
    try {
      const videoId = params.id

      if (!videoId) {
        return response.badRequest({
          message: 'Video ID is required',
        })
      }

      const video = await this.bunnyStreamService.getVideo(videoId)

      return response.ok({
        message: 'Video retrieved successfully',
        data: video,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to retrieve video',
        error: error.message,
      })
    }
  }

  /**
   * List all videos
   */
  public async index({ request, response }: HttpContextContract) {
    try {
      const {
        page = 1,
        itemsPerPage = 10,
        search,
        collection,
        orderBy,
      } = request.only(['page', 'itemsPerPage', 'search', 'collection', 'orderBy'])

      const videos = await this.bunnyStreamService.listVideos(
        Number(page),
        Number(itemsPerPage),
        search,
        collection,
        orderBy
      )

      return response.ok({
        message: 'Videos retrieved successfully',
        data: videos,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to retrieve videos',
        error: error.message,
      })
    }
  }

  /**
   * Update video details
   */
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const videoId = params.id
      // Validate request data
      const updates = await request.validate(VideoUpdateValidator)

      if (!videoId) {
        return response.badRequest({
          message: 'Video ID is required',
        })
      }

      const video = await this.bunnyStreamService.updateVideo(videoId, updates)

      return response.ok({
        message: 'Video updated successfully',
        data: video,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to update video',
        error: error.message,
      })
    }
  }

  /**
   * Delete video
   */
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const videoId = params.id

      if (!videoId) {
        return response.badRequest({
          message: 'Video ID is required',
        })
      }

      await this.bunnyStreamService.deleteVideo(videoId)

      return response.ok({
        message: 'Video deleted successfully',
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to delete video',
        error: error.message,
      })
    }
  }
}
