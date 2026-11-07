export type AdminUser = {
  id: number;
  full_name: string;
  username: string | null;
  email: string;
  address: string | null;
  role: 'USER' | 'ADMIN' | string;
  is_suspended: boolean;
  email_verified: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
};

export type AdminUserListResponse = {
  success: boolean;
  message: string;
  data: AdminUser[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type AdminUserDetails = {
  user: AdminUser & { deleted_at: string | null };
  featureCredits: Array<{
    id: number;
    user_id: number;
    feature_balances: Record<string, number>;
    updated_at: string;
  }>;
  paymentHistory: Array<{
    id: number;
    user_id: number;
    order_id: string;
    total_amount: number | string;
    transaction_id: string | null;
    status: string;
    created_at: string;
    order: { id: number; order_id: string; user_id: number; total_amount: number | string; created_at: string } | null;
  }>;
};

export type AdminUserDetailsResponse = {
  success: boolean;
  message: string;
  data: AdminUserDetails;
};

export type UpdateAdminUserStatusRequest = {
  userId: number;
  reason: string;
};

export type AdminQuestionnaire = {
  id: number;
  question_text: string;
  field_type: 'text' | 'dropdown' | 'multi-select' | 'date';
  options?: string[] | null;
  image_url?: string | null;
  is_default: boolean;
  created_by: number | null;
  created_at: string;
  updated_at: string;
};

export type AdminQuestionnaireRequest = {
  question_text: string;
  field_type: AdminQuestionnaire['field_type'];
  options?: string[];
  image_url?: string;
};

export type SuspensionRequest = {
  id: number;
  user_id: number;
  username: string;
  email: string;
  user_request_message: string | null;
  suspension_reason: string;
  status: string;
  suspension_date: string;
};

export type SuspensionRequestListResponse = {
  success: boolean;
  message: string;
  total: number;
  page: number;
  limit: number;
  data: SuspensionRequest[];
};

export type ApiAuditLog = {
  id: number;
  user_id: number;
  status_code: number | null;
  feature: string;
  response_text: string | null;
  error_message: string | null;
  created_at: string;
  user: { id: number; full_name: string; username: string | null; email: string } | null;
};

export type ApiAuditLogResponse = {
  success: boolean;
  message: string;
  data: ApiAuditLog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
