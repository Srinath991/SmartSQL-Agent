# SQL Agent Chat with Google OAuth

A Next.js application that implements Google OAuth authentication using Supabase and redirects users to a chat interface after successful authentication.

## Features

- 🔐 Google OAuth authentication via Supabase
- 💬 Real-time chat interface
- 🛡️ Protected routes with middleware
- 📱 Responsive design with Tailwind CSS
- ⚡ Server-side rendering with Next.js 15

## Prerequisites

Before you begin, ensure you have:

1. A [Supabase](https://supabase.com) account
2. A [Google Cloud Console](https://console.cloud.google.com) project with OAuth credentials
3. Node.js 18+ installed

## Setup Instructions

### 1. Supabase Setup

1. Create a new project in [Supabase](https://supabase.com)
2. Go to **Authentication** > **Providers** in your Supabase dashboard
3. Enable **Google** provider
4. Add your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
5. Set the **Redirect URL** to: `https://your-project-ref.supabase.co/auth/v1/callback`
6. Copy your project URL and anon key from **Settings** > **API**

### 2. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the **Google+ API**
4. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client IDs**
5. Set **Application type** to "Web application"
6. Add **Authorized redirect URIs**:
   - `https://your-project-ref.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for development)
7. Copy the **Client ID** and **Client Secret**

### 3. Environment Variables

1. Copy the `.env.local` file and update it with your credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace:
- `your_supabase_project_url` with your Supabase project URL
- `your_supabase_anon_key` with your Supabase anon key

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── callback/
│   │   │   └── route.js          # OAuth callback handler
│   │   └── auth-code-error/
│   │       └── page.js           # Authentication error page
│   ├── chat/
│   │   └── page.js               # Chat interface
│   ├── layout.js                 # Root layout
│   └── page.js                   # Home page with auth button
├── components/
│   └── AuthButton.js             # Authentication component
├── lib/
│   ├── supabase.js               # Client-side Supabase client
│   └── supabase-server.js        # Server-side Supabase client
└── middleware.js                 # Authentication middleware
```

## How It Works

1. **Authentication Flow**:
   - User clicks "Sign in with Google" on the home page
   - Redirected to Google OAuth consent screen
   - After consent, redirected to Supabase auth callback
   - Supabase processes the OAuth response
   - User is redirected to `/chat` page

2. **Route Protection**:
   - Middleware checks authentication status
   - Unauthenticated users accessing `/chat` are redirected to home
   - Authenticated users accessing `/` are redirected to `/chat`

3. **Chat Interface**:
   - Displays user information
   - Simple message interface (ready for backend integration)
   - Sign out functionality

## Customization

### Adding More OAuth Providers

To add more OAuth providers (GitHub, Discord, etc.):

1. Enable the provider in Supabase dashboard
2. Update the `AuthButton.js` component to include additional sign-in options
3. Configure the provider credentials in Supabase

### Styling

The application uses Tailwind CSS. You can customize the styling by:

1. Modifying the Tailwind classes in components
2. Updating the `globals.css` file
3. Adding custom CSS variables

### Chat Functionality

The current chat interface is a basic implementation. To add real functionality:

1. Set up a backend API for message handling
2. Integrate with a database for message persistence
3. Add real-time features using Supabase Realtime or WebSockets

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**:
   - Ensure your redirect URIs in Google Cloud Console match exactly
   - Check that your Supabase project URL is correct

2. **Authentication not working**:
   - Verify your environment variables are set correctly
   - Check that Google OAuth is enabled in Supabase
   - Ensure your domain is added to authorized domains in Google Cloud Console

3. **Middleware not working**:
   - Check that `middleware.js` is in the correct location (`src/middleware.js`)
   - Verify the matcher pattern in the middleware config

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).