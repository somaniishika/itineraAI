import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ItineraryController } from "./itinerary.controller";
import { ItineraryService } from "./itinerary.service";
import { ItineraryRepository } from "./repositories/itinerary.repository";
import { QuestionnaireRepository } from "./repositories/questionnaire.repository";
import { Itinerary } from "./entities/itinerary.entity";
import { Questionnaire } from "./entities/questionnaire.entity";
import { AiModule } from "../provider/ai-model/ai.module";
import { SendGridModule } from "../provider/sendgrid/sendgrid.module";
import { UsersModule } from "../users/users.module";
import { FeatureManagementModule } from "../feature-management/feature-management.module";
import { ItineraryFeatureRepository } from "./repositories/itinerary-feature.repository";
import { ItineraryDirectiveService } from "./service/itinerary-directive.service";
import { BudgetDirectiveService } from "./service/budget-directive.service";
import { CustomDirectiveService } from "./service/custom-directive.service";
import { PackingListDirectiveService } from "./service/packing-directive";
import { UnsplashModule } from "../provider/unsplash/unsplash.module";

@Module({
  imports: [TypeOrmModule.forFeature([Itinerary, Questionnaire]),AiModule,SendGridModule,UsersModule,FeatureManagementModule,UnsplashModule],
  controllers: [ItineraryController],
  providers: [ItineraryService, ItineraryRepository, QuestionnaireRepository, ItineraryDirectiveService,ItineraryFeatureRepository,BudgetDirectiveService,CustomDirectiveService,PackingListDirectiveService],
  exports: [QuestionnaireRepository]
})
export class ItineraryModule {}