import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BunnyStreamService from 'App/Controllers/Http/Videos/VideosService'

export default class VideosController {
  private bunnyStreamService: BunnyStreamService

  constructor() {
    this.bunnyStreamService = new BunnyStreamService()
  }

  public async uploadFromUrl({ request, response }: HttpContextContract) {
    try {
      // Get request data
      const { videoUrl, title, collectionId } = request.all()

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
          video,
        },
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to upload video',
        error: error.message,
      })
    }
  }

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

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const videoId = params.id
      // Get request data
      const updates = request.all()

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
