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
- Frontend-only reset or profile flows beyond the verified endpoints above are not implemented and remain unverified.
