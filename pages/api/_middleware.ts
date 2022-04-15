import next from 'next'
import type { NextFetchEvent, NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import store from 'store'

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  let cookies = req.cookies
  if (cookies.Currency) store.set('Currency', cookies.Currency)
  if (cookies.Language) store.set('Language', cookies.Language)
  if (cookies.Country) store.set('Country', cookies.Country)
  return NextResponse.next()
}
