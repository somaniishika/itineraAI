import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './users.service'; 
import { User } from './entities/users.entity';
import { SuspensionRequest } from './entities/suspension-request.entity';
import { SuspensionRequestRepository } from './repositories/suspension-request.repository';
import { UserRepository } from './repositories/users.repository';
import { UserController } from './users.controller';
import { UserFeatureBalance } from '../feature-management/entities/users-feature-balance.entity';
import { UserAnalyticsRepository } from './repositories/users-analytics.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User,SuspensionRequest,UserFeatureBalance]),
  ],
  controllers: [UserController],
  providers: [UserService,UserRepository,UserAnalyticsRepository,SuspensionRequestRepository],
  exports: [UserService,UserAnalyticsRepository,UserRepository,SuspensionRequestRepository,TypeOrmModule], 
})
export class UsersModule {}
