# Production Readiness Plan

**Overall Progress:** `100%`

## TLDR
Add production infrastructure: Google Analytics for usage tracking, Sentry for error monitoring, Resend for transactional email notifications (low stock alerts, welcome emails), and comprehensive legal pages covering GDPR/CCPA and SaaS-specific provisions.

## Critical Decisions
- **Analytics**: Google Analytics 4 - industry standard, free, user prefers over Vercel Analytics
- **Error Monitoring**: Sentry - free tier (5K errors/month), excellent Next.js support
- **Email**: Resend - for transactional emails (Supabase handles auth emails separately)
- **Legal**: Comprehensive SaaS terms with GDPR/CCPA, data processors, SLA provisions

## Tasks

- [x] 🟩 **Step 1: Google Analytics 4**
  - [x] 🟩 Create `components/analytics/google-analytics.tsx` with gtag script
  - [x] 🟩 Add component to `app/layout.tsx`
  - [x] 🟩 Document GA_MEASUREMENT_ID env variable

- [x] 🟩 **Step 2: Sentry Error Monitoring**
  - [x] 🟩 Install `@sentry/nextjs`
  - [x] 🟩 Create `sentry.client.config.ts` and `sentry.server.config.ts`
  - [x] 🟩 Create `app/global-error.tsx` error boundary
  - [x] 🟩 Update `next.config.ts` with Sentry
  - [x] 🟩 Document SENTRY_DSN env variable

- [x] 🟩 **Step 3: Resend Email System**
  - [x] 🟩 Install `resend` and `@react-email/components`
  - [x] 🟩 Create `lib/email/templates/base.tsx` (brand layout)
  - [x] 🟩 Create `lib/email/templates/welcome.tsx`
  - [x] 🟩 Create `lib/email/templates/low-stock-alert.tsx`
  - [x] 🟩 Create `lib/email/send.ts` (sending utility)
  - [x] 🟩 Document RESEND_API_KEY env variable

- [x] 🟩 **Step 4: Privacy Policy (Legal Strengthening)**
  - [x] 🟩 Add GDPR section (lawful basis, EU rights, DPO)
  - [x] 🟩 Add CCPA section (CA rights, opt-out, do-not-sell)
  - [x] 🟩 Add data processors (Supabase, Vercel, Sentry, Resend, Google)
  - [x] 🟩 Add international transfer provisions
  - [x] 🟩 Add cookie policy with specific cookies
  - [x] 🟩 Add breach notification (72-hour GDPR rule)
  - [x] 🟩 Add retention schedule

- [x] 🟩 **Step 5: Terms of Service (Legal Strengthening)**
  - [x] 🟩 Add SLA section (99.9% uptime target, remedies)
  - [x] 🟩 Add acceptable use policy (prohibited activities list)
  - [x] 🟩 Add DMCA procedure (takedown process)
  - [x] 🟩 Add dispute resolution (arbitration, governing law)
  - [x] 🟩 Add force majeure clause
  - [x] 🟩 Add severability and waiver
  - [x] 🟩 Add export compliance

## Environment Variables Required

Add these to your `.env.local` and Vercel project settings:

```bash
# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Sentry Error Monitoring
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
SENTRY_ORG=your-org
SENTRY_PROJECT=batchtrack
SENTRY_AUTH_TOKEN=your-auth-token  # Optional, for source maps

# Resend Email
RESEND_API_KEY=re_xxxxxxxxxxxxx
```
