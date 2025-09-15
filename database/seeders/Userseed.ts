
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Seeder from 'App/Models/Seeder'
import { faker } from '@faker-js/faker';
import Database from '@ioc:Adonis/Lucid/Database';
export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await Database.rawQuery('truncate table seeder_tables')
    const users:Array<object>=[];
    for(let i=0;i<10;i++){
      users.push({
        name:faker.internet.username(),
        email:faker.internet.email(),
        password:'1234'
      })
    }
    await Seeder.createMany(users);
  }
}
