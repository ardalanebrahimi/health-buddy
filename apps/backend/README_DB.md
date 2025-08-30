# Database Setup Instructions

This document explains how to set up the PostgreSQL database and run migrations for the Health Companion backend.

## Prerequisites

- PostgreSQL server running locally or accessible remotely
- Node.js 18+ installed
- npm package manager

## Initial Setup

1. **Configure Database Connection**

   Update the `DATABASE_URL` in `.env` file:

   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/health_companion?schema=public"
   ```

   Replace:

   - `username`: Your PostgreSQL username
   - `password`: Your PostgreSQL password
   - `localhost:5432`: Your PostgreSQL host and port
   - `health_companion`: Your database name

2. **Install Dependencies**

   **Important**: This project uses npm workspaces. Install dependencies from the root directory:

   ```bash
   # From the root directory (health-buddy/)
   cd c:\Users\ardal\health-buddy
   npm run install:all
   ```

   If you need to install additional packages in the backend:

   ```bash
   # From the root directory
   npm install <package-name> --workspace=apps/backend
   ```

3. **Generate Prisma Client**

   ```bash
   # From the backend directory
   cd apps/backend
   npm run db:generate
   ```

4. **Run Initial Migration**

   ```bash
   # From the backend directory (after configuring DATABASE_URL)
   npm run db:migrate
   ```

5. **Seed Database with Demo Data**
   ```bash
   # From the backend directory
   npm run db:seed
   ```

## Available Scripts

- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations in development
- `npm run db:seed` - Seed database with demo data

## Database Schema

The initial migration creates the following tables:

### Core Tables

- **profiles** - User demographics and baseline health info
- **goals** - User health and fitness goals
- **meals** - Meal logging entries
- **meal_items** - Individual food items within meals
- **meal_photos** - Photos associated with meals
- **hydration** - Water intake tracking
- **biometrics_weight** - Weight measurements over time
- **companion_messages** - Daily AI companion summaries

### Key Features

- **UUID Primary Keys** - All tables use UUID for primary keys
- **Timestamps** - All tables include `created_at` and `updated_at` (where applicable)
- **UTC Storage** - All timestamps stored as `timestamptz` in UTC
- **Indexes** - Optimized for common query patterns:
  - `profiles(user_id)`
  - `meals(user_id, taken_at)`
  - `meal_items(meal_id)`
  - `hydration(user_id, taken_at)`
  - `biometrics_weight(user_id, taken_at)`
  - `companion_messages(user_id, date)`

### Data Types

- **Decimal Fields** - Weight values stored as `DECIMAL(5,1)` for precision
- **JSON Fields** - Flexible storage for metadata and configurations
- **Enums** - `MealStatus` enum for meal processing states

## Demo Data

The seed script creates:

- One demo user profile with sample demographics
- A goal entry with target values
- A sample meal with food item and photo
- A hydration entry (250ml water)
- A weight measurement entry
- A daily companion message

All demo data uses a consistent `userId` for easy identification and cleanup.

## Future Considerations

The schema is designed with Row Level Security (RLS) in mind:

- All user-owned tables include a `userId` field
- Foreign key relationships maintain data integrity
- Indexes support multi-tenant queries when RLS is enabled

## Troubleshooting

**Connection Issues**

- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists (create manually if needed)

**Migration Issues**

- Make sure no other migrations are running
- Check Prisma version compatibility
- Reset migration state if needed: `npx prisma migrate reset`

**Permission Issues**

- Ensure PostgreSQL user has CREATE permissions
- Verify schema permissions if using non-public schema
