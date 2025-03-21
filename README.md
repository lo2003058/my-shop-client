# My Shop Client

A modern e-commerce frontend application built with Next.js, React, and TypeScript. This project provides a user-friendly shopping experience with features like user authentication, shopping cart, order management, address management, and more.

## Features

- **User Authentication**: Secure login system using NextAuth
- **Shopping Cart**: Add, remove, and update product quantities
- **Account Management**:
    - User profile management
    - Order history tracking
    - Address management (up to 5 addresses with default setting)
    - Wishlist functionality
- **Google Maps Integration**: For address selection and validation
- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **Secure Payments**: Integration with Stripe payment gateway

## Technologies

- Next.js 15
- React 18
- TypeScript
- Redux Toolkit (state management)
- Tailwind CSS (styling)
- NextAuth (authentication)
- Stripe (payment processing)
- FontAwesome (icons)
- SweetAlert2 (notifications)
- React Hook Form & Yup (form validation)

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd my-shop-client

# Install dependencies
yarn install
```

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
NODE_ENV=development
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
NEXT_PUBLIC_API_URL="http://localhost:8080"
NEXT_PUBLIC_GOOGLE_MAP_API_KEY="your-google-map-api-key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-key"
```

## Usage

```bash
# Run development server
yarn dev_client

# Build for production
yarn build_next

# Start production server
yarn start
```

## Project Structure

- `src/components/`: UI components
- `src/hooks/`: Custom React hooks
- `src/redux/`: Redux store configuration and slices
- `src/types/`: TypeScript type definitions
- `src/config/`: Application configuration
- `src/pages/`: Next.js pages

## Backend API

This frontend application connects to a backend API. By default, it connects to `http://localhost:8080` in development mode. You can configure the backend URL in the `.env.local` file.
