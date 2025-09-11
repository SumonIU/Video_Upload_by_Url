import { Emitter, Exception } from "@adonisjs/core/build/standalone";
import Post from "App/Models/Post";
import Profile from "App/Models/Profile";
import User from "App/Models/User";

export default class Queries {

  public async getSingleUser(userId: number) {
    const user = await User.query().where("id", userId).first();
    if (!user) {
      throw new Exception("User Not Found", 400, "E_INVALID_REQUEST");
    }
    return user;
  }

  public async getAllUsers(){
    return await User.query();
  }

  public async getSingleProfile(userId:number){
    return await Profile.query().where('user_id',userId).first();
  }

  public async getAllProfiles(){
    return await Profile.query();
  }

  public async getPostByUserId(userId:number){
    return await Post.query().where('user_id',userId);
  }

  public async getPostById(id:number){
    return await Post.query().where('id',id).first();
  }

  public async getAllPosts(){
    return await Post.query();
  }

  public async getUserByEmail(email:string){
    return await User.query().where('email',email).first();
  }

  public async createUser(userData) {
    return await User.create(userData);
  }

  public async createProfile(user,profileData){
    return await user.related('profile').create(profileData);
  }

  public async createPost(user:any,postData:any){
    return await user.related('posts').create(postData);
  }

  public async updateUser(userId:number,updateData:any){
    return await User.query().where('id',userId).update(updateData);
  }

  public async updateProfile(userId:number,updates:any){
    return await Profile.query().where('user_id',userId).update(updates)
  }
  
  public async deleteUserById(userid:number){

    return await User.query().where('id',userid).delete();
  }

  public async deletePostById(id:number){
    return await Post.query().where('id',id).delete();
  }

}
