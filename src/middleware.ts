import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import {routing} from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);
const blockedCountries = new Set(['CN', 'SG']);

export default function middleware(request: NextRequest) {
    const country = (request.headers.get('x-vercel-ip-country') ?? 'unknown').toUpperCase();

    if (blockedCountries.has(country)) {
        return new NextResponse('Access denied', { status: 403 });
    }

    return handleI18nRouting(request);
}

export const config = {
    // Match all pathnames except for
    // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};