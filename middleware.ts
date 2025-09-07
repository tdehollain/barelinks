import { next } from '@vercel/functions';
import { createClerkClient } from '@clerk/backend';
import { log } from 'console';

export const config = {
  runtime: 'nodejs', // defaults to 'edge'
  matcher: '/api/:path*', // Only apply middleware to /api/* routes
};

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});

async function authenticateUser(req: Request): Promise<string | null> {
  try {
    let authorizedParty: string = '';
    if (!process.env.VERCEL_ENV) {
      authorizedParty = 'http://localhost:3000';
    } else if (process.env.VERCEL_ENV === 'preview') {
      authorizedParty = `https://dev.barelinks.in`;
    } else if (process.env.VERCEL_ENV === 'production') {
      authorizedParty = `https://www.barelinks.in`;
    } else {
      throw new Error('Unknown VERCEL_ENV value');
    }
    // console.log('Authorized Party:', authorizedParty);

    const requestState = await clerkClient.authenticateRequest(req, {
      jwtKey: process.env.CLERK_JWT_KEY,
      authorizedParties: [authorizedParty],
    });
    // log('Request State:', requestState);

    const auth = requestState.toAuth();

    return auth?.userId || null;
  } catch (error) {
    console.error('Authentication failed:', error);
    return null;
  }
}

export default async function middleware(request: Request) {
  log('VERCEL_ENV:', process.env.VERCEL_ENV);
  log('VERCEL_URL:', process.env.VERCEL_URL);
  log('VERCEL_BRANCH_URL:', process.env.VERCEL_BRANCH_URL);
  log('VERCEL_PROJECT_PRODUCTION_URL:', process.env.VERCEL_PROJECT_PRODUCTION_URL);
  log('Request Method:', request.method);
  log('Request URL:', request.url);

  // Authentication check
  const userId = await authenticateUser(request);
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Authentication required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return next({ headers: { 'x-user-id': userId } });
}
