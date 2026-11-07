# API_NOTES

This file documents only the backend information that was inspected and verified for the frontend.

## POST /auth/signup
- Purpose: create a user account and trigger email verification.
- Request body:
  - full_name: string
  - email: string
  - password: string
  - username: string (optional)
  - address: string (optional)
- Authentication: none.
- Response: 200 with a success flag and a message like "Signup successful! Please verify your email, OTP sent to user email".
- Validation: email must be valid, password is validated on the backend, and duplicate email/username values are rejected.
- Important behavior: the backend sends a verification OTP immediately after user creation.
- Newly created local USER accounts receive 3 free `ITINERARY` credits at account creation. The grant is protected by a persisted one-time flag; OTP verification does not add itinerary credits. ADMIN accounts do not receive this grant.
- The migration `AddFreeItineraryCreditGrantFlag1794086400000` must be applied before deploying this backend version. It marks pre-existing accounts as already processed and does not change any existing credit balances.

## POST /auth/login
- Purpose: authenticate a user and return a JWT token.
- Request body:
  - emailOrUsername: string
  - password: string
- Authentication: none for the login route.
- Response example:
  - success: true
  - message: "Login successful"
  - data: {
      accessToken: string,
      user: { id, email, username, full_name, role }
    }
- Validation: the backend checks email/username and password, and rejects suspended or unverified accounts.
- Important behavior: if email is not verified, the backend sends another OTP and responds with an unauthorized error.

## POST /otp
- Purpose: send an OTP for email verification or password reset.
- Request body:
  - email: string
  - purpose: "VERIFY_EMAIL" or "PASSWORD_RESET"
- Authentication: none.
- Response: 200 with a message and data object that indicates the OTP was sent.
- Important behavior: the backend looks up the user by email and rejects invalid or already-verified email cases.

## POST /otp/_verify
- Purpose: verify an OTP and complete the action.
- Request body:
  - email: string
  - otp: string
  - purpose: "VERIFY_EMAIL" or "PASSWORD_RESET"
  - newPassword: string (required only for password reset)
- Authentication: none.
- Response: 200 with a success message when verification passes.
- Important behavior: successful verification clears the OTP record and completes the requested action.

## Development-only frontend OTP bypass
- Configuration: `VITE_DEV_OTP_BYPASS=true` in the frontend environment file.
- It is additionally guarded by Vite's `import.meta.env.DEV`, so production builds cannot enable it.
- For `VERIFY_EMAIL` only, any non-empty OTP lets the frontend return to the login screen without calling `POST /otp/_verify`.
- It does not modify backend verification state, create a JWT, or report the account as verified. Password-reset OTP still uses the real endpoint.
- Backend limitation: password login rejects users whose `email_verified` value is false, and protected itinerary routes require a real JWT. This bypass is only useful for frontend navigation/UI work; it does not unlock authenticated itinerary API calls for an unverified account.

## GET /itinerary/list
- Purpose: return the authenticated user's itineraries, newest first.
- Authentication: JWT bearer token; controller also restricts access to role `USER`.
- Query parameters: `page` (default 1) and `limit` (default 10), both positive integers.
- Response shape: `{ data: [...], meta: { page, limit, total, totalPages } }`.
- List item fields verified by the repository query and Swagger response: `itinerary_id`, `travel_location`, `country`, `type`, `created_at`, and `title`. The title is selected from `content.itinerary_title`.
- The frontend requests six records per page and opens details with the returned `itinerary_id`.

## GET /itinerary/questions
- Purpose: get questionnaire fields and the most recently saved answers, if any.
- Authentication: JWT bearer token; role `USER` required.
- Response: an array of `{ id, question_text, field_type, options, image_url, answer }` records.
- Actual field types in the backend entity: `text`, `dropdown`, `multi-select`, and `date`. `options` may be null; answers are returned from the latest itinerary's `source_questions_answers`, keyed by the exact question text.
- The response has no `required` property. Destination, country, and duration are required by the generation DTO; the frontend identifies those current seeded fields from their question labels. Other questionnaire answers remain optional unless backend validation changes.

## GET /feature-credits
- Purpose: return the authenticated USER's feature-credit balances.
- Authentication: JWT bearer token; role `USER` required.
- Response shape: `{ success, message, data: { user_id, feature_balances } }`.
- The itinerary generation balance is `data.feature_balances.ITINERARY`; the backend returns zero when no balance record/value exists.
- The create-itinerary page checks this endpoint before showing questionnaire fields. The generation endpoint remains authoritative if the balance changes after the check.
- The USER dashboard also displays the live ITINERARY balance; a missing balance entry is displayed as zero.

