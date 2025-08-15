# Fantasy Sports AI

Welcome to Fantasy Sports AI, a modern, data-driven application designed to help you dominate your fantasy football league. This platform integrates with your existing fantasy leagues, providing a rich interface and setting the stage for powerful AI-driven insights and recommendations.

## Core Features

- **Modern UI/UX**: A clean, responsive, and intuitive interface built with Next.js and shadcn/ui.
- **Light & Dark Mode**: A beautifully implemented, theme-aware design for comfortable viewing in any lighting.
- **User Authentication**: Secure user sign-up and login functionality powered by Clerk.
- **Yahoo Fantasy Sports Integration**: Connect your Yahoo account to seamlessly import your existing fantasy leagues, teams, and rosters.
- **Dynamic Data Model**: A robust and scalable backend powered by Convex, designed to handle complex fantasy sports data.
- **Automated Data Sync**: A daily cron job keeps your imported league data up-to-date with the latest information from Yahoo.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Backend & Database**: [Convex](https://www.convex.dev/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **External API**: [Yahoo Fantasy Sports API](https://developer.yahoo.com/fantasysports/guide/)

## Getting Started

Follow these steps to set up and run the project in your local development environment.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/fantasy-sports-ai.git
cd fantasy-sports-ai
```

### 2. Install Dependencies

This project uses `bun` as the package manager.

```bash
bun install
```

### 3. Set Up Environment Variables

This project requires several environment variables for authentication and API integration.

#### a. Clerk (Authentication)

1. Sign up for a free account at [Clerk.com](https://clerk.com/).
2. Create a new application and navigate to the **API Keys** section.
3. Create a `.env.local` file in the root of your project.
4. Copy the **Publishable key** and **Secret key** into your `.env.local` file:

   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

#### b. Convex (Backend & Database)

1. Sign up for a free account at [Convex.dev](https://www.convex.dev/).
2. Create a new project.
3. Follow the instructions to link your project by running `bunx convex dev`. This will populate your Convex environment variables in the `.env.local` file.

#### c. Yahoo (API Integration)

1. Sign up for a developer account at the [Yahoo Developer Network](https://developer.yahoo.com/apps/create/).
2. Create a new application with the following settings:
   - **Application Type**: `Confidential Client`
   - **API Permissions**: `Fantasy Sports` (Read/Write)
3. Go to your Convex project dashboard (**Settings** -> **Environment Variables**).
4. Add your Yahoo **Client ID** and **Client Secret** as two new variables:
   - `YAHOO_CLIENT_ID`
   - `YAHOO_CLIENT_SECRET`

### 4. Running the Development Servers

You need to run two processes in separate terminal windows:

1. **Start the Convex Backend:**

   ```bash
   bunx convex dev
   ```

2. **Start the Next.js Frontend:**

   ```bash
   bun dev
   ```

Your application should now be running at `http://localhost:3000`.

### 5. Testing the Yahoo OAuth Flow (Required)

The Yahoo API requires a secure `https://` redirect URI. To test the authentication flow locally, you must use a tunneling service like `ngrok`.

1. **Install `ngrok`**:

   ```bash
   brew install ngrok/ngrok/ngrok
   ```

2. **Start the tunnel**: In a new terminal, run:

   ```bash
   ngrok http 3000
   ```

3. **Update Your Settings**:
   - Copy the public `https://` URL provided by `ngrok`.
   - In your **Convex Dashboard**, update the `CONVEX_SITE_URL` environment variable to this new URL.
   - In your **Yahoo Developer App settings**, add a new **Redirect URI**: `[your-ngrok-url]/auth/yahoo/callback`.

You can now test the full Yahoo integration flow from your local machine.
