import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { FaqServiceMessages } from '../../constants/faq.messages';

export function GetAllFaqsSwaggerDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all FAQs',
      description: 'Fetches a list of all frequently asked questions. This endpoint is accessible to both users and admins.',
    }),
    ApiOkResponse({
      description: FaqServiceMessages.FETCH_SUCCESS,
      schema: {
        oneOf: [
          {
            example: {
              success: true,
              message: FaqServiceMessages.FETCH_SUCCESS,
              data: [
                {
                  id: 11,
                  question:
                    'I can access my other account but one of my accounts is suspended. What are the common reasons for account suspension?',
                  answer:
                    'Accounts are typically suspended for policy violations, unusual login patterns, security breaches, spam activities, or fraudulent behavior. Each account is evaluated independently based on its activity history.',
                  category: 'Account',
                  created_at: '2025-06-03T02:29:48.766Z',
                },
                {
                  id: 12,
                  question: 'Can I receive my completed itinerary via email for offline access?',
                  answer:
                    'Yes, you can email your itinerary to yourself or others directly from the platform. This allows you to access your travel plans offline, share with companions, and have a backup copy for your trip.',
                  category: 'Itinerary',
                  created_at: '2025-06-03T02:29:49.027Z',
                },
                {
                  id: 13,
                  question: 'How does the trip length recommendation feature work?',
                  answer:
                    'Our trip length guide analyzes your destination and selected activities to recommend optimal trip duration. Enter your destination and preferences to receive personalized recommendations for the ideal trip length.',
                  category: 'Planning',
                  created_at: '2025-06-03T02:29:49.301Z',
                },
                {
                  id: 14,
                  question: 'Why should I pay for your AI travel features instead of planning myself?',
                  answer:
                    'Our AI saves you 15-20 hours of research time by instantly generating personalized itineraries, optimized packing lists, and budget breakdowns. For example, planning a 10-day Europe trip manually takes weeks, but our AI delivers a comprehensive plan in minutes with local insights you might miss.',
                  category: 'Value',
                  created_at: '2025-06-03T02:29:49.569Z',
                },
                {
                  id: 15,
                  question: 'Can your Budget-Based Planning feature handle complex multi-city trips?',
                  answer:
                    'Yes, our AI allocates budgets across multiple destinations, considering varying costs between cities. For example, it will automatically assign more budget to expensive cities like London and optimize savings in cheaper destinations like Prague within the same European trip.',
                  category: 'Budget',
                  created_at: '2025-06-03T02:29:49.830Z',
                },
                {
                  example: {
                    success: true,
                    message: FaqServiceMessages.FETCH_SUCCESS,
                    data: [],
                  },
                },
              ],
            },
          },
        ],
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Error: Unauthorized',
      schema: {
        example: {
          timestamp: '2025-06-03T08:00:59.222Z',
          path: '/faqs',
          error: 'Unauthorized',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Error: Internal Server Error',
      schema: {
        oneOf: [
          {
            example: {
              timestamp: '2025-06-03T08:02:42.609Z',
              path: '/faqs',
            },
          },
          {
            example: {
              timestamp: '2025-06-03T08:02:42.609Z',
              path: '/faqs',
              error:FaqServiceMessages.UNEXPECTED_ERROR,
            },
          },
        ],
      },
    }),
  );
}