## GET /feature-prices?type=ITINERARY
- Purpose: return the active backend price for one itinerary credit.
- Authentication: JWT bearer token; any authenticated role is accepted by the current controller.
- Response: `{ success, message, data: { featureType, priceAmount, currency } }`.
- This is a per-credit price, not a predefined credit package. The dashboard displays it as informational pricing only.

## Payment APIs (not ready for frontend checkout)
- `POST /initiate` is USER/JWT-protected and accepts `{ featureCredits: [{ feature, credits }] }`. It creates a Razorpay order and returns `{ success, orderId, amount, razorpayKey }`.
- `POST /webhook` is intended to award credits after a Razorpay captured-payment event with a valid signature.
- Payment integration is intentionally not exposed in the frontend yet. The backend currently verifies a re-serialized request body rather than Razorpay's raw webhook bytes, has no idempotency guard before crediting a successful payment, and `RAZORPAY_WEBHOOK_SECRET` is not present in the inspected `backend/.env` key names. A retried captured webhook can therefore add credits more than once, and signature verification cannot be configured from the current environment.
- The separate `/razorpay/verify-signature` test route accepts a secret in the request body and is not a production payment confirmation flow. Do not use it to grant credits.
- The checkout flow, webhook signature verification, idempotent credit processing, and end-to-end Razorpay confirmation remain incomplete and untested. No frontend or test code simulates payment success.

## POST /itinerary
- Purpose: generate and save an itinerary.
- Authentication: JWT bearer token; role `USER` required.
- Request body (exact DTO):
  - `travel_location`: non-empty string.
  - `country`: non-empty string.
  - `trip_duration`: number from 1 through 10.
  - `source_questions_answers`: object containing answers keyed by questionnaire question text.
- Successful response: generated itinerary content directly, with keys such as `user_travel_location`, `country_name`, `itinerary_title`, and `days`. The service response does not include the saved database ID.
- Relevant errors: 400 for DTO validation, 401 for missing/invalid JWT, 403 for insufficient itinerary credits or role access, and 500 for AI or persistence errors.
- Important service behavior: it saves the itinerary and then decrements credits. It calls SendGrid afterward, but the current SendGrid service catches and logs delivery errors without rethrowing them. A failure during credit decrement can still return an error after the record was saved; check `GET /itinerary/list` before retrying an ambiguous request.
- After a successful response, the frontend compares itinerary IDs from a pre-generation list snapshot with the refreshed list and matches the new record by destination, country, and generated title when available. It navigates only when it identifies a newly saved record.

## GET /itinerary/:id
- Purpose: fetch one saved itinerary.
- Authentication: JWT bearer token; role `USER` required, and the service verifies the record belongs to the current user.
- Response shape: `{ id, travel_location, country, type, created_at, content }`.
- Verified `content` fields include `itinerary_title`, `user_travel_location`, `country_name`, and `days`. Each day may contain `day`, `day_title`, `tags`, and `activities`; activities may contain `time`, `title`, `description`, `duration`, and `cost`.
- The frontend renders available values and omits optional values that are absent.

## GET /auth/google
- Purpose: start Google OAuth login.
- Authentication: none.
- Important behavior: this route is protected by a Passport Google strategy and uses the backend callback URL configured on the server.
- Status: unverified in this frontend project because the backend currently holds placeholder Google credentials.

## GET /users
- Purpose: fetch the authenticated user's profile.
- Authentication: JWT bearer token; controller also restricts access to role `USER`.
- Response shape: `{ success, message, data }`. Verified profile fields include `id`, `full_name`, `username`, `email`, `address`, `role`, `email_verified`, `is_suspended`, `is_deleted`, `deleted_at`, `created_at`, and `updated_at`. The service excludes `password_hash`.
- The frontend profile page fetches this endpoint rather than treating cached login data as authoritative.

## PUT /users
- Purpose: update the authenticated USER's profile fields supported by `UpdateProfileDto`.
- Authentication: JWT bearer token; role `USER` required.
- Request body requires all three string fields: `full_name` (3-40 characters), `username` (3-20 characters), and `address` (minimum 3 characters). The service rejects a duplicate username and requests that do not change any supported value.
- Response shape: `{ success, message, data: { id, full_name, username, address } }`.
- Email changes are not supported by this endpoint and are read-only in the frontend profile page. Password changes use a separate endpoint and are not part of this profile page.

