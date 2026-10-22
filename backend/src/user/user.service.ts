import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dtos.js';
import bcrypt from 'bcrypt';
import { User } from './entities/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>){}


  async create(dto: CreateUserDto): Promise<User> {
    if (await this.findByEmail(dto.email)) {
      throw new ConflictException('Korisnik sa ovim emailom vec postoji');
    }
    const { password, ...rest } = dto;
    const passwordHash = await bcrypt.hash(password, 10);
    return this.repo.save(this.repo.create({ ...rest, passwordHash }));
  }

  findById(id: string): Promise<User | null>{
    return this.repo.findOneBy({id});
  }

  findByEmail(email: string): Promise<User | null>{
    return this.repo.findOneBy({email});
  }

  findByEmailWithPassword(email: string):Promise<User | null>{
    return this.repo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.email = :email',{email})
      .getOne();
  }

  findByIdWithRefreshHash(id : string):Promise<User | null>{
    return this.repo
      .createQueryBuilder('u')
      .addSelect('u.refreshTokenHash')
      .where('u.id =:id',{id})
      .getOne();
  }

  setRefreshTokenHash(id : string, hash: string | null):Promise<UpdateResult>{
    return this.repo.update(id ,{refreshTokenHash: hash});
  }
}
