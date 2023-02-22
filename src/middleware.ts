import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
const CryptoJS = require('crypto-js')

export async function middleware(request: NextRequest) {
    const token = request.cookies.get(process.env.PRI_TOKEN)

    try {
        const bytes = CryptoJS.AES.decrypt(token, process.env.SECRET_KEY)
        const secretPass = bytes.toString(CryptoJS.enc.Utf8)

        if (token) {
            if (secretPass === process.env.SECRET_PASS) {
                if (request.nextUrl.pathname.startsWith('/login')) {
                    return NextResponse.redirect(new URL('/', request.url))
                } else {
                    return NextResponse.next()
                }
            }
        }

        throw new Error()
    } catch {
        if (request.nextUrl.pathname.startsWith('/login')) {
            return NextResponse.next()
        } else {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }
}

export const config = {
    matcher: [
        /*
           * Match all request paths except for the ones starting with:
           * - api (API routes)
           * - _next/static (static files)
           * - _next/image (image optimization files)
           * - favicon.ico (favicon file)
           */
        '/((?!api|_next/static|static|_next/image|favicon.ico).*)',
    ],
}