## Admin APIs
All routes below require a JWT bearer token and the `ADMIN` role via `JwtAuthGuard` and `RolesGuard`.

### GET /admin/users
- Purpose: return a paginated user list.
- Query parameters: `page`, `limit`, optional `name`, `email`, `username`, and `is_active` (`true` filters active/not-suspended users; `false` filters suspended users).
- Response shape: `{ success, message, data: AdminUser[], meta: { total, page, limit, totalPages } }`. The service removes `password_hash` from list entries.

### GET /admin/users/:id
- Purpose: return one user's details, feature-credit records, and payment history.
- Response shape: `{ success, message, data: { user, featureCredits, paymentHistory } }`.
- The backend payment-history objects include `payment_gateway_response`; the frontend intentionally displays only order, status, amount, and date rather than raw gateway payloads.

### PUT /admin/user-status?status=suspend|reactivate
- Request body: `{ userId: number, reason: string }`; `reason` must be 5-100 characters for either operation.
- Response: `{ success: true, message }`.
- The service does not allow modifying ADMIN accounts. Suspending creates or resets a PENDING suspension request. Reactivating requires an existing suspension request; there is no separate suspension-request approve/reject endpoint.

### GET /admin/questionnaire
- Purpose: list all questionnaire records.
- Response: an array of `{ id, question_text, field_type, options, image_url, is_default, created_by, created_at, updated_at }`.
- Supported entity enum values are `text`, `dropdown`, `multi-select`, and `date`.

### POST /admin/questionnaire
- Request body: `question_text` (5-500 characters), `field_type`, optional `options: string[]`, and optional `image_url`.
- Response: one questionnaire record with the fields returned by `GET /admin/questionnaire`.
- Default questions are created with `is_default: false`. Dropdown questions require options in the current service/DTO validation.
- Limitation: both create and update DTOs apply `@Length(5,15)` to `field_type`. This rejects the enum values `text` and `date` (four characters), despite those values being defined in the entity enum. The frontend only offers dropdown/multi-select for new records.

### PUT /admin/questionnaire/:id
- Request body: optional `question_text`, `field_type`, `options`, and `image_url` fields.
- Response: the updated questionnaire record.
- The service rejects edits to `is_default` questions. Because of the `field_type` length validator, the frontend omits an unchanged `text`/`date` type when editing those records; changing a type to `text`/`date` is not supported by the current DTO.

### DELETE /admin/questionnaire/:id
- Response: HTTP 204 with no body.
- The service rejects deletion of `is_default` questions.

### GET /admin/suspension-requests
- Query parameters: `page` (default 1), `limit` (default 10), optional `status` (`PENDING` or `APPROVED`).
- Response shape: `{ success, message, total, page, limit, data: SuspensionRequest[] }`; each item includes `id`, `user_id`, `username`, `email`, `user_request_message`, `suspension_reason`, `status`, and `suspension_date`.
- A filtered query with no matching requests can return 404. The frontend displays that case as an empty result. This controller has no approve/reject action for a request.

### GET /admin/api-audit-logs
- Query parameters: `page` and `limit` (positive integers; service defaults to 1 and 10).
- Response shape: `{ success, message, data: ApiAuditLog[], meta: { total, page, limit, totalPages } }`. Entries include `id`, `user_id`, `status_code`, `feature`, `response_text`, `error_message`, `created_at`, and a nullable summary of the associated user.
- The frontend exposes logs read-only.

## Unknown / unverified items
- Exact Google callback response format is not confirmed because the backend Google credentials are not configured.
- The dashboard and itinerary flows have not been manually exercised against a running backend/database with a real USER JWT, available credits, and configured Gemini/SendGrid services. The local backend was not listening during the current check, so no HTTP status/body, Authorization header acceptance, or role authorization was observed live.
- No itinerary edit endpoint was verified; editing is not implemented.
- Profile GET/PUT source contracts have been inspected and the profile page is implemented, but live profile API behavior has not been tested with a real USER session. Admin UI contracts were verified from source but still require manual testing with a real ADMIN session.
- Free-credit grant behavior is covered by service unit tests, but real registration/OTP/database behavior has not been exercised against a migrated database. New free credits apply only to accounts created after the grant-flag migration; existing balances are intentionally preserved.

## Backend provider configuration
- Gemini reads `GEMINI_API_KEY` from the backend environment.
- SendGrid reads `SENDGRID_API_KEY` and `SENDGRID_FROM_EMAIL` from the backend environment.
- Keep these credentials in `backend/.env`; do not add them to frontend environment variables.
