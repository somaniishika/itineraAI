import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../config/typeorm.config';
import { DatabaseService } from './database.service';
import { QuestionnaireSeeder } from './seeders/questionnaire.seeder';
import { QuestionnaireRepository } from 'src/modules/admin/repositories/questionnaire.repository';
import { UserRepository } from 'src/modules/users/repositories/users.repository';
import { Questionnaire } from 'src/modules/itinerary/entities/questionnaire.entity';
import { User } from 'src/modules/users/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig),TypeOrmModule.forFeature([Questionnaire, User]),],
  providers: [DatabaseService, QuestionnaireSeeder,QuestionnaireRepository,UserRepository],
  exports: [QuestionnaireSeeder,QuestionnaireRepository],
})
export class DatabaseModule {}
