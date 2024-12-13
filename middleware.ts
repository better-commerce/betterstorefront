import { getMicrositeConfig, micrositeMatch } from '@commerce/utils/uri-util';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js middleware to handle microsite URLs.
 *
 * This middleware checks if the incoming URL has a microsite slug prefix (e.g., `/us/path*`)
 * and rewrites the URL to the original path if a matching microsite is found in the
 * `microsites.json` file.
 *
 * @param {NextRequest} request - The incoming request object
 * @returns {NextResponse} - The rewritten response or the original response if no microsite is found
 */
export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname; // Change from req.nextUrl to req.url in TypeScript
    const match = micrositeMatch(pathname)
    if (match) {
        const microsite = match[1]; // Extract the microsite slug
        console.log({ slug: microsite });
        const micrositeConfig = getMicrositeConfig(microsite)
        if (micrositeConfig) {
            const newPathname = match[2] || '/'; // Extract the remaining path or fallback to "/"
            console.log({ slug: microsite, newPathname });

            // Rewrite the URL to the original path
            const url = request.nextUrl.clone();
            url.pathname = newPathname;
            url.searchParams.set('microsite', microsite); // Pass the microsite slug as a query param

            return NextResponse.rewrite(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next|theme|images|favicon.ico|assets|serviceworker.js).*)',
        '/:path*'
    ],
}