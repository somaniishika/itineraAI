import { Injectable, NotFoundException } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { CreateUserGoogleDto } from '../dto/create-user-google.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmailOrUsername(email: string, username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: [{ email }, { username }],
    });
  }
    
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email, is_deleted: false} });
  }

  async updatePassword(userId: number, newHashedPassword: string): Promise<void> {
    const result = await this.userRepository.update(userId, {
      password_hash: newHashedPassword,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Failed to update password: User not found');
    }
  }
    
  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }
    
  async findById(id: number): Promise<User | null> {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new Error(`Invalid user ID: ${id}`);
    }
    return this.userRepository.findOne({ where: { id, is_deleted: false } });
  }
   
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({
      full_name: createUserDto.full_name,
      username: createUserDto.username,
      email: createUserDto.email,
      address: createUserDto.address,
      password_hash: createUserDto.password
    });
    return this.userRepository.save(user);
  }

  async createGoogleUser(createUserDto: CreateUserGoogleDto): Promise<User> {
    const user = this.userRepository.create({
      full_name: createUserDto.full_name,
      username: createUserDto.username,
      email: createUserDto.email,
      address: createUserDto.address,
      password_hash: createUserDto.password,
      profile_picture: createUserDto.profile_picture,
      provider: 'google',
      email_verified: true,
    });
    return this.userRepository.save(user);
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
     
  async findByEmailWithSuspensionRequest(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email, is_deleted: false },
      relations: ['suspension_request'],
    });
  }
}