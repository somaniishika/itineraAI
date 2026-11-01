import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Questionnaire } from '../entities/questionnaire.entity';

@Injectable()
export class QuestionnaireRepository {
  private readonly repository: Repository<Questionnaire>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Questionnaire);
  }

  async findAll(): Promise<Questionnaire[]> {
    return this.repository.createQueryBuilder('q')
      .orderBy('q.created_at', 'ASC')
      .getMany();
  }
}
