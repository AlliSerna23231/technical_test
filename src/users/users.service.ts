import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {User} from '../users/entities/user.entity'
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>, 
  ) {}

}
