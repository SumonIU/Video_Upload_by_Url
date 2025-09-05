import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'

export default class VideoUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate video updates
   */
  public schema = schema.create({
    title: schema.string.optional([
      rules.trim(),
      rules.minLength(1),
      rules.maxLength(255),
    ]),
    collectionId: schema.string.optional([
      rules.trim(),
      rules.maxLength(255),
    ]),
    chapters: schema.array.optional().members(
      schema.object().members({
        title: schema.string([rules.trim(), rules.maxLength(255)]),
        start: schema.number(),
        end: schema.number(),
      })
    ),
    moments: schema.array.optional().members(
      schema.object().members({
        label: schema.string([rules.trim(), rules.maxLength(255)]),
        timestamp: schema.number(),
      })
    ),
    metaTags: schema.array.optional().members(
      schema.object().members({
        property: schema.string([rules.trim(), rules.maxLength(255)]),
        value: schema.string([rules.trim(), rules.maxLength(255)]),
      })
    ),
  })

  /**
   * Custom messages for validation failures
   */
  public messages: CustomMessages = {
    'title.minLength': 'Video title cannot be empty',
    'title.maxLength': 'Video title cannot exceed 255 characters',
    'collectionId.maxLength': 'Collection ID cannot exceed 255 characters',
    'chapters.*.title.maxLength': 'Chapter title cannot exceed 255 characters',
    'chapters.*.start.number': 'Chapter start time must be a number',
    'chapters.*.end.number': 'Chapter end time must be a number',
    'moments.*.label.maxLength': 'Moment label cannot exceed 255 characters',
    'moments.*.timestamp.number': 'Moment timestamp must be a number',
    'metaTags.*.property.maxLength': 'Meta tag property cannot exceed 255 characters',
    'metaTags.*.value.maxLength': 'Meta tag value cannot exceed 255 characters',
  }
}
