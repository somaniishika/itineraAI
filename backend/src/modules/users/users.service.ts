import { Injectable, NotFoundException, BadRequestException,InternalServerErrorException,Logger, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './repositories/users.repository';
import { UserMessages } from './constants/user-messages.constant';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './entities/users.entity';
import { comparePasswords,hashPassword } from '../auth/utils/auth.utils';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
   constructor(private readonly userRepository: UserRepository) {}

   //Update User Profile
  async updateProfile(userId: number, dto: UpdateProfileDto): Promise<Partial<User>> {
  const user = await this.userRepository.findById(userId);
  if (!user) throw new Error(UserMessages.USER_NOT_FOUND);

  let isUpdated = false;

  if (dto.full_name && dto.full_name !== user.full_name) {
    user.full_name = dto.full_name;
    isUpdated = true;
  }

  if (dto.username && dto.username !== user.username) {
    const existing = await this.userRepository.findByUsername(dto.username);
    if (existing && existing.id !== user.id) {
      throw new Error(UserMessages.USERNAME_ALREADY_EXISTS);
    }
    user.username = dto.username;
    isUpdated = true;
  }

  if (dto.address && dto.address !== user.address) {
    user.address = dto.address;
    isUpdated = true;
  }

  if (!isUpdated) {
    throw new Error(UserMessages.NO_CHANGES_PROVIDED);
  }

  await this.userRepository.save(user);
  return { 
    id:user.id,
     full_name: user.full_name,
    username: user.username,
    address: user.address,
   };
}
 // Delete Request
  async deleteUser(userId: number, password: string): Promise<void> {
  const user = await this.userRepository.findById(userId);

  if (!user) {
    throw new Error(UserMessages.USER_NOT_FOUND);
  }

  const isMatch = await comparePasswords(password, user.password_hash);
  if (!isMatch) {
    throw new Error(UserMessages.INVALID_PASSWORD);
  }

  user.is_deleted = true;
  user.deleted_at = new Date();

  await this.userRepository.save(user);
}

 
 // Get Profile Details
 async getProfileDetail(userId: number): Promise<any> {
    try {
      const user =await this.userRepository.findById(userId);

      if (!user) {
        throw new NotFoundException(UserMessages.USER_NOT_FOUND);
      }

      const { password_hash, ...userInfo } = user;

      return userInfo; 
    } catch (error) {
      this.logger.error(`Failed to fetch profile: ${error.message}`, error.stack);
      throw new InternalServerErrorException(UserMessages.PROFILE_FETCH_FAILED);
    }
  }

  // Update user password
  async updatePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error(UserMessages.USER_NOT_FOUND);
    }

    if (!user.password_hash) {
      throw new Error(UserMessages.PASSWORD_NOT_SET);
    }

    const isMatch = await comparePasswords(currentPassword, user.password_hash);

    if (!isMatch) {
      throw new Error(UserMessages.INCORRECT_CURRENT_PASSWORD);
    }

    const isSamePassword = await comparePasswords(newPassword, user.password_hash);
    if (isSamePassword) {
      throw new Error(UserMessages.NEW_PASSWORD_SAME_AS_OLD);
    }
    
    try {
       const hashedNewPassword = await hashPassword(newPassword);
     await this.userRepository.updatePassword(userId, hashedNewPassword);


      this.logger.log(`Password updated successfully for user ID: ${userId}`);
    } catch (error) {
      this.logger.error(
        `Error updating password for user ${userId}: ${error.message}`,
        error.stack,
      );
      throw new Error(UserMessages.PASSWORD_UPDATE_FAILED);
    }
  }

}



