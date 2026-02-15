# TODO List - Fixing Features

## 1. Fix Voting System Route Mismatch

- [x] Fix backend route in pollRoutes.js to match frontend URL pattern
- [x] The frontend calls `/api/polls/${pollId}/vote` but backend expects `/api/polls/vote/${pollId}`
- [x] Change backend route from `/vote/:pollId` to `/:pollId/vote`

## 2. Fix Razorpay Payment System

- [x] Add create-order endpoint in backend (paymentRoutes.js)
- [x] Add frontend code in User Dashboard to trigger Razorpay checkout

## 3. Testing

- [ ] Test voting system - ensure votes are recorded
- [ ] Test Razorpay payment flow
