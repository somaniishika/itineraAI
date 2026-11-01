import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/users.entity';
import { UserFeatureBalance } from '../feature-management/entities/users-feature-balance.entity';
import { Payment } from '../payment/entities/payment.entity';
import { GetUsersQueryDto } from './dtos/get-users-query.dto';
import { SuspensionRequestRepository } from '../users/repositories/suspension-request.repository';
import { UserRepository } from '../users/repositories/users.repository';
import { UpdateUserStatusDto } from './dtos/update-user-status.dto';
import { AdminMessages } from './constants/admin.messages';
import { GetSuspensionRequestsDto } from './dtos/get-suspension-requests.dto';
import { GetApiAuditLogDto } from './dtos/get-api-audit-log.dto';
import { ApiAuditLog } from '../users/entities/api-audit-log.entity';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UserFeatureBalance)
    private featureRepo: Repository<UserFeatureBalance>,
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    private readonly userRepository: UserRepository,
    private readonly suspensionRepo: SuspensionRequestRepository,
    @InjectRepository(ApiAuditLog)
    private readonly apiAuditLogRepo: Repository<ApiAuditLog>,
  ) { }

  async getUsers(query: GetUsersQueryDto) {
    const {
      page = 1,
      limit = 10,
      name,
      email,
      username,
      is_active,
    } = query;

    const qb = this.userRepo.createQueryBuilder('user');

    if (name) {
      qb.andWhere('user.full_name ILIKE :name', { name: `%${name}%` });
    }

    if (email) {
      qb.andWhere('user.email ILIKE :email', { email: `%${email}%` });
    }

    if (username) {
      qb.andWhere('user.username ILIKE :username', { username: `%${username}%` });
    }

    if (is_active === true) {
      qb.andWhere('user.is_suspended = :suspended', { suspended: false });
    } else if (is_active === false) {
      qb.andWhere('user.is_suspended = :suspended', { suspended: true });
    } else {
    }

    qb.orderBy('user.created_at', 'DESC');
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    const sanitizedData = data.map(({ password_hash, ...rest }) => rest);

    return {
      success: true,
      message: 'Users fetched successfully.',
      data: sanitizedData,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }



  async getFullUserDetails(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) throw new NotFoundException('User not found');

    const filteredUser = {
      id: user.id,
      full_name: user.full_name,
      username: user.username,
      email: user.email,
      address: user.address,
      role: user.role,
      is_suspended: user.is_suspended,
      email_verified: user.email_verified,
      is_deleted: user.is_deleted,
      deleted_at: user.deleted_at,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    const featureCreditsRaw = await this.featureRepo.find({
      where: { user: { id: userId } },
    });

    const featureCredits = featureCreditsRaw.map((credit) => ({
      id: credit.id,
      user_id: credit.user_id,
      feature_balances: credit.feature_balances,
      updated_at: credit.updated_at,
    }));

    const paymentsRaw = await this.paymentRepo.find({
      where: { user: { id: userId } },
      relations: ['order'],
    });

    const paymentHistory = paymentsRaw.map((payment) => ({
      id: payment.id,
      user_id: payment.user_id,
      order_id: payment.order_id,
      total_amount: payment.total_amount,
      transaction_id: payment.transaction_id,
      status: payment.status,
      payment_gateway_response: payment.payment_gateway_response,
      created_at: payment.created_at,
      order: payment.order
        ? {
            id: payment.order.id,
            order_id: payment.order.order_id,
            user_id: payment.order.user_id,
            //feature_credits: payment.order.feature_credits,
            //feature_prices: payment.order.feature_prices,
            total_amount: payment.order.total_amount,
            created_at: payment.order.created_at,
          }
        : null,
    }));

    return {
      user: filteredUser,
      featureCredits,
      paymentHistory,
    };
  }

  async suspendOrReactivateUser(
    status: string,
    dto: UpdateUserStatusDto,
  ): Promise<{ success: true; message: string }> {
    const user = await this.userRepository.findById(dto.userId);

    if (!user) {
      this.logger.warn(`User not found with ID ${dto.userId}`);
      throw new Error(AdminMessages.USER_NOT_FOUND);
    }

    if (user.role === 'ADMIN') {
      this.logger.warn(`Admin user ID ${dto.userId} cannot be suspended or reactivated`);
      throw new Error(AdminMessages.ADMIN_USER_CANNOT_BE_MODIFIED);
    }

    if (status === 'suspend') {
      if (user.is_suspended) {
        throw new Error(AdminMessages.USER_ALREADY_SUSPENDED);
      }

      user.is_suspended = true;
      await this.userRepository.save(user);
      await this.suspensionRepo.createRequest(dto.userId, dto.reason);
      this.logger.log(`User ID ${dto.userId} suspended by admin`);
      return {
        success: true,
        message: AdminMessages.USER_SUSPENDED_SUCCESS,
      };
    }

    if (status === 'reactivate') {
      if (!user.is_suspended) {
        throw new Error(AdminMessages.USER_ALREADY_ACTIVE);
      }

      user.is_suspended = false;
      await this.userRepository.save(user);

      try {
        await this.suspensionRepo.reactivateUserRequest(dto.userId);
      } catch (err) {
        if (err.message?.startsWith('SUSPENSION_REQUEST_NOT_FOUND')) {
          throw new Error(AdminMessages.SUSPENSION_REQUEST_NOT_FOUND);
        }
        throw err;
      }
      this.logger.log(`User ID ${dto.userId} reactivated by admin`);
      return {
        success: true,
        message: AdminMessages.USER_REACTIVATED_SUCCESS,
      };
    }
    throw new Error(AdminMessages.INVALID_STATUS);
  }

  async getSuspensionRequests(query: GetSuspensionRequestsDto) {
    const { page = 1, limit = 10, status } = query;
    const { data, total } = await this.suspensionRepo.findPaginatedAndFiltered(
      page,
      limit,
      status,
    );
    if (total === 0) {
      if (status) {
        throw new Error(
          AdminMessages.NOT_FOUND_WITH_STATUS(status),
        );
      }
    }
    const mappedData = data.map((req) => ({
      id: req.id,
      user_id: req.user?.id,
      username: req.user?.username,
      email: req.user?.email,
      user_request_message: req.user_request_message,
      suspension_reason: req.suspension_reason,
      status: req.status,
      suspension_date: req.created_at,
    }));

    return {
      total,
      page,
      limit,
      data: mappedData,
    };
  }

  async getApiAuditLogs(query: GetApiAuditLogDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const [data, total] = await this.apiAuditLogRepo.findAndCount({
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user'],
    });

    const filteredData = data.map((log) => ({
      id: log.id,
      user_id: log.user_id,
      status_code: log.status_code,
      feature: log.api_type, // renamed for clarity
      response_text: log.response_text,
      error_message: log.error_message,
      created_at: log.created_at,
      user: log.user
        ? {
          id: log.user.id,
          full_name: log.user.full_name,
          username: log.user.username,
          email: log.user.email,
        }
        : null,
    }));

    return {
      success: true,
      message: 'Audit logs fetched successfully',
      data: filteredData,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}