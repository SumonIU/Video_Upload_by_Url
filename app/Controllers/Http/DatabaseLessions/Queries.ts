import { Exception } from "@adonisjs/core/build/standalone";
import Database from "@ioc:Adonis/Lucid/Database";
import Post from "App/Models/Post";
import Profile from "App/Models/Profile";
import Role from "App/Models/Role";
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

  public async getAllUsersCount(){
    // Test raw database query for debug logging
    const users = await Database.from('users').count('* as total-users')
    return users[0];
  }

  public async getSingleProfile(userId:number){
   return await Profile.query().where('user_id',userId).preload('user');
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

  public async getAllPosts(page,limit){
    return await Post.query().paginate(page,limit);
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

  public async createRole(roleData:any){
    
    return await Role.create(roleData)
  }

  public async assignRole(userid:number,roles:any){
    const user=await User.findOrFail(userid);
    return await user.related('roles').attach(roles);
  }

  public async removeRole(userid:number,roles:any){
    const user=await User.findOrFail(userid);
    return user.related('roles').detach(roles);
  }

  public async syncRole(userId:number,roles:Array<number>){
    const user=await User.findOrFail(userId);
    return user.related('roles').sync(roles);
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
