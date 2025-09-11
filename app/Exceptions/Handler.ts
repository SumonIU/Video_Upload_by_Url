import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error: any, ctx: HttpContextContract) {
    const { response } = ctx
    const isDevelopment = process.env.NODE_ENV === 'development'

    // console.log('----------------------error code from  Exception handler-------->: ',error.code)

    // Validation errors
    if (error.code === 'E_VALIDATION_FAILURE' || error.messages) {
      return response.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: error.messages || error.errors
      })
    }

    // Authentication errors
    if (error.status === 401) {
      return response.status(401).json({
        success: false,
        message: 'Unauthorized access'
      })
    }

    // Not found errors
    if (error.code === 'E_ROUTE_NOT_FOUND' || error.status === 404) {
      return response.status(404).json({
        success: false,
        message: 'Resource not found'
      })
    }

    // Database errors
    if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
      return response.status(409).json({
        success: false,
        message: 'Resource already exists'
      })
    }

    // External API errors (Bunny.net)
    if (error.isAxiosError) {
      const status = error.response?.status || 502
      return response.status(status).json({
        success: false,
        message: 'External service error'
      })
    }

    // Video specific errors
    if (error.code === 'E_VIDEO_NOT_FOUND') {
      return response.status(404).json({
        success: false,
        message: 'Video not found'
      })
    }

    if (error.code === 'E_VIDEO_UPLOAD_FAILED') {
      return response.status(400).json({
        success: false,
        message: 'Video upload failed'
      })
    }

    // Log error for debugging
    Logger.error('Application Error:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      status: error.status
    })

    // Generic error response
    const statusCode = error.status || 500
    return response.status(statusCode).json({
      success: false,
      message: isDevelopment ? error.message : 'Something went wrong',
      ...(isDevelopment && { stack: error.stack })
    })
  }
}