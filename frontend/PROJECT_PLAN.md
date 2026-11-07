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
- [x] Check the user's itinerary credit balance before showing questionnaire steps.
- [x] Build a readable day-by-day itinerary detail view from the verified detail response.
- [x] Add an explicit empty questionnaire state and retry action for questionnaire request failures.
- [x] Identify the newly generated saved itinerary by comparing pre- and post-generation list IDs before opening its detail page.
- [ ] Manually test the complete flow with a real backend, valid user JWT, available credits, and configured AI/email services.

## Phase 3: User profile and account settings
- [ ] Review the real profile update and password-change endpoints.
- [ ] Build the user profile screen.
- [ ] Add password change and account settings flows.

## Phase 4: Credits, pricing, and payments
- [x] Inspect backend credit, pricing, payment, and Razorpay webhook paths.
- [x] Grant 3 initial itinerary credits once to new USER accounts; keep existing account balances unchanged.
- [x] Display the live itinerary balance and backend per-credit price on the USER dashboard.
- [ ] Implement paid checkout only after raw-body webhook signature verification, idempotent payment crediting, and `RAZORPAY_WEBHOOK_SECRET` configuration are in place.

## Phase 5: Admin functionality
- [ ] Inspect admin routes and role requirements.
- [ ] Build admin dashboard screens only if the backend exposes them.
- [ ] Restrict admin pages behind verified JWT role checks.

## Status notes
- Authentication screens remain in place; a development-only OTP bypass is available only when `VITE_DEV_OTP_BYPASS=true` and Vite is running in development mode. It does not verify the account or issue a token.
- Phase 2 dashboard, list, dynamic questionnaire, generation, and detail UI are implemented. The frontend TypeScript check and production build pass. Authenticated live API behavior remains untested because the backend was not listening and no real USER session was available.
- The backend generation response does not include a saved itinerary ID. The frontend now snapshots existing IDs and matches a newly appearing saved record by destination, country, and generated title when available; it does not blindly open the first list item.
- The questionnaire now has explicit empty and retry states. Backend validation error arrays are joined into readable frontend messages.
- Source-verified backend configuration names are `GEMINI_API_KEY`, `SENDGRID_API_KEY`, and `SENDGRID_FROM_EMAIL`; secret values were not inspected.
- Current SendGrid implementation logs and swallows delivery failures. A credit-decrement failure after the database save can still make generation return an error after persistence, so users should check My trips before retrying ambiguous failures.
- Free initial itinerary credits are granted once at local or first-time Google USER account creation. OTP verification does not grant itinerary credits. Migration `AddFreeItineraryCreditGrantFlag1794086400000` marks existing users as processed without changing balances; apply it before deploying.
- The free-credit service tests pass. Real signup, Google signup, OTP, migration, itinerary deduction, and existing database balance behavior still require manual testing against a database after applying the migration.
- The backend exposes active per-credit prices and Razorpay order/webhook endpoints, but payment is not safe to integrate yet: the webhook secret is absent, signature verification does not use raw request bytes, and successful webhook processing is not idempotent. No fake payment or checkout-success UI was added.
- The inspected backend has no verified itinerary edit route, so itinerary editing was not added.
- Google login is currently blocked until the backend receives valid Google OAuth credentials.
- Phase 3 profile, Phase 4 credit/payment, and Phase 5 admin features remain pending.
