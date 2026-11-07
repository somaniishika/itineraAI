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

## Protected profile route (verified)
- GET /users
- Purpose: fetch the authenticated user profile.
- Authentication: JWT required via the access-token bearer header.
- Response includes the current user profile details.
- This route is available for future profile screens, but it is not required for the initial authentication-only UI.

## Unknown / unverified items
- Exact Google callback response format is not confirmed because the backend Google credentials are not configured.
- The dashboard and itinerary flows have not been manually exercised against a running backend/database with a real USER JWT, available credits, and configured Gemini/SendGrid services. The local backend was not listening during the current check, so no HTTP status/body, Authorization header acceptance, or role authorization was observed live.
- No itinerary edit endpoint was verified; editing is not implemented.
- Profile, payment/credit purchase, and admin workflows remain outside the completed Phase 2 scope.
- Free-credit grant behavior is covered by service unit tests, but real registration/OTP/database behavior has not been exercised against a migrated database. New free credits apply only to accounts created after the grant-flag migration; existing balances are intentionally preserved.

## Backend provider configuration
- Gemini reads `GEMINI_API_KEY` from the backend environment.
- SendGrid reads `SENDGRID_API_KEY` and `SENDGRID_FROM_EMAIL` from the backend environment.
- Keep these credentials in `backend/.env`; do not add them to frontend environment variables.
