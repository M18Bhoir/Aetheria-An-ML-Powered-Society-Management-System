# Aetheria-An-ML-Powered-Society-Management-System

## Overview

Aetheria is a full-stack community management web application built with React (Vite) frontend and Express.js backend. It provides features for residential community management including authentication, admin dashboards, voting/polls, amenity booking, marketplace, guest passes, ticketing, payments (Razorpay), and analytics.

## Project Architecture

- **Frontend**: React 19 + Vite + Tailwind CSS 4, located in `my-app/`
- **Backend**: Express.js + Mongoose (MongoDB), located in `my-app/backend/`
- **Database**: MongoDB (external, requires MONGO_URI)
- **Payments**: Razorpay integration (requires RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
- **SMS**: Twilio integration (requires Twilio credentials)

## Ports

- Frontend (Vite dev server): port 5000 (0.0.0.0)
- Backend (Express API): port 3000 (localhost)
- Vite proxies `/api` requests to the backend on port 3000

## Environment Variables Required

- `JWT_SECRET` - Secret key for JWT authentication (set)
- `MONGO_URI` - MongoDB connection string (user must provide)
- `RAZORPAY_KEY_ID` - Razorpay API key (optional, for payments)
- `RAZORPAY_KEY_SECRET` - Razorpay API secret (optional, for payments)
- `PORT` - Backend port (set to 3000)

## Development Workflow

- Run `npm run dev` from `my-app/` for frontend
- Run `node backend/server.js` from `my-app/` for backend
- Both run together via the "Start application" workflow

## Deployment

- Build: `cd my-app && npm run build` (produces `dist/` folder)
- Production: Backend serves the built frontend from `dist/` and runs API on port 5000

## Recent Changes

- 2026-02-15: Configured for Replit environment
  - Vite configured to run on port 5000 with allowedHosts
  - Backend runs on port 3000, proxied by Vite
  - CORS updated to allow all origins
  - API base URL uses relative paths (proxied through Vite)
  - Graceful handling of missing MONGO_URI and Razorpay keys
