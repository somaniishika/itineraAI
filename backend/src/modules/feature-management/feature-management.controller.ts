import { Controller, Get, Req, UseGuards, Res, HttpStatus, Query, Post, Body, HttpException, Put, ParseEnumPipe, NotFoundException, BadRequestException, InternalServerErrorException, ForbiddenException, } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { FeatureManagementService } from './feature-management.service';
import { SwaggerGetFeatureCredits } from './decorators/swagger/get-feature-credits.decorator';
import { GetFeaturePriceSwagger } from './decorators/swagger/get-feature-price.decorator';
import { FeatureManagementMessages, FeaturePriceMessages, } from './constants/feature-management.messages';
import { GetFeaturePriceDto } from './dtos/get-feature-price.dto';
import { FeaturePriceDto } from './dtos/set-feature-price.dto';
import { FeaturePriceRepository } from './repositories/feature-price.repository';
import { SwaggerUpdateFeaturePrices } from './decorators/swagger/set-feature-prices.decorator';
import { FeatureType } from 'src/common/utils/feature-type.enum';

@ApiTags('Feature Management')
@ApiBearerAuth('access-token')
@Controller()
export class FeatureManagementController {
  constructor(
    private readonly featureManagementService: FeatureManagementService,
    private readonly featurePriceRepository: FeaturePriceRepository,
  ) { }

  @Get('feature-credits')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @SwaggerGetFeatureCredits()
  async getFeatureCredits(@Req() req: Request, @Res() res: Response): Promise<Response> {
    try {
      const user = req.user as any;
      const result = await this.featureManagementService.getFeatureCredits(user.id);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: FeatureManagementMessages.GET_CREDITS_SUCCESS,
        data: result,
      });
    } catch (error) {
      const message = error.message;

      switch (message) {
        case FeatureManagementMessages.INVALID_REQUEST:
          throw new BadRequestException(message);
        case FeatureManagementMessages.ACCESS_DENIED:
          throw new ForbiddenException(message);
        default:
          throw new InternalServerErrorException(
            message || FeatureManagementMessages.INTERNAL_SERVER_ERROR,
          );
      }
    }
  }

  @Get('feature-prices')
  @UseGuards(JwtAuthGuard)
  @GetFeaturePriceSwagger()
  async getFeaturePrice(
    @Query() dto: GetFeaturePriceDto,
    @Res() res: Response,) 
  {
    try {
      const data = await this.featureManagementService.getFeaturePriceByType(dto.type);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: FeaturePriceMessages.FETCH_SUCCESS,
        data,
      });
    } catch (error) {
      const message = error?.message;
  
      switch (message) {
        case FeaturePriceMessages.PRICE_NOT_FOUND:
        throw new NotFoundException(message);
        
        default:
        throw new InternalServerErrorException(FeaturePriceMessages.UNEXPECTED_ERROR);
      }
    }
  }


  @Put('feature-prices')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @SwaggerUpdateFeaturePrices()
  async updateSingleFeaturePrice(
    @Query('featureType', new ParseEnumPipe(FeatureType)) featureType: FeatureType,
    @Body() body: Omit<FeaturePriceDto, 'featureType'>,
  ) {
    const dto: FeaturePriceDto = {
      ...body,
      featureType,
    };

    try {
      await this.featureManagementService.setOrUpdateFeaturePrice(dto);
      return {
        success: true,
        message: FeaturePriceMessages.SET_SUCCESS,
      };
    } catch (error) {
      const message = error?.message;

      switch (message) {
        case FeaturePriceMessages.NOT_FOUND:
          throw new NotFoundException(message);

        case FeaturePriceMessages.BAD_REQUEST:
          throw new BadRequestException(message);

        case FeaturePriceMessages.UPDATE_FAILED:
          throw new InternalServerErrorException(message);

        default:
          throw new InternalServerErrorException(
            'Unexpected error occurred while updating feature price',
          );
      }
    }
  }
}