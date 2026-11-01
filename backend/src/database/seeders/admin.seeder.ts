import { Injectable, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/modules/users/repositories/users.repository';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { Logger } from '@nestjs/common';

@Injectable()
export class AdminSeeder implements OnModuleInit {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: Logger,
  ) {}

  async onModuleInit() {
    
    const adminExists = await this.userRepository.findByEmail(process.env.ADMIN_EMAIL!);

    if (adminExists) {
      this.logger.log('[Seeder] Admin user already exists. Skipping seeding.');
      return;
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);

    const adminDto: CreateUserDto = {
      full_name: process.env.ADMIN_FULL_NAME!,
      username: process.env.ADMIN_USERNAME!,
      email: process.env.ADMIN_EMAIL!,
      address: process.env.ADMIN_ADDRESS!,
      password: hashedPassword,
    };

    const adminUser = await this.userRepository.create(adminDto);

    adminUser.role = 'ADMIN';
    adminUser.email_verified = true;
    adminUser.is_suspended = false;
    adminUser.is_deleted = false;
    adminUser.created_at = new Date();
    adminUser.updated_at = new Date();

    await this.userRepository.save(adminUser);

    this.logger.log('[Seeder] Admin user created successfully.');
  }
}
