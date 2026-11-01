import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../../users/repositories/users.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: any) {
    try {
      console.log('JWT Payload:', payload);
      const user = await this.userRepository.findById(payload.sub);
      console.log('User from DB:', user);

      if (!user || user.is_deleted || user.is_suspended) {
        throw new UnauthorizedException('Unauthorized Access');
      }

      return {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      };

    } catch (err) {
      console.error('Validation Error:', err);
      throw err;
    }
  }
}