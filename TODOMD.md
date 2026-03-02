# Implementation Plan: Payment Receipt Features

## Task

- A simple client-side PDF receipt in User_Dashboard.jsx right after successful verification
- A backend email sender in paymentRoutes.js using nodemailer, with a minimal HTML template

## Implementation Steps

### Step 1: Install nodemailer in backend

- [ ] Install nodemailer package in backend

### Step 2: Create email utility in backend

- [ ] Create backend/utils/sendEmail.js with nodemailer configuration
- [ ] Create an HTML email template for the receipt

### Step 3: Modify paymentRoutes.js

- [ ] Import the email utility
- [ ] Send email after successful payment verification

### Step 4: Modify User_Dashboard.jsx

- [ ] Import jspdf
- [ ] Create a function to generate PDF receipt
- [ ] Add PDF download functionality in payment success handler
- [ ] Show user-friendly message about PDF download

## Dependencies

- Frontend: jspdf (already installed ✓)
- Backend: nodemailer (needs to be installed)
