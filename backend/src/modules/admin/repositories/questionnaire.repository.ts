import { DataSource, Repository } from 'typeorm';
import { Questionnaire } from 'src/modules/itinerary/entities/questionnaire.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuestionnaireRepository extends Repository<Questionnaire> {
  constructor(private dataSource: DataSource) {
    super(Questionnaire, dataSource.createEntityManager());
  }

  async getAllQuestions(): Promise<Questionnaire[]> {
    return this.createQueryBuilder('questionnaire')
      .leftJoinAndSelect('questionnaire.creator', 'creator')
      .orderBy('questionnaire.created_at', 'ASC')
      .getMany();
  }

  async createQuestion(data: Partial<Questionnaire>): Promise<Questionnaire> {
    const newQuestion = this.create(data);
    return await this.save(newQuestion);
  }

  async findById(id: number): Promise<Questionnaire | null> {
    return await this.findOne({ where: { id } });
  }

  async updateQuestion(id: number, data: Partial<Questionnaire>): Promise<Questionnaire | null> {
    await this.update(id, data);
    return await this.findById(id);
  }

  async deleteById(id: number): Promise<void> {
    await this.delete(id);
  }
}