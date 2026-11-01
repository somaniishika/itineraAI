import { MS_PER_DAY,MIN_MONTHLY_DAYS,MIN_YEARLY_DAYS} from '../utils/date-range-calculation';
import { AnalyticsMessages } from '../constants/analytics.service.messages';

export function validateDateRangeForAnalytics(
  type: 'monthly' | 'yearly' | undefined,
  startDate?: string,
  endDate?: string,
) {
  if (!startDate || !endDate) return;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const now= new Date();

  if (end > now|| start > now){
    throw new Error(AnalyticsMessages.DATE_IN_FUTURE);
  }
  
  if (start > end) {
    throw new Error(AnalyticsMessages.START_AFTER_END);
  }

  const diffDays = Math.floor((end.getTime() - start.getTime()) / MS_PER_DAY);

  switch (type) {
    case 'monthly':
    case undefined:
      if (diffDays+1 < MIN_MONTHLY_DAYS) {
        throw new Error(
          AnalyticsMessages.MONTHLY_DATE_RANGE_TOO_SHORT,
        );
      }
      break;

    case 'yearly':
      if (diffDays+1 < MIN_YEARLY_DAYS) {
        throw new Error(
          AnalyticsMessages.YEARLY_DATE_RANGE_TOO_SHORT,
        );
      }
      break;
  }
}
