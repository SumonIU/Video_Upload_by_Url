import User from "App/Models/User";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { Exception } from "@adonisjs/core/build/standalone";
import Query from "./Queries";

export default class Controllers {

  public Queries: Query;
  constructor() {
    this.Queries = new Query();
  }
  public async createUser(ctx: HttpContextContract) {
    const { email, password, fullName, avatarUrl } = await ctx.request.all();

    const user = await this.Queries.createUser({ email, password });

    if (fullName || avatarUrl) {
      await this.Queries.createProfile(user, { fullName, avatarUrl });
    }
    return ctx.response.json({
      user,
    });
  }

  public async createPost(ctx: HttpContextContract) {
    const userId = await ctx.params.id;
    const postData = await ctx.request.only(["title", "content"]);
    const user = await this.Queries.getSingleUser(userId);
    if (!user) {
      throw new Exception("User Not Found", 400, "E_INVALID_REQUEST");
    }
    return await this.Queries.createPost(user, postData);
  }

  public async getSingleUser(ctx: HttpContextContract) {
    const userId = await ctx.params.id;
    const user = await this.Queries.getSingleUser(userId);
    if (!user) {
      throw new Exception("User Not Found", 400, "E_INVALID_REQUEST");
    }
    return ctx.response.json({
      user: user,
    });
  }

  public async getSingleUserPosts(ctx:HttpContextContract){
    const userid=await ctx.params.id;
    const user=await this.Queries.getSingleUser(userid);
    if(!user){
        throw new Exception('User Not Found',400,'E_INVALID_REQUEST');
    }
    return await this.Queries.getPostByUserId(userid);

  }
  public async getAllUsersPosts() {
    return await this.Queries.getAllPosts();
  }

  public async showAllUsers() {
    const users = await User.query();
    return users;
  }

  public async findUserByEmail(ctx: HttpContextContract) {
    const { email } = await ctx.request.only(["email"]);
    const user = await this.Queries.getUserByEmail(email);
    if (!user) {
      throw new Exception("User Not Found", 400, "E_INVALID_REQUEST");
    }
    return user;
  }

  public async updateUser(ctx: HttpContextContract) {
    const userId = await ctx.params.id;
    const { email, password } = await ctx.request.all();
    const user = await this.Queries.getSingleUser(userId);
    if (!user) {
      throw new Exception("User Not Found", 400, "E_INVALID_REQUEST");
    }
    return this.Queries.updateUser(userId, { email, password });
  }

  public async updateProfile(ctx: HttpContextContract) {
    const userId = await ctx.params.id;
    const { fullName, avatarUrl } = await ctx.request.all();
    const profile = this.Queries.getSingleProfile(userId);
    if (!profile) {
      throw new Exception("Profile Not Found", 400, "E_INVALID_REQUEST");
    }
    return this.Queries.updateProfile(userId, { fullName, avatarUrl });
  }

  public async deleteSingleUser(ctx:HttpContextContract){
    const userid=await ctx.params.id;
    return await this.Queries.deleteUserById(userid);
  }

  public async deletePostById(ctx:HttpContextContract){
    const userId=await ctx.params.id;
    const post=await this.Queries.getPostById(userId);
    if(!post){
        throw new Exception('Post Not Found',400,'E_INVALID_REQUEST');
    }
    return await this.Queries.deletePostById(userId);
  }
}
