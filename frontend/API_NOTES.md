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

## POST /itinerary
- Purpose: generate and save an itinerary.
- Authentication: JWT bearer token; role `USER` required.
- Request body (exact DTO):
  - `travel_location`: non-empty string.
  - `country`: non-empty string.
  - `trip_duration`: number from 1 through 10.
  - `source_questions_answers`: object containing answers keyed by questionnaire question text.
- Successful response: generated itinerary content directly, with keys such as `user_travel_location`, `country_name`, `itinerary_title`, and `days`. The service response does not include the saved database ID.
- Relevant errors: 400 for DTO validation, 401 for missing/invalid JWT, 403 for insufficient itinerary credits or role access, and 500 for AI, persistence, or email errors.
- Important service behavior: it saves the itinerary and decrements credits before sending the notification email. An email failure can therefore return an error after the record was saved; check `GET /itinerary/list` before retrying an ambiguous request.
- On a successful response, the frontend requests the latest list item and navigates to its `itinerary_id`.

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
- The new dashboard and itinerary flows have not been manually exercised against a running backend/database with a real JWT, credits, AI provider, and email configuration.
- No itinerary edit endpoint was verified; editing is not implemented.
- Profile, payment/credit purchase, and admin workflows remain outside the completed Phase 2 scope.
