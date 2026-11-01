export const AdminMessages = {
  FETCH_USERS_SUCCESS: 'Users fetched successfully.',
  FETCH_USER_DETAIL_SUCCESS: 'User details fetched successfully.',
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_SUSPENDED: 'User is already suspended',
  USER_ALREADY_ACTIVE: 'User is already active',
  USER_SUSPENDED_SUCCESS: 'User suspended successfully',
  USER_REACTIVATED_SUCCESS: 'User reactivated successfully',
  INVALID_STATUS: "Query param 'status' must be either 'suspend' or 'reactivate'",
  UNEXPECTED_ERROR: 'An unexpected error occurred',
  FETCH_SUCCESS: 'Dashboard analytics fetched successfully.',
  FETCH_FAILURE: 'Failed to fetch dashboard analytics.',
  ADMIN_USER_CANNOT_BE_MODIFIED: 'Admin user cannot be suspended or reactivated',
  USER_ACCESS_FORBIDDEN: 'Access to user is forbidden',
  USER_VALIDATION_FAILED: 'User validation failed',
  SUSPENSION_REQUEST_NOT_FOUND: 'Suspension request not found for this user',
  NOT_FOUND_WITH_STATUS: (status: string) =>
    `No suspension requests found with status '${status}'.`,
  
};

export enum AnalyticsType {
  USERS = 'users',
  FEEDBACK = 'feedback',
  REVENUE = 'revenue',
}

export enum AnalyticsTimeframe {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}