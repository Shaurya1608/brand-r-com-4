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
6. [Admin Panel Delegates Management & Sticky Table Navigation](#6-admin-panel-delegates-management--sticky-table-navigation)
7. [Automated Resend Email Notifications & Idempotency](#7-automated-resend-email-notifications--idempotency)

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

## 6. Admin Panel Delegates Management & Sticky Table Navigation

### ❓ Why It Was Implemented
To give event administrators real-time visibility, search, multi-filter capabilities, and manual delegate registration tools.

### 🛠️ How It Works
- **Location**: `admin/src/app/dashboard/delegates/page.jsx`.
- **21 Reordered Table Columns**:
  1. Checkbox, 2. S.No., 3. Reg. ID, 4. Reg. Date & Time, 5. Delegate TYPE, 6. Company GST No., 7. Attendee Category, 8. Name, 9. Designation, 10. Organization, 11. Mobile number, 12. Email, 13. City, 14. State/Country, 15. Pincode, 16. Address, 17. Reg. Type, 18. Amount, 19. Payment & Type, 20. Coupon Registration, 21. Actions.
- **Sticky Column Anchoring**:
  - `Checkbox` (`left: 0px`), `S.No.` (`left: 48px`), `Reg. ID` (`left: 98px`), and `Name` (`left: 198px` with shadow border) remain frozen on horizontal scroll.
- **7-Control Multi-Filter Bar**:
  - Search input, Payment Status, Delegate Type, Registration Type, Attendee Category, Payment Method, Coupon Registration filter, and `Reset Filters` button.
- **Manual Delegate Registration Modal** (`AddDelegateModal.jsx`):
  - Form matching wireframe with INR/USD selector, Payment Status enum (`Pending`, `Paid`, `Failed`, `Invitee`), Attendee Category, `#IAP2026` coupon checkbox, and `registeredBy` field.

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

## 📝 Revision Log

| **2026-08-06** | Award Nomination Security, Hashed Resume Tokens & Duplicate Prevention | `nominationController.js`, `AwardNomination.js`, `AwardNominationModal.jsx` | Antigravity AI |
| **2026-08-06** | Multi-Recipient Team Notification System (`ADMIN_NOTIFICATION_EMAILS`) | `emailService.js` | Antigravity AI |
| **2026-08-06** | PRICING_TEST_DATE Dev Simulation Testing Mode | `delegateController.js`, `DelegateRegistrationModal.jsx` | Antigravity AI |
| **2026-08-06** | Initial creation of Master Feature Documentation | System-wide | Antigravity AI |
| **2026-08-06** | Dynamic IST Pricing & Hashed Resume Tokens | `delegateController.js`, `DelegateRegistration.js` | Antigravity AI |
| **2026-08-06** | Financial Accounting (`totalAmount`, `amountPaid`, `amountDue`) | `DelegateRegistration.js` | Antigravity AI |
| **2026-08-06** | Duplicate Check & Identity Locking | `delegateController.js` | Antigravity AI |
| **2026-08-06** | Reordered Delegates Table & Multi-Filter Bar | `admin/src/app/dashboard/delegates/page.jsx` | Antigravity AI |

---
*End of Documentation.*
