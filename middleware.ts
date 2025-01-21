// Base Imports
import { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

const IGNORE_PATHS = ['/favicon.ico', '/serviceworker.js', '/_next', '/theme', '/assets', '/fonts', '/api', '.svg', '.png', '.jpg', '.jpeg']

export async function middleware(request: NextRequest, ev: NextFetchEvent) {
    let requestOrigin = request.nextUrl.origin
    if (process.env.NODE_ENV === 'production') {
        requestOrigin = `${request.headers.get('x-forwarded-proto')}://${request.headers.get('x-forwarded-host')}`
    }
    const search = request.nextUrl.search
    const pathname = search ? `${request.nextUrl.pathname}${search}` : request.nextUrl.pathname

    const isIgnoredRoute = (IGNORE_PATHS.find((x: any) => pathname.includes(x)) != null)
    if (isIgnoredRoute) {

        // Continue with the request
        return NextResponse.next()
    } else {

        if (pathname.endsWith('/features.config.json')) {
            const redirectUrl = `${requestOrigin}/404`
            const response = NextResponse.redirect(redirectUrl)
            return response
        }
    }

    // Continue with the request
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next|favicon.ico|assets|serviceworker.js).*)',
        '/:path*'
    ],
}