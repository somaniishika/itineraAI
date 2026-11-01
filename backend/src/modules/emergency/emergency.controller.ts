import {Body,Controller,HttpStatus,InternalServerErrorException,NotFoundException,Post,Req,Res,UseGuards,} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { EmergencyService } from './emergency.service';
import { GetEmergencyContactsDto } from './dto/get-emergency-contact.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetEmergencyContactsSwagger } from './decorators/swagger/emergency-contacts.decorator';
import { EmergencyServiceMessages } from './constants/emergency.messages';

@ApiTags('Emergency Services')
@Controller('emergency-details')
export class EmergencyController {
  constructor(private readonly emergencyService: EmergencyService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @GetEmergencyContactsSwagger()
  async getEmergencyContacts(
    @Body() dto: GetEmergencyContactsDto,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const userId = Number(req.user?.id);

    try {
      const contacts = await this.emergencyService.getOrGenerateEmergencyContacts(userId, dto);

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: EmergencyServiceMessages.CONTACTS_SUCCESS,
        data: contacts,
      });
    } catch (error) {
      const message = error.message;
      console.error('Emergency Contact Error:', message);

      switch (message) {
        case EmergencyServiceMessages.USER_NOT_FOUND:
          throw new NotFoundException(message);

        case EmergencyServiceMessages.FAILED_TO_GENERATE_CONTACTS:
        case EmergencyServiceMessages.AI_API_FAILURE:
          throw new InternalServerErrorException(message);

        default:
          throw new InternalServerErrorException(EmergencyServiceMessages.GENERIC_ERROR);
      }
    }
  }
}
