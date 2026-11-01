  import {Controller,Put,Delete,Get,Body,Req,Res,Logger, UseGuards,HttpStatus,BadRequestException,NotFoundException,UnauthorizedException,InternalServerErrorException} from '@nestjs/common';
  import { Response, Request } from 'express';
  import { UpdateProfileDto } from './dto/update-profile.dto';
  import { DeleteDto } from './dto/confirm-delete.dto';
  import { ChangePasswordDto } from './dto/change-password.dto';
  import { UserService } from './users.service';
  import {ApiTags,ApiBearerAuth} from '@nestjs/swagger';
  import { SwaggerUpdateUser } from './decorators/swagger/user-update.swagger';
  import { SwaggerDeleteUser } from './decorators/swagger/delete-user.swagger';
  import { SwaggerChangePassword } from './decorators/swagger/change-password.decorator';
  import { SwaggerGetProfile } from './decorators/swagger/get-profile.decorator';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  import { UserMessages } from './constants/user-messages.constant';
  import { AuthRequest } from '../auth/interfaces/auth-request.interface';


@ApiTags('Profile')
@Controller('users')
@ApiBearerAuth('access-token')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) { }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @SwaggerGetProfile()
  async getProfile(@Req() req: AuthRequest, @Res() res: Response) {
    const userId = req.user.id;
    this.logger.log(`Fetching profile for user ID: ${userId}`);

    try {
      const user = await this.userService.getProfileDetail(userId);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: UserMessages.PROFILE_FETCHED,
        data: user,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching profile for user ID ${userId}: ${error.message}`,
        error.stack,
      );
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: UserMessages.PROFILE_FETCH_FAILED,
      });
    }
  }


  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @SwaggerUpdateUser()
  async updateProfile(
  @Body() updateDto: UpdateProfileDto,
  @Req() req: AuthRequest,
  @Res() res: Response,
) {
  const userId = req.user.id;
  try {
    const updated = await this.userService.updateProfile(userId, updateDto);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: UserMessages.PROFILE_UPDATED,
      data: updated,
    });
  } catch (error) {
    const message = error?.message;

    switch (message) {
      case UserMessages.USER_NOT_FOUND:
        throw new NotFoundException(message);

      case UserMessages.USERNAME_ALREADY_EXISTS:
        throw new BadRequestException(message);

      case UserMessages.NO_CHANGES_PROVIDED:
        throw new BadRequestException(message);

      default:
        throw new InternalServerErrorException(UserMessages.UNEXPECTED_ERROR);
    }
  }
}

  @Delete()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @SwaggerDeleteUser()
 async deleteUser(@Body() dto: DeleteDto, @Req() req: AuthRequest, @Res() res: Response) {
  const userId = req.user.id;

  try {
    await this.userService.deleteUser(userId, dto.password);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: UserMessages.USER_DELETED_SUCCESS,
    });
  } catch (error) {
    const message = error?.message;

    switch (message) {
      case UserMessages.USER_NOT_FOUND:
        throw new NotFoundException(message);

      case UserMessages.INVALID_PASSWORD:
        throw new UnauthorizedException(message);

      default:
        throw new InternalServerErrorException(UserMessages.UNEXPECTED_ERROR);
    }
  }
}

  @Put('change-password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @SwaggerChangePassword()
  async changePassword(
    @Req() req: AuthRequest,
    @Body() dto: ChangePasswordDto,
    @Res() res: Response,
  ) {
    const userId = req.user.id;
    this.logger.log(`Changing password for user ID: ${userId}`);

    try {
      await this.userService.updatePassword(userId, dto.currentPassword, dto.newPassword);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: UserMessages.PASSWORD_CHANGED,
      });
    } catch (error) {
      this.logger.error(
        `Error changing password for user ID ${userId}: ${error.message}`,
        error.stack,
      );
      const message = error?.message;
      switch(message){
        case UserMessages.USER_NOT_FOUND:
        throw new NotFoundException(message);

        case UserMessages.INCORRECT_CURRENT_PASSWORD:
        throw new UnauthorizedException(message);

        case UserMessages.NEW_PASSWORD_SAME_AS_OLD:
        throw new BadRequestException(message);
        
        case UserMessages.PASSWORD_NOT_SET:
        case UserMessages.PASSWORD_UPDATE_FAILED:
        throw new InternalServerErrorException(message);

        default:
        throw new InternalServerErrorException(UserMessages.UNEXPECTED_ERROR);
      }
    }
  }
}
