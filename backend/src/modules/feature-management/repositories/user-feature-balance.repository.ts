import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserFeatureBalance } from '../entities/users-feature-balance.entity';

@Injectable()
export class UserFeatureBalanceRepository extends Repository<UserFeatureBalance> {
  constructor(private dataSource: DataSource) {
    super(UserFeatureBalance, dataSource.createEntityManager());
  }

  async getFeatureBalancesByUsername(username: string) {
    return this.createQueryBuilder('ufb')
      .leftJoinAndSelect('ufb.user', 'user')
      .where('user.username = :username', { username })
      .select([
        'ufb.feature_name',
        'ufb.itinerary_id',
        'ufb.credit_balance',
        'user.username',
      ])
      .getMany();
  }

  async getAllBalancesByUserId(userId: number) {
    return this.find({
      where: { user_id: userId },
      order: { updated_at: 'DESC' },
    });
  }

 

}
