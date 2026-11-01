import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OtpModule } from '../otp/otp.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { FeatureManagementModule } from '../feature-management/feature-management.module';
import { SendGridModule } from '../provider/sendgrid/sendgrid.module';

@Module({
  imports: [UsersModule,OtpModule,FeatureManagementModule,SendGridModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION || '1h' },
    }),],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy,GoogleStrategy],
  exports:[JwtStrategy,GoogleStrategy]
})
export class AuthModule {}