# PROJECT_PLAN

## Phase 1: Authentication
- [x] Inspect the backend auth and OTP APIs.
- [x] Create the login screen with email/username login, validation, and friendly errors.
- [x] Create the signup screen using the verified backend fields.
- [x] Implement OTP email verification flow using the actual backend contract.
- [x] Add a password-reset entry point using the verified backend OTP reset flow.
- [ ] Confirm live Google OAuth behavior with valid backend credentials.
- [ ] Manual live verification with the real backend and email delivery configuration.

## Phase 2: Dashboard and itinerary management
- [x] Inspect itinerary list, questionnaire, generation, and detail contracts in the backend.
- [x] Build the authenticated dashboard with paginated itinerary cards, loading/empty/error states, and logout.
- [x] Build the dynamic, multi-step questionnaire using returned questions, options, and saved answers.
- [x] Submit itinerary generation using the verified request DTO and handle authorization/credit errors.
- [x] Build a readable day-by-day itinerary detail view from the verified detail response.
- [ ] Manually test the complete flow with a real backend, valid user JWT, available credits, and configured AI/email services.

## Phase 3: User profile and account settings
- [ ] Review the real profile update and password-change endpoints.
- [ ] Build the user profile screen.
- [ ] Add password change and account settings flows.

## Phase 4: Credits, pricing, and payments
- [ ] Check backend payment and feature-credit routes.
- [ ] Build pricing and credit screens only if the backend supports them.
- [ ] Integrate payment flow only after the actual API contract is verified.

## Phase 5: Admin functionality
- [ ] Inspect admin routes and role requirements.
- [ ] Build admin dashboard screens only if the backend exposes them.
- [ ] Restrict admin pages behind verified JWT role checks.

## Status notes
- Authentication screens remain in place; a development-only OTP bypass is available only when `VITE_DEV_OTP_BYPASS=true` and Vite is running in development mode. It does not verify the account or issue a token.
- Phase 2 dashboard, list, dynamic questionnaire, generation, and detail UI are implemented. The frontend TypeScript check and production build pass; live API behavior remains untested here.
- The backend generation response does not include a saved itinerary ID, so the frontend refreshes the list and opens the returned newest `itinerary_id` after a successful create response.
- The inspected backend has no verified itinerary edit route, so itinerary editing was not added.
- Google login is currently blocked until the backend receives valid Google OAuth credentials.
- Phase 3 profile, Phase 4 credit/payment, and Phase 5 admin features remain pending.
