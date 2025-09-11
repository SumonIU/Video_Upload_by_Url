import { schema, rules } from "@ioc:Adonis/Core/Validator";

export default class VideoValidator {
  public async uploadVideoValidator(ctx: any) {
    return await ctx.request.validate({
      schema: schema.create({
        videoUrl: schema.string({}, [
          rules.url({
            protocols: ["http", "https"],
            requireProtocol: true,
          }),
        ]),
        title: schema.string({}, [rules.minLength(1), rules.maxLength(255)]),
      }),
      messages: {
        "videoUrl.required": "Video URL is required",
        "videoUrl.url": "Please provide a valid video URL",

        "title.required": "Title is required",
        "title.maxLength": "Title must not exceed 255 characters",
        "title.minLength": "Title must be at least 1 character long",
      },
    });
  }

  public async updateVideoValidator(ctx: any) {
    return await ctx.request.validate({
      data: { ...ctx.request.all(), videoId: ctx.params.id },
      schema: schema.create({
        videoId: schema.string({}, [rules.uuid()]),
        title: schema.string.optional({}, [
          rules.minLength(1),
          rules.maxLength(255),
        ]),
        category: schema.string.optional({}, [
          rules.minLength(1),
          rules.maxLength(100),
        ]),
        duration: schema.number.optional(),
      }),
      messages: {
        "videoId.required": "Video ID is required",

        "title.minLenght": "Title must be at least 1 character long",
        "title.maxLength": "Title must not exceed 255 characters",

        "category.maxLength": "Category must not exceed 100 characters",

        "duration.number": "Duration must be a number",
      },
    });
  }

  public async webHookValidator(ctx: any) {
    return await ctx.request.validate({
      schema: schema.create({
        VideoGuid: schema.string({}, [rules.uuid()]),
        Status: schema.number([rules.range(0, 5)]),
      }),
      messages: {
        "VideoGuid.required": "Video GUID is required",
        "VideoGuid.uuid": "Video GUID must be a valid uuid formate",

        "Status.required": "Status is required",
        "Status.number": "Status must be a number",
        "Status.range": "Status must be between 0 and 5",
      },
    });
  }

  public async videoIdValidator(ctx: any) {
    return await ctx.request.validate({
      data: { ...ctx.request.all(), videoId: ctx.params.id },
      schema: schema.create({
        videoId: schema.string({}, [rules.uuid()]),
      }),
      messages: {
        "videoId.required": "Video ID is required",
        "videoId.uuid": "Video ID must be a valid UUID",
      },
    });
  }
}
