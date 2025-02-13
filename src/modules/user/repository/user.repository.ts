import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../database/entities/user.entity';
import { StatusEnum } from '../../../shared/enums/status.enum';
import { handleError } from '../../../shared/utils/handle-error.util';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createNewUser(data: CreateUserDto): Promise<UserEntity> {
    return this.userRepository.save(data);
  }

  async findAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.find().catch(handleError);
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    return this.userRepository
      .findOne({
        where: {
          email,
        },
      })
      .catch(handleError);
  }

  async findUserById(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id } }).catch(handleError);
  }

  async desativateUserById(id: string): Promise<UserEntity> {
    const user = await this.userRepository
      .findOne({ where: { id } })
      .catch(handleError);

    user.status = StatusEnum.ARCHIVED;

    return this.userRepository.save(user);
  }

  async updateAccessAttempts(user: UserEntity): Promise<void> {
    await this.userRepository.save(user);

    return;
  }
}
