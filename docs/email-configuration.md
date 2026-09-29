# Email Configuration & Password Recovery

## Overview
Transactional email is **optional and fully configurable**. The application functions securely whether an SMTP server is connected or not.

---

## Behavior Depending on Email Configuration

| Email State | Behavior | Password Recovery Mechanism |
|-------------|----------|-----------------------------|
| **Not Configured** (Default) | Customer registration and checkout function normally. No emails sent. | **Admin-Assisted Password Reset**: The system generates a single-use SHA-256 hashed 1-hour reset token and logs it in `audit_logs`. The store admin shares the secure link with the customer. |
| **Configured** (SMTP) | Customer registration welcome and password reset link sent directly via email. | Standard automated email reset link. |

---

## SMTP Configuration Variables (Optional)

In `.env`:
```bash
EMAIL_SMTP_HOST="smtp.gmail.com"
EMAIL_SMTP_PORT=587
EMAIL_SMTP_SECURE=false # true for port 465
EMAIL_SMTP_USER="your-email@gmail.com"
EMAIL_SMTP_PASS="your-gmail-app-password"
EMAIL_FROM="Amar Dokan <noreply@example.com>"
```

### Supported Providers:
- **Gmail**: Generate an *App Password* under Google Account Security (2-Step Verification required).
- **SMTP2GO / SendGrid / Mailgun**: Use the standard SMTP relay credentials.
- **Custom Postfix / cPanel**: Use your domain host's SMTP credentials.

---

## Admin-Assisted Password Reset Workflow (When Email Is Off)
1. Customer visits `/forgot-password` and enters their registered email or phone.
2. The server creates a token record with an expiration of 1 hour and records an audit log.
3. Customer calls or messages the store support line.
4. An authorized store admin locates the customer in the admin dashboard and provides the reset link:
   ```
   https://yourdomain.com/reset-password?token=<TOKEN>
   ```
5. Customer sets a new password (min 8 characters) hashed with Argon2id.
6. The token is immediately marked `usedAt` and cannot be reused.
