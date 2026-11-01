import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Questionnaire } from 'src/modules/itinerary/entities/questionnaire.entity';
import { QuestionnaireRepository } from 'src/modules/admin/repositories/questionnaire.repository';
import { FieldTypeQuestions } from 'src/modules/itinerary/entities/questionnaire.entity';
import { UserRepository } from 'src/modules/users/repositories/users.repository';

@Injectable()
export class QuestionnaireSeeder implements OnModuleInit {
  private readonly logger = new Logger(QuestionnaireSeeder.name);

  constructor(
    private readonly questionnaireRepository: QuestionnaireRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async onModuleInit() {
    const adminUser = await this.userRepository.findByEmail(process.env.ADMIN_EMAIL!);
    const adminId = adminUser?.id;

    if (!adminId) {
      this.logger.error('Admin user not found, cannot seed questions with created_by');
      return;
    }

    const existing = await this.questionnaireRepository.find();

    if (existing && existing.length > 0) {
      this.logger.log('[Seeder] Questionnaire already exists. Skipping.');
      return;
    }

    const questions: Partial<Questionnaire>[] = [
      {
        question_text: 'What is your travel destination?',
        field_type: FieldTypeQuestions.TEXT,
        options: undefined,
        is_default: true,
        created_by: adminUser.id,
        image_url:'https://res.cloudinary.com/dtgrtcukc/image/upload/v1748875790/Wayventures_Images/pmm3rqvpw6siwxnurloy.jpg'
      },
      {
        question_text: 'Which country are you visiting?',
        field_type: FieldTypeQuestions.TEXT,
        options: undefined,
        is_default: true,
        created_by: adminUser.id,
        image_url:'https://res.cloudinary.com/dtgrtcukc/image/upload/v1748875915/Wayventures_Images/bvth7i5yhahkgsvqs59b.jpg'
      },
      {
        question_text: 'How many days do you plan to travel?',
        field_type: FieldTypeQuestions.DROPDOWN,
        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        is_default: true,
        created_by: adminUser.id,
        image_url:'https://res.cloudinary.com/dtgrtcukc/image/upload/v1748876006/Wayventures_Images/qoiybz1le9e0od9qnp1q.jpg'
      },
      {
        question_text: 'What type of traveler are you?',
        field_type: FieldTypeQuestions.MULTI_SELECT,
        options: [
          'Nature Lover',
          'Adventure Seeker',
          'Culture Enthusiast',
          'Relaxation & Wellness Traveler',
          'Food Explorer',
        ],
        is_default: true,
        created_by: adminUser.id,
        image_url:'https://res.cloudinary.com/dtgrtcukc/image/upload/v1748876050/Wayventures_Images/iz0cgjwlxuecwxubhkse.jpg'
      },
      {
        question_text: 'What is your preferred accommodation type?',
        field_type: FieldTypeQuestions.DROPDOWN,
        options: [
          'Hostel',
          'Budget Hotel',
          '3–4 Star Hotel',
          '5-Star Resort',
          'Luxury Stay',
          'Villa',
        ],
        is_default: true,
        created_by: adminUser.id,
        image_url:'https://res.cloudinary.com/dtgrtcukc/image/upload/v1748876086/Wayventures_Images/o8e6agnnmlvbfsjdja9f.jpg'
      },
      {
        question_text: 'Any dietary preferences we should consider?',
        field_type: FieldTypeQuestions.MULTI_SELECT,
        options: [
          'Vegetarian',
          'Vegan',
          'Non-Vegetarian',
          'Gluten-Free',
          'Jain',
          'No preference',
        ],
        is_default: true,
        created_by: adminUser.id,
        image_url:'https://res.cloudinary.com/dtgrtcukc/image/upload/v1748876113/Wayventures_Images/rbsrdal0wug8nuhdsv52.jpg'
      },
      {
        question_text: 'Which types of activities would you like to include in your trip?',
        field_type: FieldTypeQuestions.MULTI_SELECT,
        options: [
          'Wildlife & Nature Parks',
          'Trekking/Hiking',
          'Historical Monuments & Culture',
          'Beach & Water Activities',
          'Food & Culinary Experiences',
          'Spa & Wellness',
          'Local Markets & Shopping',
          'Adventure Sports (e.g., rafting, paragliding)',
        ],
        is_default: true,
        created_by: adminUser.id,
        image_url:'https://res.cloudinary.com/dtgrtcukc/image/upload/v1748876229/Wayventures_Images/vhurn4fimeihdg53p6pr.jpg'
      },
      {
        question_text: 'How would you like your daily itinerary pace to be?',
        field_type: FieldTypeQuestions.DROPDOWN,
        options: [
          'Relaxed (3–4 activities per day)',
          'Balanced (4–5 activities per day)',
          'Packed (6 activities per day)',
        ],
        is_default: true,
        created_by: adminUser.id,
        image_url:'https://res.cloudinary.com/dtgrtcukc/image/upload/v1748876258/Wayventures_Images/i40m773ze8bv6qr2nexs.jpg'
      },
      {
        question_text: 'Do you have a preferred mode of local transport?',
        field_type: FieldTypeQuestions.DROPDOWN,
        options: [
          'Private Car',
          'Self-drive Rental',
          'Public Transport',
          'Bicycle',
          'No Preference',
        ],
        is_default: true,
        created_by: adminUser.id,
        image_url:'https://res.cloudinary.com/dtgrtcukc/image/upload/v1748876328/Wayventures_Images/fsyuft10vgcqw9kjc5uo.jpg'
      },
      {
        question_text: 'Any specific dates for your travel?',
        field_type: FieldTypeQuestions.DATE,
        options: undefined,
        is_default: true,
        created_by: adminUser.id,
        image_url:'https://res.cloudinary.com/dtgrtcukc/image/upload/v1748876349/Wayventures_Images/gtcbpd8n5zeb1npp3zen.jpg'
      },
      {
        question_text: "Mention any special interests, needs, or restrictions you'd like us to know about?",
        field_type: FieldTypeQuestions.TEXT,
        options: undefined,
        is_default: true,
        created_by: adminUser.id,
        image_url:'https://res.cloudinary.com/dtgrtcukc/image/upload/v1748876367/Wayventures_Images/zttqzrvepmwtiukmccrp.jpg'
      },
      {
        question_text: 'Are there any activities you want to avoid?',
        field_type: FieldTypeQuestions.MULTI_SELECT,
        options: [
          'Nightlife/Clubs',
          'Crowded Places',
          'Long Travel Hours',
          'Adventure Sports',
          'None',
        ],
        is_default: true,
        created_by: adminUser.id,
        image_url:'https://res.cloudinary.com/dtgrtcukc/image/upload/v1748876416/Wayventures_Images/gmqmnqy1bilweprszcgo.jpg'
      },
      {
        question_text: 'Would you like to include nearby hidden gems or offbeat places?',
        field_type: FieldTypeQuestions.DROPDOWN,
        options: ['Yes, I love exploring hidden spots', 'No, prefer popular attractions'],
        is_default: true,
        created_by: adminUser.id,
        image_url:'https://res.cloudinary.com/dtgrtcukc/image/upload/v1748876438/Wayventures_Images/rjnf7crx7slbyd7r1exs.jpg'
      },
    ];

    await this.questionnaireRepository.save(questions);
    this.logger.log('[Seeder] Questionnaire seeded successfully.');
  }
}
