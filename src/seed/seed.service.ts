import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { Seed } from './data/data.seed';

@Injectable()
export class SeedService {

  constructor(

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}


  async seed() {
    await this.deleteUsers()
    await this.createUsers()
    return 'SEED EXECUTED'
  }

  private async deleteUsers(){
    const queryBuilder = this.userRepository.createQueryBuilder()
    await queryBuilder.delete().where({}).execute()
  }

  private async createUsers(){
    const seedUsers = Seed.users;

    const users: User[] = [];

    seedUsers.forEach(user => {
      users.push(this.userRepository.create(user))
    })

    await this.userRepository.save(users)
  }
}
