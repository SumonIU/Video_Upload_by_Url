import { schema, rules } from "@ioc:Adonis/Core/Validator";

export default class VideoValidator {
  public uploadFromUrl = {
    schema: schema.create({
      videoUrl: schema.string({}, [rules.url()]),
      title: schema.string({}, [rules.maxLength(255)]),
    }),
    messages: {
      "videoUrl.required": "Video URL is required",
      "videoUrl.url": "Please provide a valid video URL",
      "title.required": "Title is required",
      "title.maxLength": "Title must not exceed 255 characters",
    },
  };

  public updateVideo = {
    schema: schema.create({
      videoId: schema.string({}, [rules.uuid()]),
      title: schema.string.optional({}, [rules.maxLength(255)]),
      status: schema.enum.optional([
        "success",
        "failed",
        "Uploading",
      ] as const),
      category: schema.string.optional({}, [rules.maxLength(100)]),
      duration: schema.number.optional(),
    }),
    messages: {
      "videoId.required": "Video ID is required",
      "title.maxLength": "Title must not exceed 255 characters",
      "status.enum": "Status must be one of Uploading, Processing, or Ready",
      "category.maxLength": "Category must not exceed 100 characters",
      "duration.number": "Duration must be a number",
    },
  };

  public check = {
    schema: schema.create({
      videoId: schema.string({}, [rules.uuid()]),
    }),
    messages: {
      "videoId.required": "Video ID is required",
      "videoId.uuid": "Video ID must be a valid UUID",
    },
  };
}
