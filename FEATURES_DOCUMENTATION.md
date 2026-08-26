# 📘 Brand R.Comm 2026 — Master Feature & Technical Architecture Documentation

Welcome to the official feature documentation for **BRAND R.Comm 2026 (5th Agriculture & Rural Communication Summit & Awards)**.  
This document serves as the single source of truth for all built features, detailing **Why** each feature was implemented, **How** it works technically, and its **Security & Data Integrity** safeguards.

> ⚠️ **Rule for Developers & AI Agents**: Whenever a new feature is created or an existing feature is modified, you **MUST** update this file to reflect the latest architecture, API endpoints, and business logic.

---

## 📋 Table of Contents
1. [Dynamic IST Tiered Pricing System](#1-dynamic-ist-tiered-pricing-system)
2. [Duplicate Registration Prevention & Identity Locking](#2-duplicate-registration-prevention--identity-locking)
3. [Financial Accounting Architecture (`totalAmount`, `amountPaid`, `amountDue`)](#3-financial-accounting-architecture-totalamount-amountpaid-amountdue)
4. [Cryptographically Hashed Resume Tokens (Pay Later Email Links)](#4-cryptographically-hashed-resume-tokens-pay-later-email-links)
5. [Enterprise Payment Gateway Security (HMAC-SHA256 Timing-Safe Verification)](#5-enterprise-payment-gateway-security-hmac-sha256-timing-safe-verification)
6. [Admin Panel — Complete Dashboard System](#6-admin-panel--complete-dashboard-system)
7. [Automated Resend Email Notifications & Idempotency](#7-automated-resend-email-notifications--idempotency)
8. [Multi-Recipient Team Notification System](#8-multi-recipient-team-notification-system-admin_notification_emails)
9. [Award Nomination Security, Duplicate Locking & Pay Later Resumption](#9-award-nomination-security-duplicate-locking--pay-later-resumption)
10. [Media Kit Page](#10-media-kit-page)

---

## 1. Dynamic IST Tiered Pricing System

### ❓ Why It Was Implemented
Event registration fees increase progressively as the summit date approaches. If a delegate submits their form during an early pricing window (e.g., August) but delays payment until September or October, business rules dictate that the fee applicable at the **actual payment time** must be charged. Registration date does **NOT** lock the price; order creation locks the price for that payment attempt.

### 🛠️ How It Works
- **Pricing Schedule (Indian Delegates - IST Timezone)**:
  - **Till 31 August 2026**: `₹6,000 + 18% GST` = **`₹7,080`** total
  - **1 September – 30 September 2026**: `₹7,000 + 18% GST` = **`₹8,260`** total
  - **1 October – 31 October 2026**: `₹8,000 + 18% GST` = **`₹9,440`** total
  - **After 31 October 2026**: `₹10,000 + 18% GST` = **`₹11,800`** total
- **International Delegates**: `USD 250 + Tax` (or `USD 200 + Tax` with coupon).
- **Execution Flow**:
  1. `calculateDelegatePricing` in `backend/src/controllers/delegateController.js` evaluates current server time using `Asia/Kolkata` IST timezone.
  2. When the user clicks **"Proceed to Payment"**, `POST /api/delegates/create-order` dynamically recalculates the active price tier, updates `totalAmount` & `amountDue` in MongoDB, and creates the Razorpay order for that exact amount in paise.
  3. If a pricing cutoff passed between registration and payment, the frontend modal renders a clear explanation notice:  
     *ℹ️ Pricing Tier Updated: Your registration was created during a previous pricing tier. Since that cutoff has passed, today's applicable fee applies.*

---

## 2. Duplicate Registration Prevention & Identity Locking

### ❓ Why It Was Implemented
Delegates frequently experience browser crashes, closed tabs, or choose to pay later. Without duplicate prevention, re-submitting the registration form inserts multiple duplicate MongoDB records, fragmenting attendee data and confusing payment reconciliation.

### 🛠️ How It Works
- **Canonical Input Normalization**:
  - Email: `email.trim().toLowerCase()` (e.g., `" Rahul@Gmail.com "` → `"rahul@gmail.com"`).
  - Mobile: Non-digit characters stripped to form standard canonical number (e.g., `"+91 98765 43210"` → `"9876543210"`).
- **Backend Matching & Re-use**:
  1. `POST /api/delegates` queries MongoDB using `$or: [{ email: cleanEmail }, { mobileNumber: cleanMobile }]`.
  2. If found, it updates the existing record with any updated details (address, organization) instead of creating a duplicate document.
  3. If `paymentStatus === 'Paid'`: Returns `{ alreadyPaid: true, data: existingDelegate }` with Reg ID.
  4. If `paymentStatus === 'Pending'`: Returns `{ isExisting: true, data: existingDelegate }` with an Existing Registration Card allowing instant 1-click payment continuation.
- **Concurrent Race Protection**:
  - Backed by MongoDB index constraints and `E11000` duplicate key exception handling. Simultaneous request races are caught, returning the existing registration safely.

---

## 3. Financial Accounting Architecture (`totalAmount`, `amountPaid`, `amountDue`)

### ❓ Why It Was Implemented
To ensure enterprise double-entry accounting standards for refunds, partial payments, reporting, and administrative analytics.

### 🛠️ How It Works
Each `DelegateRegistration` MongoDB document maintains three dedicated numeric financial fields:
- **`totalAmount`**: Total calculated fee for the registration (e.g. `5664`).
- **`amountPaid`**: Total money received (`0` when Pending; `5664` when Paid).
- **`amountDue`**: Total outstanding balance (`5664` when Pending; `0` when Paid).

```json
// Pending Registration
{ "paymentStatus": "Pending", "totalAmount": 5664, "amountPaid": 0, "amountDue": 5664 }

// Verified Paid Registration
{ "paymentStatus": "Paid", "totalAmount": 5664, "amountPaid": 5664, "amountDue": 0 }
```

---

## 4. Cryptographically Hashed Resume Tokens (Pay Later Email Links)

### ❓ Why It Was Implemented
When a delegate chooses "Pay Later", they receive an email with a **"Complete Your Payment →"** button. The URL must be completely secure and impossible to tamper with, guessing other attendees' IDs or exposing personal email/mobile details in URL query params.

### 🛠️ How It Works
- **Token Generation**:
  - Generates a 64-character cryptographically random token: `rawToken = crypto.randomBytes(32).toString('hex')`.
  - Computes one-way SHA-256 hash: `resumeTokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')`.
  - MongoDB stores `resumeTokenHash` and `paymentTokenExpires` (valid for 14 days). Plain tokens are **never** stored in DB.
- **Email Link**:
  - Recipient receives: `https://brand-r-com-4.vercel.app?token=rawToken`.
- **Token Resolution (`GET /api/delegates/resume-payment/:token`)**:
  - Backend hashes the incoming token and looks up `resumeTokenHash`.
  - Calculates current IST pricing and returns masked details (`Rahul K.`, `ra***@gmail.com`, `******8214`).
- **Post-Payment Token Invalidation**:
  - Once payment is verified, `resumeTokenHash` and `paymentTokenExpires` are set to `null`, making the old email link permanently inactive.

---

## 5. Enterprise Payment Gateway Security (HMAC-SHA256 Timing-Safe Verification)

### ❓ Why It Was Implemented
To eliminate payment spoofing, fraudulent signature injections, or timing side-channel attacks.

### 🛠️ How It Works
- **Endpoint**: `POST /api/delegates/verify-payment`.
- **Timing-Safe HMAC Check**:
  ```javascript
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  const isSignatureValid = crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'utf-8'),
    Buffer.from(razorpay_signature, 'utf-8')
  );
  ```
- Payment status is only updated to `Paid` if `isSignatureValid` passes timing-safe comparison.

---

## 6. Admin Panel — Complete Dashboard System

### ❓ Why It Was Implemented
To give the Brand R.Comm organizing team full visibility, management, and control over all registrations, nominations, sponsorships, speakers, coupons, and coffee-table enquiries — without needing direct database access.

### 🛠️ Overview
The admin panel is a separate Next.js application (`admin/`) protected by JWT cookie authentication (`admin_token`). It runs independently at its own deployment URL with server-side proxying to the backend API.

---

### 6.1 — Live Analytics Dashboard (Home)
- **Location**: `admin/src/app/dashboard/page.jsx`
- **Live Stat Cards** (fetched in parallel via `Promise.allSettled`):
  - 🏆 Total Award Nominations / Under Review / Winners declared
  - 👥 Total Delegates Registered
  - 🤝 Total Sponsorships
  - 🎤 Speaker Interest Enquiries
  - 💰 Estimated Total Revenue (INR) — computed by summing `amountPaid` of Paid delegates and `totalAmount` of Paid nominations
- **Recent Activity Feed**: Unified cross-module activity stream combining the latest 6 records from Nominations, Delegates, Sponsorships and Speakers, sorted newest-first with color-coded type badges.
- **Quick Action Buttons**: Inline modal launchers to **Add Delegate**, **Add Nomination**, and **Add Sponsorship** directly from the dashboard.
- **CSV Summary Export**: Downloads a system-wide summary CSV with all key metrics and report timestamp.

---

### 6.2 — Delegates Management
- **Location**: `admin/src/app/dashboard/delegates/page.jsx`
- **Server-Side Pagination**: Paginated data fetching with configurable rows-per-page (`limit`) and live `totalFiltered` count.
- **21-Column Sticky Table**:
  1. Checkbox, 2. S.No., 3. Reg. ID, 4. Reg. Date & Time, 5. Delegate Type, 6. Company GST No., 7. Attendee Category, 8. Name, 9. Designation, 10. Organization, 11. Mobile, 12. Email, 13. City, 14. State/Country, 15. Pincode, 16. Address, 17. Reg. Type, 18. Amount, 19. Payment & Type, 20. Coupon Registration, 21. Actions.
- **Frozen Columns**: Checkbox (`left: 0px`), S.No. (`left: 48px`), Reg. ID (`left: 98px`), and Name (`left: 198px`) remain anchored on horizontal scroll.
- **7-Control Multi-Filter Bar**: Search input, Payment Status, Delegate Type, Registration Type, Attendee Category, Payment Method, Coupon Registration filter, and **Reset Filters** button.
- **Bulk Operations**: Checkbox multi-select with **Bulk Update Attendee Category** modal.
- **QR ID Card Generator**: `DelegateIdCardModal.jsx` — generates a printable delegate ID card with a QR code linking to their registration for on-site badge scanning.
- **CSV Export**: Full delegate data export with all 21 columns.
- **Delete with Confirmation**: Per-row soft-delete with a confirmation prompt before removal.
- **Manual Add Delegate Modal** (`AddDelegateModal.jsx`): Full form supporting INR/USD, Payment Status enum (`Pending`, `Paid`, `Failed`, `Invitee`), Attendee Category, `#IAP2026` coupon toggle, and `registeredBy` admin field.

---

### 6.3 — Award Nominations Management
- **Location**: `admin/src/app/dashboard/nominations/page.jsx`
- **Multi-Filter Bar**: Search, Payment Status, Registration Type, Applicant Type, Nomination Status (Under Review / Winner / Disqualified).
- **Status Toggle**: Inline dropdown to update a nomination's review status (`UNDER REVIEW` → `WINNER` / `DISQUALIFIED`) directly from the table row.
- **Detail Modals**:
  - 📋 **Summary View**: Full nomination form data (award category, statement, organization details).
  - 📎 **Attachment Viewer**: Opens the uploaded PDF/document in-browser for jury review.
  - 📬 **Contact Card**: Quick-access contact details overlay.
- **Add Delegate from Nomination**: Converts a paid nomination to a linked delegate registration via `AddDelegateModal`.
- **View Linked Delegates**: `NominationDelegatesModal.jsx` lists all delegates registered under a specific nomination entry.
- **Generate Coupon**: `GenerateCouponModal.jsx` issues a discount coupon linked to a specific nomination/sponsorship.
- **Manual Nomination Entry**: `ManualNominationModal.jsx` — full manual add form with all nomination fields, payment status, and file upload support.
- **Delete with Confirmation**: Per-row deletion with guard prompt.
- **CSV Export**: Full nominations data export.

---

### 6.4 — Sponsorships Management
- **Location**: `admin/src/app/dashboard/sponsorships/page.jsx`
- **Filter Bar**: Search, Registration Type, Category, Tier, and Sort (Newest / Oldest).
- **Edit Sponsorship**: Inline edit modal for updating sponsorship tier, amount, category, and status.
- **Logo Viewer**: In-table preview of uploaded sponsorship company logos.
- **Add Delegate from Sponsorship**: Converts a sponsorship record to a linked delegate registration.
- **View Linked Delegates**: `SponsorshipDelegatesModal.jsx` shows all delegates registered under a sponsorship package.
- **Generate Coupon**: Issues discount coupons linked to the sponsorship for their delegate passes.
- **Coupon Details View**: `CouponDetailsModal.jsx` — displays full coupon metadata, redemption count, and status for any coupon attached to a sponsorship.
- **Manual Sponsorship Entry**: `ManualSponsorshipModal.jsx` — full manual add with company details, tier selection, payment status, and logo upload.
- **CSV Export**: Full sponsorship data export.

---

### 6.5 — Speakers Management
- **Location**: `admin/src/app/dashboard/speakers/page.jsx`
- **Search & Filter**: Live search across name, organization, email, and subject area.
- **Detail View Modal**: Full speaker enquiry profile panel showing bio, contact, address, and subject expertise.
- **Inline Edit**: Edit form overlay for updating any speaker enquiry field (name, designation, organization, contact, subject area).
- **Delete with Confirmation**: Guarded deletion per entry.
- **CSV Export**: Full speaker enquiry data export.

---

### 6.6 — Coupon Management
- **Location**: `admin/src/app/dashboard/coupons/page.jsx`
- **Search**: Live search by coupon code or linked organization name.
- **Status Toggle**: One-click Active/Inactive toggle per coupon (`PATCH /api/coupons/:id/status`).
- **Edit Coupon**: `EditCouponModal.jsx` — update discount amount, usage limit, expiry date, and linked entity.
- **Delete / Deactivate**: Remove a coupon with confirmation guard.
- **Usage Tracking**: Table displays current redemption count vs. max allowed uses.
- **`GenerateCouponModal.jsx`**: Global coupon generator accessible from Nominations and Sponsorships — creates a unique code linked to a specific company/nomination with configurable discount and expiry.

---

### 6.7 — Coffee Table Book Enquiries
- **Location**: `admin/src/app/dashboard/coffee-table/page.jsx`
- **Purpose**: Manages enquiries for the **Coffee Table Book** feature — sponsors or delegates who request a feature write-up, page listing, or ad placement in the official summit publication.
- **Search & Filter**: Live search across name, organization, and email.
- **Fields Tracked**: `featureType` (type of coffee table feature requested) and `pagesRequested` (number of pages/slots).
- **Detail View Modal**: Full enquiry profile with contact and request details.
- **Inline Edit**: Edit any enquiry field including feature type and page requests.
- **Delete with Confirmation**: Guarded deletion.
- **CSV Export**: Full coffee table enquiry data export.

---

## 7. Automated Resend Email Notifications & Idempotency

### ❓ Why It Was Implemented
To send professional confirmation receipts instantly upon registration submission and payment verification.

### 🛠️ How It Works
- **Service**: `backend/src/services/emailService.js` via Resend API.
- **Idempotency Safeguards**:
  - Flags `initialEmailSent` and `paidEmailSent` ensure emails are sent exactly once even if webhooks or endpoints are retried.
- **Internal Team Notifications**:
  - Automatically dispatches a formatted internal alert to team addresses listed in `ADMIN_NOTIFICATION_EMAILS` (e.g. `team1@co.com, team2@co.com, team3@co.com`) whenever a registration occurs or payment is confirmed.

---

## 8. Multi-Recipient Team Notification System (`ADMIN_NOTIFICATION_EMAILS`)

### ❓ Why It Was Implemented
Event organizers and team members dealing directly with attendees need real-time alerts whenever a new registration is submitted or payment is confirmed, allowing them to follow up immediately without logging into the admin portal.

### 🛠️ How It Works
- **Configurable Environment Variable**:
  - `ADMIN_NOTIFICATION_EMAILS="team1@company.com, team2@company.com, team3@company.com"`
- **Triggers**:
  - **Trigger A (New Registration)**: Dispatches `🚨 [NEW REGISTRATION] #38ABD9B5 — Shaurya Kumar (Pending)` to all configured team members with complete contact details.
  - **Trigger B (Payment Confirmed)**: Dispatches `💰 [PAYMENT RECEIVED] #38ABD9B5 — Shaurya Kumar (₹5,664 Received)` with Razorpay Payment ID, amount paid, and coupon status.

---

## 9. Award Nomination Security, Duplicate Locking & Pay Later Resumption

### ❓ Why It Was Implemented
Brings the exact same enterprise security, duplicate prevention, payment recovery, and team notification architecture to Award Nominations, while keeping the entry fee fixed at **₹9,440** (₹8,000 + 18% GST) without date-based tier shifts.

### 🛠️ How It Works
- **Duplicate Prevention**: Canonical email/mobile matching prevents duplicate nomination entries in MongoDB.
- **SHA-256 Hashed Resume Links**: Generates unguessable payment resumption links (`?nominationToken=...`) with 14-day expiry. Token is permanently nullified upon payment completion.
- **Timing-Safe Payment Signature Verification**: Uses `crypto.timingSafeEqual` HMAC checks.
- **Automated Dual Email Alerts**: Dispatches attendee confirmation email + internal team notifications to `info@snailintegral.com`, `marketing@snailintegral.com`, and `snailintegral@gmail.com`.

---

## 10. Media Kit Page

### ❓ Why It Was Implemented
Sponsors, partners, exhibitors, delegates, and speakers need official graphics, logo files, and brand assets to promote their participation. Instead of emailing assets individually, a self-serve download page ensures consistent, high-resolution brand usage.

### 🛠️ How It Works
- **Route**: `/media-kit` (Next.js App Router static page).
- **Navigation**: The "Social Media Kit" button in the main website navbar (desktop + mobile) links to this page.
- **Page Sections**:
  1. **Hero Section** — Full-viewport (`min-h-screen`) green gradient hero using the brand primary colour (`#6a9a38`), animated glow blobs, `framer-motion` entrance transitions, gold "Media Kit" title, and a scroll-indicator.
  2. **Section 01 — Logos**: Two sub-grids:
     - *Brand R.Comm Logos*: 4 logo variants (Official, Horizontal Dark, Horizontal Light, Season 3) as downloadable PNG cards with dot-grid transparency preview backgrounds.
     - *Snail Integral Logos*: 5 logo variants (Official, Connect, Alt A/B/C).
     - All image previews are wrapped in `<a download>` anchor tags — clicking the preview or the button triggers direct file download.
  3. **Section 02 — Social Media Graphic Templates**: A compact `max-w-sm` card displaying a colour-corrected template PNG (`social_template.png`) with a hover download overlay and inline download button.
  4. **Section 03 — Official Brochures**: 4 light-themed download cards (white bg, green border):
     - Brand R.Comm 2026 Official Brochure
     - Brand R.Comm 2026 Awards Brochure
     - Brand R.Comm 2026 Sponsorship Deliverables
     - Snail Integral Corporate Profile 2026
- **Template Colour Correction**: The social media template (`All SM Templates-06.jpg.jpeg`) was processed via a Pillow Python script that replaced its bright green tones with the website primary green (`#6a9a38`) using HSV range detection, outputting `social_template.png`.
- **Animations**: Powered by `framer-motion` — all sections use `whileInView` entrance transitions with `staggerChildren` for the card grids.

---

## 📝 Revision Log

| **Date** | **Change** | **Files** | **Author** |
|---|---|---|---|
| **2026-08-25** | Media Kit Page — hero, logos, social templates, brochures | `frontend/src/app/media-kit/page.js`, `Navbar.jsx`, assets | Antigravity AI |
| **2026-08-25** | Admin Panel complete documentation — all 7 sections | `admin/src/app/dashboard/*` | Antigravity AI |
| **2026-08-06** | Award Nomination Security, Hashed Resume Tokens & Duplicate Prevention | `nominationController.js`, `AwardNomination.js`, `AwardNominationModal.jsx` | Antigravity AI |
| **2026-08-06** | Multi-Recipient Team Notification System | `emailService.js` | Antigravity AI |
| **2026-08-06** | PRICING_TEST_DATE Dev Simulation Testing Mode | `delegateController.js`, `DelegateRegistrationModal.jsx` | Antigravity AI |
| **2026-08-06** | Initial creation of Master Feature Documentation | System-wide | Antigravity AI |
| **2026-08-06** | Dynamic IST Pricing & Hashed Resume Tokens | `delegateController.js`, `DelegateRegistration.js` | Antigravity AI |
| **2026-08-06** | Financial Accounting (`totalAmount`, `amountPaid`, `amountDue`) | `DelegateRegistration.js` | Antigravity AI |
| **2026-08-06** | Duplicate Check & Identity Locking | `delegateController.js` | Antigravity AI |
| **2026-08-06** | Reordered Delegates Table & Multi-Filter Bar | `admin/src/app/dashboard/delegates/page.jsx` | Antigravity AI |

---
*End of Documentation.*
