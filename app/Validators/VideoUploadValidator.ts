import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'

export default class VideoUploadValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate video upload from URL
   */
  public schema = schema.create({
    videoUrl: schema.string([
      rules.url({
        protocols: ['http', 'https'],
        requireTld: true,
        requireProtocol: true,
      }),
      rules.maxLength(2000),
    ]),
    title: schema.string([
      rules.trim(),
      rules.minLength(1),
      rules.maxLength(255),
    ]),
    collectionId: schema.string.optional([
      rules.trim(),
      rules.maxLength(255),
    ]),
  })

  /**
   * Custom messages for validation failures
   */
  public messages: CustomMessages = {
    'videoUrl.required': 'Video URL is required',
    'videoUrl.url': 'Video URL must be a valid URL with http or https protocol',
    'videoUrl.maxLength': 'Video URL cannot exceed 2000 characters',
    'title.required': 'Video title is required',
    'title.minLength': 'Video title cannot be empty',
    'title.maxLength': 'Video title cannot exceed 255 characters',
    'collectionId.maxLength': 'Collection ID cannot exceed 255 characters',
  }
}
