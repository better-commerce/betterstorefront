import { NextRequest, NextResponse } from "next/server";

const REWRITE_HANDLER = [
    // Categories
    { type: 'category', handler: '/category' },

    // Subcategories
    { type: 'subcategory', handler: '/category' },

    // Brands
    { type: 'brand', handler: '/brands' },

    // Brands
    { type: 'product', handler: '/products' },

    // CMS Pages
    { type: 'cms', handler: '/company' },

    // Blog
    { type: 'blog-category', handler: '/blog' },
    { type: 'blog-article', handler: '/blog' },

    // Stores
    { type: 'store-detail', handler: '/store-locator' },
]

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip processing for static assets and API routes
    if (shouldSkip(pathname)) {
        return NextResponse.next();
    }

    // Address all static paths
    if (matchStaticPaths(pathname)) {
        return NextResponse.next();
    } else {

        let staticRewritePath = '';
        if (pathname.startsWith('/shop/')) {
            staticRewritePath = `/products/${pathname?.split('/').slice(2).join('/')}`;
        } else if (pathname === '/stores') {
            staticRewritePath = "/store-locator";
        }
        if (staticRewritePath) {
            return NextResponse.rewrite(new URL(staticRewritePath, request.url));
        }

        // Query slug resolver API
        try {
            const apiUrl = new URL('/api/slug-resolver', request.url);
            apiUrl.searchParams.set('path', pathname?.trim());

            const response = await fetch(apiUrl, {
                headers: { 'Content-Type': 'application/json' },
                next: { revalidate: 10 } // Revalidate every 10 seconds
            });

            if (response.ok) {
                const { rewriteType } = await response.json();
                const rewriteHandler = REWRITE_HANDLER.find(handler => handler.type === rewriteType);
                if (rewriteHandler) {
                    return NextResponse.rewrite(new URL(`${rewriteHandler.handler}${pathname}`, request.url));
                }
            }
        } catch (error) {
            console.error('Slug resolution failed:', error);
            return NextResponse.redirect(new URL("/404", request.url));
        }
    }
    return NextResponse.next();
}

const EXACT_STATIC_PATHS = new Set(["/", "/404", "/500", "/cart", "/contact-us", "/cookie-policy", "/password-protection", "/payment-failed", "/privacy-policy", "/terms-and-condition", "/terms-and-conditions", "/search", "/thank-you", "/validate", "/wishlist",]);

const PARTIAL_STATIC_PATH_PREFIXES = ["/account", "/brands", "/blog", "/cache", "/category", "/checkout", "/collection", "/company", "/feed", "/home", "/kit", "/lookbook", "/my-account", "/my-membership", "/my-store", "/page", "/payment-notification", "/preview", "/products", "/quote", "/search", "/sell-or-part-exchange", "/store-locator"] as const;

function matchStaticPaths(pathname: string): boolean {
    // exact-match paths
    if (EXACT_STATIC_PATHS.has(pathname)) {
        return true;
    }

    // any of the prefix-based “static” paths
    return PARTIAL_STATIC_PATH_PREFIXES.some(prefix => pathname.startsWith(prefix));
}

// Only handle root-level paths (avoid nested API calls)
function shouldSkip(pathname: string): boolean {
    return pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/static') || pathname.includes('.')
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
