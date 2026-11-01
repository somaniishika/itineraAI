import {Controller,Post,Body,Delete,Param,Get,Res,HttpStatus,ParseIntPipe,UseGuards,BadRequestException,InternalServerErrorException,NotFoundException} from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dtos/create-faq.dto';
import { Response } from 'express';
import { FaqServiceMessages } from './constants/faq.messages';
import { CreateFaqSwaggerDocs } from './decorators/swagger/create-faq.swagger';
import { DeleteFaqSwaggerDocs} from './decorators/swagger/delete-faq.swagger'
import { GetAllFaqsSwaggerDocs} from './decorators/swagger/get-faq.swagger'
import { ApiTags,ApiBearerAuth} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
  @ApiTags('FAQs')
  @Controller('faqs')
  @ApiBearerAuth('access-token')
  export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
   @CreateFaqSwaggerDocs()
   async create(@Body() createFaqDto: CreateFaqDto, @Res() res: Response) {
    try {
      const faq = await this.faqService.createFaq(createFaqDto);
      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: FaqServiceMessages.CREATE_SUCCESS,
        data: faq,
      });
    } catch (error) {
      const message = error?.message;

      switch (message) {
          case FaqServiceMessages.INTERNAL_CREATE_FAIL:
          case FaqServiceMessages.INTERNAL_UPDATE_FAIL:
          throw new InternalServerErrorException(message);

        default:
          throw new InternalServerErrorException(FaqServiceMessages.UNEXPECTED_ERROR);
      }
    }
  }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @DeleteFaqSwaggerDocs()
    async delete(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      await this.faqService.deleteFaq(id);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: FaqServiceMessages.DELETE_SUCCESS,
      });
    } catch (error) {
      const message = error?.message;

      switch (message) {
        case FaqServiceMessages.FAQ_NOT_FOUND(id):
          throw new NotFoundException(message);

        default:
          throw new InternalServerErrorException(FaqServiceMessages.UNEXPECTED_ERROR);
      }
    }
  }

  
    @Get()
    @UseGuards(JwtAuthGuard)
    @GetAllFaqsSwaggerDocs()
    async getAll(@Res() res: Response) {
    try {
      const faqs = await this.faqService.getAllFaqs();
      return res.status(HttpStatus.OK).json({
        success: true,
        message: FaqServiceMessages.FETCH_SUCCESS,
        data: faqs,
      });
    } 
    catch (error) {
      throw new InternalServerErrorException(FaqServiceMessages.UNEXPECTED_ERROR);
    }
    }
  }
  