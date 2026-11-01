import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse,ApiNotFoundResponse,ApiBadRequestResponse, ApiBody,ApiUnauthorizedResponse,ApiForbiddenResponse,ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { FeatureInputDto } from '../../dto/feature-input-dto';

export function PerformItineraryFeatureSwagger() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Trigger feature on an Itinerary (Budget, Custom or Packing List)',
      description:
        'Performs features (like Budget Planning, Custom Enhancements, Packing List Generation) on an existing itinerary based on user input.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      required: true,
      description: 'Itinerary ID to which the feature is to be applied',
      example: 12,
    }),
    ApiBody({
      description: 'Specify the feature type and required inputs.',
      type: FeatureInputDto,
      examples: {
        budget: {
          summary: 'Budget Planning Request',
          description:
            'Get a detailed day-wise budget plan for your itinerary.',
          value: {
            type: 'BUDGET_PLAN',
            inputs: {
              number_of_people: 2,
              budget_type: 'Standard',
              starting_location: 'Mumbai',
            },
          },
        },
        custom: {
          summary: 'Custom Enhancement Request',
          description: 'Enhance your itinerary with custom preferences.',
          value: {
            type: 'CUSTOM_ITINERARY',
            inputs: {
              trip_duration: null,
              preferences: ['adventure', 'food', 'local culture'],
              day_wise_customizations: [
                {
                  day: 2,
                  general_instructions:
                    'Add a morning paragliding session and remove the visit to the mall.',
                },
                {
                  day: 3,
                  general_instructions:
                    'Include a local cooking class in the evening.',
                },
              ],
              general_customizations:
                'Include more local food experiences and authentic Himachali cultural interactions.',
            },
          },
        },
        packing_list: {
          summary: 'Packing List Request',
          description:
            'Generate a customized packing list based on traveler details.',
          value: {
            type: 'PACKING_LIST',
            inputs: {
              travel_month: 'March',
              number_of_people: 4,
              travelers: [
                { age: 35, gender: 'male' },
                { age: 34, gender: 'female' },
                { age: 7, gender: 'male' },
                { age: 5, gender: 'female' },
              ],
              luggage_type: 'Backpack',
              special_items: ['camera', 'power bank'],
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Feature operation performed successfully.',
      content: {
        'application/json': {
          examples: {
            budget: {
              summary: 'Budget Planning Success',
              value: {
                message: 'Budget planning completed successfully.',
                featureType: 'budget',
                data: {
                  daily_breakdown: [
                    {
                      day: 1,
                      title: 'Arrival & Sightseeing',
                      estimated_cost: 9000,
                      currency: 'INR',
                      activities: [
                        'Pickup - ₹1000',
                        'Hotel Stay - ₹3000',
                        'Local Tour - ₹3000',
                        'Dinner - ₹2000',
                      ],
                    },
                  ],
                  total_estimated_budget: 36000,
                  currency: 'INR',
                  budget_utilization: '90%',
                  savings_suggestions: [
                    'Consider budget hotels for saving ₹4000',
                    'Use shared transportation',
                  ],
                },
              },
            },
            custom: {
              summary: 'Custom Enhancement Success',
              value: {
                message: 'Custom itinerary enhancement completed successfully.',
                featureType: 'custom',
                data: {
                  enhanced_itinerary: {
                    title: 'Adventurous Foodie Solo Trip to Manali',
                    duration: '4 days',
                    customizations_applied: [
                      'Included food tours and local cultural spots',
                      'Adventure activities like paragliding',
                    ],
                    daily_plan: [
                      {
                        day: 1,
                        theme: 'Local Cuisine & Markets',
                        activities: [
                          {
                            time: '10:00 AM',
                            activity: 'Old Manali Café Walk',
                            type: 'food',
                          },
                          {
                            time: '2:00 PM',
                            activity: 'Explore Tibetan Market',
                            type: 'culture,shopping',
                          },
                        ],
                      },
                    ],
                  },
                },
              },
            },
            packing: {
              summary: 'Packing List Generation Success',
              value: {
                message: 'Packing list generated successfully.',
                featureType: 'packing_list',
                data: {
                  packing_list: {
                    title: '10-Day Packing List for Kedarnath in March',
                    categories: [
                      {
                        category: 'Clothing',
                        highlights: [
                          'Thermals, fleece, warm socks, hiking gear, waterproof clothing, boots, nightwear',
                        ],
                      },
                      {
                        category: 'Toiletries & Personal Care',
                        highlights: [
                          'Sunscreen, lip balm, soap, wipes, personal meds, menstrual products',
                        ],
                      },
                      {
                        category: 'Electronics',
                        highlights: [
                          'Phone, chargers, power bank, flashlight, camera',
                        ],
                      },
                      {
                        category: 'Documents & Essentials',
                        highlights: [
                          'ID, tickets, insurance, cash/cards, reusable bottle, daypack',
                        ],
                      },
                      {
                        category: 'Miscellaneous',
                        highlights: [
                          'Backpack, snacks, first-aid, repellent, travel pillow, dry bags',
                        ],
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description:
        'Feature operation successfully initiated and is being processed.',
      content: {
        'application/json': {
          examples: {
            budget: {
              summary: 'Budget Planning Initiated',
              value: {
                message:
                  'Budget planning request has been accepted and is being processed.',
                featureType: 'budget',
                data: null,
              },
            },
            custom: {
              summary: 'Custom Enhancement Initiated',
              value: {
                message:
                  'Custom enhancement request has been accepted and is being processed.',
                featureType: 'custom',
                data: null,
              },
            },
            packing: {
              summary: 'Packing List Generation Initiated',
              value: {
                message:
                  'Packing list request has been accepted and is being processed.',
                featureType: 'packing_list',
                data: null,
              },
            },
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Bad Request',
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-06-05T15:55:01.814Z',
              path: '/itinerary/feature/9',
              error: 'Expected double-quoted property name in JSON at position 104',
            },
          },
          {
            example: {
              timestamp: '2025-06-05T15:55:26.302Z',
              path: '/itinerary/feature/9',
              error: [
                'type must be one of the following values: BUDGET_PLAN, CUSTOM_ITINERARY, PACKING_LIST',
              ],
            },
          },
          {
            example: {
              timestamp: '2025-06-05T16:08:44.230Z',
              path: '/itinerary/feature/9',
              error: 'Max limit can not exceed 8',
            },
          },
          {
            example: {
              timestamp: '2025-06-05T16:10:20.421Z',
              path: '/itinerary/feature/9',
              error: 'Max limit for number of people in PACKING_LIST can not exceed 8',
            },
          },
        ],
      },
    }),
    ApiNotFoundResponse({
      description: 'Error: Not Found',
      schema: {
        example: {
          timestamp: '2025-06-05T15:50:40.436Z',
          path: '/itinerary/feature/99',
          error: 'Itinerary with given ID not found',
        },
      },
    }),
  
    ApiUnauthorizedResponse({
      description: 'Error: Unauthorized',
      schema: {
        example: {
          timestamp: '2025-06-05T15:41:53.158Z',
          path: '/itinerary/feature/12',
          error: 'Unauthorized',
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Error: Forbidden',
      schema: {
        oneOf:[
        {
          example:
          {
           timestamp: '2025-06-05T15:42:32.406Z',
           path: '/itinerary/feature/12',
           error: 'ADMIN:  You do not have access to this resource.',
         },
         
       },{

        example:
          {
           timestamp: '2025-06-05T15:42:32.406Z',
           path: '/itinerary/feature/12',
           error: 'You have no remaining credits for budget planning',
         },
       },
       {

        example:
          {
           timestamp: '2025-06-05T15:42:32.406Z',
           path: '/itinerary/feature/12',
           error: 'You have no remaining credits for custom itinerary planning',
         },
       },
       {

        example:
          {
           timestamp: '2025-06-05T15:42:32.406Z',
           path: '/itinerary/feature/12',
           error: 'YYou have no remaining credits for packing list',
         },
       }

      ]
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Error: Internal Server Error',
      schema: {
        oneOf:[
          {
          example: {
            timestamp: '2025-06-05T15:42:49.051Z',
            path: '/itinerary/feature/12',
          },
        },
        {
          example: {
            timestamp: '2025-06-05T15:42:49.051Z',
            path: '/itinerary/feature/12',
            error:'Invalid AI response structure'
          },
        },
        {
          example: {
            timestamp: '2025-06-05T15:42:49.051Z',
            path: '/itinerary/feature/12',
            error:'Failed to parse AI response'
          },
        },
        {
          example: {
            timestamp: '2025-06-05T15:42:49.051Z',
            path: '/itinerary/feature/12',
            error:'Failed to generate custom itinerary. Please try again.'
          },
        },
      ]
      },
    }),
  );
}
