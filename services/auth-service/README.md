# Auth Service

Handles authentication and authorization of users.

## Responsibilities

- User registration
- User login
- JWT token generation
- Role-based authentication (Patient, Doctor, Admin)

## APIs

- POST /api/auth/register
- POST /api/auth/login

## Database

- Users collection

## Notes

- Passwords are hashed using bcrypt
- JWT is used for secure authentication
