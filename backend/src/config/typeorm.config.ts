import { Otp } from '../modules/otp/entities/otp.entity';
import { EmergencyContact } from '../modules/emergency/entities/emergency-contact.entity';
import { Faq } from '../modules/faq/entities/faq.entity';
import { FeaturePrice } from '../modules/feature-management/entities/feature-price.entity';
import { Feedback } from '../modules/feedback/entities/feedback.entity';
import { ItineraryFeature } from '../modules/itinerary/entities/itinerary-feature.entity';
import { Itinerary } from '../modules/itinerary/entities/itinerary.entity';
import { Questionnaire } from '../modules/itinerary/entities/questionnaire.entity';
import { FeatureOrder } from '../modules/payment/entities/feature-order.entity';
import { Payment } from '../modules/payment/entities/payment.entity';
import { TripLengthGuide } from '../modules/trip-guide/entities/trip-length-guide.entity';
import { ApiAuditLog } from '../modules/users/entities/api-audit-log.entity';
import { SuspensionRequest } from '../modules/users/entities/suspension-request.entity';
import { UserFeatureBalance } from '../modules/feature-management/entities/users-feature-balance.entity';
import { User } from '../modules/users/entities/users.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { Image } from '../modules/image/entities/image.entity';

dotenv.config();

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    User,
    Questionnaire,
    Otp,
    FeaturePrice,
    UserFeatureBalance,
    Payment,
    Itinerary,
    ItineraryFeature,
    TripLengthGuide,
    EmergencyContact,
    Feedback,
    Faq,
    SuspensionRequest,
    FeatureOrder,
    ApiAuditLog,
    Image
  ],
  synchronize: false, // will change this when it goes to main branch (Production)
  migrations: [__dirname + '/../database/migrations/*.{ts,js}'],
  // ssl: {
  //   rejectUnauthorized: false,
  // },
  extra: {
    max: 3,
  },
};

export const AppDataSource = new DataSource(typeOrmConfig);
