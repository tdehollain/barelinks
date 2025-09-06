import { next } from '@vercel/functions';
import { createClerkClient } from '@clerk/backend';

export const config = {
  runtime: 'nodejs', // defaults to 'edge'
  matcher: '/api/:path*',
};

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});

async function authenticateUser(req: Request): Promise<string | null> {
  try {
    const authorizedParties: string[] = [];
    if (!process.env.VERCEL_ENV) {
      authorizedParties.push(`http://${process.env.VERCEL_URL}`);
    } else {
      authorizedParties.push(`https://${process.env.VERCEL_URL}`);
      if (process.env.VERCEL_BRANCH_URL) authorizedParties.push(`https://${process.env.VERCEL_BRANCH_URL}`);
      if (process.env.VERCEL_PROJECT_PRODUCTION_URL) authorizedParties.push(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
    }

    console.log('Authorized Parties:', authorizedParties);

    const requestState = await clerkClient.authenticateRequest(req, {
      jwtKey: process.env.CLERK_JWT_KEY,
      authorizedParties: authorizedParties,
    });

    const auth = requestState.toAuth();

    return auth?.userId || null;
  } catch (error) {
    console.error('Authentication failed:', error);
    return null;
  }
}

export default async function middleware(request: Request) {
  console.log('VERCEL_ENV:', process.env.VERCEL_ENV);
  console.log('VERCEL_URL:', process.env.VERCEL_URL);
  console.log('VERCEL_BRANCH_URL:', process.env.VERCEL_BRANCH_URL);
  console.log('VERCEL_PROJECT_PRODUCTION_URL:', process.env.VERCEL_PROJECT_PRODUCTION_URL);

  // Authentication check
  const userId = await authenticateUser(request);
  if (!userId) {
    // return res.status(401).json({ error: 'Authentication required' });
    return new Response(JSON.stringify({ error: 'Authentication required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return next({ headers: { 'x-user-id': userId } });
}
