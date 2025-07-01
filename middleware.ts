// middleware.ts
import { CURRENT_THEME } from '@components/utils/constants'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
const featureToggle = require(`/public/theme/${CURRENT_THEME}/features.config.json`)

const IGNORE_PATHS = ['/favicon.ico', '/serviceworker.js', '/_next', '/theme', '/assets', '/fonts', '/api', '.svg', '.png', '.jpg', '.jpeg']

export function middleware(req: NextRequest) {
    const pathName = req.nextUrl.pathname
    const isIgnoredRoute = (IGNORE_PATHS.find((x: any) => pathName.includes(x)) != null)
    if (isIgnoredRoute) {
        return NextResponse.next()
    }

    if (featureToggle?.features?.enableRakutenAnalytics) {
        const { pathname, searchParams } = req.nextUrl

        // Change this to match whatever path you choose for your gateway page
        if (pathname === '/rakuten') {
            const siteID = searchParams.get('siteID')
            // default to home page if no URL provided
            const destination = searchParams.get('url') || '/'

            // Build our redirect response
            const res = NextResponse.redirect(destination)

            if (siteID) {
                // GMT string, e.g. "Tue, 01 Jul 2025 09:00:00 GMT"
                const nowGMT = new Date().toUTCString()

                // You can encode siteID if it might contain '|' or other delimiters
                const cookieValue = `${encodeURIComponent(siteID)}|${nowGMT}`

                // Set cookie for 2 years from now
                const twoYears = 2 * 365 * 24 * 60 * 60 * 1000
                const expires = new Date(Date.now() + twoYears)

                if (process.env.NODE_ENV === 'development')
                    res.cookies.set({ name: 'siteID', value: cookieValue, path: '/', expires, })
                else
                    res.cookies.set({ name: 'siteID', value: cookieValue, path: '/', httpOnly: (process.env.NODE_ENV === 'production'), secure: (process.env.NODE_ENV === 'production'), expires, })
            }

            return res
        }
    }

    // all other paths fall through
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next|favicon.ico|assets|serviceworker.js).*)',
        '/:path*'
    ],
}