// Package Imports
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

// Other Imports
import { Cookie } from '@framework/utils/constants'

export async function middleware(request: NextRequest, _next: NextFetchEvent) {
  const res = NextResponse.next()
  let ip = request.ip ?? request.headers.get('x-real-ip')
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (!ip && forwardedFor) {
    ip = forwardedFor.split(',').at(0) ?? 'Unknown'
  }
  if (ip) {
    res.cookies.set(Cookie.Key.IP_ADDRESS, ip, {
      httpOnly: false,
    })
  }

  return res
}
