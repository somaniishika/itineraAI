import { BadRequestException, Injectable,InternalServerErrorException,Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserFeatureBalance } from './entities/users-feature-balance.entity';
import { User } from '../users/entities/users.entity';
import { FeatureCreditResponseDto } from './dtos/feature-credit-response.dto';
import { FeaturePriceRepository } from './repositories/feature-price.repository';
import { FeaturePriceDto } from './dtos/set-feature-price.dto';
import { FeatureCategory, FeatureCreditDto } from '../payment/dto/create-order.dto';
import { PaymentServiceMessages } from '../payment/constants/payment.messages';
import { FeaturePriceMessages } from './constants/feature-management.messages';
import { FeatureType } from 'src/common/utils/feature-type.enum';

@Injectable()
export class FeatureManagementService {
  private readonly logger = new Logger(FeatureManagementService.name);
 constructor(
    @InjectRepository(UserFeatureBalance)
    private readonly userFeatureBalanceRepository: Repository<UserFeatureBalance>,

    private readonly featurePriceRepository: FeaturePriceRepository,
    private readonly dataSource: DataSource,
  ) {}

  async grantInitialItineraryCredits(userId: number, credits: number): Promise<boolean> {
    return this.dataSource.transaction(async (manager) => {
      const users = manager.getRepository(User);
      const user = await users.findOne({
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!user || user.role !== 'USER' || user.free_itinerary_credits_granted) {
        return false;
      }

      user.free_itinerary_credits_granted = true;
      await users.save(user);

      const balances = manager.getRepository(UserFeatureBalance);
      let balance = await balances.findOne({
        where: { user_id: userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!balance) {
        balance = balances.create({ user_id: userId, feature_balances: {} });
      }

      const featureBalances = balance.feature_balances ?? {};
      featureBalances.ITINERARY = (Number(featureBalances.ITINERARY) || 0) + credits;
      balance.feature_balances = featureBalances;
      await balances.save(balance);

      return true;
    });
  }

  async creditFeatureToUser(userId: number, featureType: string, credits: number): Promise<void> {
  let existingBalance = await this.userFeatureBalanceRepository.findOne({
    where: { user_id: userId },
  });

  if (existingBalance) {
    existingBalance.feature_balances[featureType] =
      (existingBalance.feature_balances[featureType] || 0) + credits;
  } else {
    const newBalance = this.userFeatureBalanceRepository.create({
      user_id: userId,
      feature_balances: {
        [featureType]: credits,
      },
    });
    existingBalance = newBalance;
  }

  await this.userFeatureBalanceRepository.save(existingBalance);
  }
  
  async creditMultipleFeaturesToUser(userId: number, featureCredits: Record<string, number>): Promise<void> {
    let existingBalance = await this.userFeatureBalanceRepository.findOne({
      where: { user_id: userId },
    });
  
    if (existingBalance) {
      for (const featureType in featureCredits) {
        existingBalance.feature_balances[featureType] =
          (existingBalance.feature_balances[featureType] || 0) + featureCredits[featureType];
      }
    } else {
      const newBalance = this.userFeatureBalanceRepository.create({
        user_id: userId,
        feature_balances: featureCredits,
      });
      existingBalance = newBalance;
    }
  
    await this.userFeatureBalanceRepository.save(existingBalance);
  }
  

async getFeatureCredits(userId: number): Promise<FeatureCreditResponseDto> {
  const featureList = ['ITINERARY', 'BUDGET_PLAN', 'PACKING_LIST', 'CUSTOM_ITINERARY', 'TRIP_GUIDE','EMERGENCY_CONTACT'];

  const balanceRecord = await this.userFeatureBalanceRepository.findOne({
    where: { user_id: userId },
  });

  console.log('Balance Record:', balanceRecord);  

  const feature_balances: Record<string, number> = {};

  for (const feature of featureList) {
    feature_balances[feature] = balanceRecord?.feature_balances?.[feature] || 0;
  }

  return {
    user_id: userId,
    feature_balances,
  };
}

async getFeaturePriceByType( featureType?: FeatureType): Promise<
  | { featureType: string; priceAmount: number; currency: string }
  | Array<{ featureType: string; priceAmount: number; currency: string }>
> {
  if (featureType) {
    const price = await this.featurePriceRepository.findByFeatureType(featureType);

    if (!price) {
      this.logger.warn(`Feature price not found for type: ${featureType}`);
      throw new Error(FeaturePriceMessages.PRICE_NOT_FOUND);
    }

    return {
      featureType: price.featureType,
      priceAmount: Number(price.priceAmount),
      currency: price.currency,
    };
  }
  const prices = await this.featurePriceRepository.findAll();

  return prices.map((price) => ({
    featureType: price.featureType,
    priceAmount: Number(price.priceAmount),
    currency: price.currency,
  }));
}

async decrementUserFeatureCredit(userId: number, featureType: string) {
  const balanceRecord = await this.userFeatureBalanceRepository.findOne({
    where: { user_id: userId },
  });

  if (!balanceRecord || !balanceRecord.feature_balances[featureType]) {
    throw new Error(`No balance available for feature type: ${featureType}`);
  }

  if (balanceRecord.feature_balances[featureType] <= 0) {
    throw new Error(`Insufficient credits for feature type: ${featureType}`);
  }

  balanceRecord.feature_balances[featureType] -= 1;

  await this.userFeatureBalanceRepository.save(balanceRecord);
}

  async setOrUpdateFeaturePrice(dto: FeaturePriceDto): Promise<void> {
    const { featureType, priceAmount, currency = 'INR' } = dto;

    if (!priceAmount || priceAmount < 0) {
      this.logger.warn(`Invalid price amount provided for ${featureType}: ${priceAmount}`);
      throw new BadRequestException(FeaturePriceMessages.BAD_REQUEST);
    }

    try {
      const existing = await this.featurePriceRepository.findOne({ where: { featureType } });

      if (existing) {
        existing.priceAmount = priceAmount;
        existing.currency = currency;
        await this.featurePriceRepository.save(existing);
        this.logger.log(`Updated feature price for ${featureType}`);
      } else {
        const newFeature = this.featurePriceRepository.create({
          featureType,
          priceAmount,
          currency,
        });

        await this.featurePriceRepository.save(newFeature);
        this.logger.log(`Created feature price for ${featureType}`);
      }
    } catch (err) {
      this.logger.error(`DB error while setting feature price for ${featureType}`, err);
      throw new InternalServerErrorException(FeaturePriceMessages.UPDATE_FAILED);
    }
  }


  async calculateOrderAmount(featureCredits: FeatureCreditDto[]) {
    const prices = await this.featurePriceRepository.findActiveFeaturePrices();

    if (!prices.length) {
      throw new Error(PaymentServiceMessages.NO_ACTIVE_PRICING);
    }

    console.log(`debug#############111`, prices);

    // convert to a quick lookup map: { ITINERARY: 10, BUDGET_PLAN: 5, ... }
    const priceMap = prices.reduce((acc, price) => {
      acc[price.featureType] = {
        priceAmount: Number(price.priceAmount),
        currency: price.currency,
      };
      return acc;
    }, {} as Record<FeatureCategory, { priceAmount: number; currency: string }>);

    console.log(`debug#############222`, priceMap);

    let totalAmount = 0;
    let currency = '';
    const breakdown: any = [];

    for (const item of featureCredits) {
      const pricing = priceMap[item.feature];
      if (!pricing) {
        throw new Error(PaymentServiceMessages.PRICING_NOT_CONFIGURED(item.feature));
      }

      const featureTotal = pricing.priceAmount * item.credits;
      totalAmount += featureTotal;
      currency = pricing.currency; // assuming all are in same currency for now

      breakdown.push({
        feature: item.feature,
        credits: item.credits,
        pricePerCredit: pricing.priceAmount,
        total: featureTotal,
      });
    }

    return {
      totalAmount,
      currency,
      breakdown,
    };
  }
}