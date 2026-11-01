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
- [ ] Inspect itinerary module capabilities against the actual backend.
- [ ] Build the main dashboard and itinerary list views.
- [ ] Add creation, editing, and viewing flows for itinerary data.
- [ ] Connect itinerary actions to protected API routes.

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
- Authentication screens are implemented and the frontend build passes.
- Google login is currently blocked until the backend receives valid Google OAuth credentials.
- Future dashboard, profile, credit, and admin features remain pending because they were not implemented or verified in this pass.
