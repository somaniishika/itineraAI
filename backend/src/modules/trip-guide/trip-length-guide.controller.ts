import {Controller,Post,Query,Get,Param,ParseIntPipe,Body,Req,UseGuards, UnauthorizedException} from '@nestjs/common';
import {ApiTags,ApiBearerAuth} from '@nestjs/swagger';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';
import { TripLengthGuideService } from './trip-length-guide.service';
import { CreateTripLengthGuideDto } from './dtos/create-trip-length-guide.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetItineraryDetailsSwagger } from './decorators/get-trip-length-guide.swagger';
import { GenerateTripLengthGuideSwagger } from './decorators/generate-trip-length-guide.swagger';
import { TripLengthGuideMessages } from './constants/trip-length-guide.constants';
import { GetTripLengthGuideByIdSwagger } from './decorators/get-trip-guide-by-id.swagger';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ForbiddenException,InternalServerErrorException,NotFoundException } from '@nestjs/common';
@ApiTags('Trip Length Guide')
@Controller('trip-length-guide')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class TripLengthGuideController {
  constructor(private readonly tripLengthGuideService: TripLengthGuideService) {}
  
  @Post()
  @Roles('USER')
  @GenerateTripLengthGuideSwagger()
  async generateTripLengthGuide(
    @Req() req: AuthRequest,
    @Body() dto: CreateTripLengthGuideDto,
  ) {
    try {
      const userId = req.user.id;
      const result = await this.tripLengthGuideService.generateTripLengthGuide(userId, dto);
      return {
        success: true,
        message: TripLengthGuideMessages.GENERATE_SUCCESS,
        data: result,
      };
    } catch (error) {
      const message = error?.message;

      switch (message) {
        case TripLengthGuideMessages.NO_CREDITS:
          throw new ForbiddenException(message);

        case TripLengthGuideMessages.INVALID_AI_RESPONSE:
        case TripLengthGuideMessages.PARSE_ERROR:
          throw new InternalServerErrorException(message);

        case TripLengthGuideMessages.USER_NOT_FOUND:
          throw new NotFoundException(message);

        default:
          throw new InternalServerErrorException(TripLengthGuideMessages.UNEXPECTED_ERROR);
      }
    }
  }

  @Get()
  @Roles('USER')
  @GetItineraryDetailsSwagger()
  async getUserTripLengthGuides( @Req() req: any,
      @Query() query: PaginationQueryDto,) {
    try {
      const userId = req.user.id;
      const result = await this.tripLengthGuideService.getUserTripLengthGuides(userId,query);
      return {
        success: true,
        message:TripLengthGuideMessages.FETCH_ALL_SUCCESS,
        data: result,
      };
    } catch (error) {
      console.error('Error in getUserTripLengthGuides:', error);
      throw new InternalServerErrorException(TripLengthGuideMessages.UNEXPECTED_ERROR);
    }
  }
  
  @Get(':id')
  @Roles('USER')
  @GetTripLengthGuideByIdSwagger()
  async getTripLengthGuideById(@Req() req: any,@Param('id', ParseIntPipe) id: number) {
    try {
      const userId = parseInt((req.user as any)?.id);
      const result = await this.tripLengthGuideService.getTripLengthGuideById(id,userId);
      return {
        success: true,
        message: TripLengthGuideMessages.FETCH_BY_ID_SUCCESS,
        data: result,
      };
    } catch (error) {
      if (error?.message === TripLengthGuideMessages.GUIDE_NOT_FOUND) {
        throw new NotFoundException(error.message);
      }
      if (error?.message === TripLengthGuideMessages.UNAUTHORIZED_ACCESS) {
        throw new UnauthorizedException(error.message);
      }

      throw new InternalServerErrorException(TripLengthGuideMessages.UNEXPECTED_ERROR);
    }
  }
}