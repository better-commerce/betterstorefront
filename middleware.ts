// Base Imports
import { NextRequest, NextResponse } from 'next/server'

// Other Imports
import { Cookie } from '@framework/utils/constants'
import { stringToBoolean } from '@framework/utils/parse-util'

const PAYMENT_LINK_ALLOWED_URLS = [
  '/checkout',
  '/payment-notification',
  '/thank-you',
  '/payment-failed',
]

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  let isPaymentLink = false
  const paymentLinkCookie = request.cookies.get(
    Cookie.Key.IS_PAYMENT_LINK
  )?.value
  if (paymentLinkCookie) {
    isPaymentLink = stringToBoolean(paymentLinkCookie)
  }

  if (isPaymentLink) {
    const permittedRedirect = PAYMENT_LINK_ALLOWED_URLS.find((x: any) =>
      pathname.includes(x)
    )
    if (!permittedRedirect) {
      return NextResponse.redirect(`${request.nextUrl.origin}/checkout`)
    }
  }

  // If route url is not in lowercase.
  if (pathname !== pathname.toLocaleLowerCase()) {
    // Redirect to route enforced with lowercases.
    return NextResponse.redirect(
      `${request.nextUrl.origin}${pathname.toLocaleLowerCase()}`
    )
  }

  // Continue
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - serviceworker.js
     * - theme
     * - assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|serviceworker.js|theme|assets).*)',
    '/',
  ],
}
