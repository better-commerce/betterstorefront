import { NextRequest, NextResponse } from "next/server";

interface SlugApiResponse { slugType: EntitySlugTypes }

export enum EntitySlugTypes {
    NONE = 0,
    PRODUCT = 1,
    MANUFACTURER = 2,
    SUB_BRAND = 3,
    CATEGORY = 4,
    ATTRIBUTE = 5,
    ATTRIBUTE_SET = 6,
    LIST_DATASET = 7,//Now this is Collection
    SITE_VIEW = 8,//Static pages
    BLOG = 9,
    PRODUCT_CUSTOM_FIELD_MAPPING = 10,
    LOOKBOOK = 11, //used for lookbook
    BLOG_CATEGORY = 12
}

const REWRITE_HANDLER: Partial<Record<EntitySlugTypes, string>> = {
    [EntitySlugTypes.CATEGORY]: '/category',
    [EntitySlugTypes.SUB_BRAND]: '/brands',
    [EntitySlugTypes.LIST_DATASET]: '/collection',
    [EntitySlugTypes.PRODUCT]: '/shop',
    [EntitySlugTypes.BLOG]: '/blog',
    [EntitySlugTypes.BLOG_CATEGORY]: '/blog',
};

// TODO Handlers for other types
// // CMS Pages
// { type: 'cms', handler: '/company' },

// // Stores
// { type: 'store-detail', handler: '/store-locator' },

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip processing for static assets and API routes
    if (shouldSkip(pathname)) {
        return NextResponse.next();
    }

    // // Middleware logic should execute ONLY when [enableEntityNameInPageSlug] is FALSE.
    // const featureToggle: any = await getFeatureToggle();
    // if (featureToggle?.features?.enableEntityNameInPageSlug) {
    //     return NextResponse.next();
    // }

    // Address all static paths
    if (matchStaticPaths(pathname)) {
        return NextResponse.next();
    } else {

        let staticRewritePath = '';
        if (pathname === '/brand') {
            staticRewritePath = "/brands";
        } else if (pathname === '/stores') {
            staticRewritePath = "/store-locator";
        }
        if (staticRewritePath) {
            return NextResponse.rewrite(new URL(staticRewritePath, request.url));
        }

        // Query slug resolver API
        try {
            const apiUrl = new URL('/api/slug-resolver', request.url);
            apiUrl.searchParams.set('slug', pathname?.trim());

            const response = await fetch(apiUrl, {
                headers: { 'Content-Type': 'application/json' },
                next: { revalidate: 10 } // Revalidate every 10 seconds
            });

            if (response.ok) {
                const { slugType } = (await response.json()) as SlugApiResponse;
                const rewriteHandler = REWRITE_HANDLER[slugType];
                if (rewriteHandler) {
                    const rewritePath = slugType === EntitySlugTypes.PRODUCT ? `${rewriteHandler}/${pathname.split('/').slice(2).join('/')}` : `${rewriteHandler}${pathname}`
                    //console.log("rewritePath", rewritePath)
                    return NextResponse.rewrite(new URL(rewritePath, request.url));
                }
            }
        } catch (error) {
            console.error('Slug resolution failed:', error);
            return NextResponse.redirect(new URL("/404", request.url));
        }
    }
    return NextResponse.next();
}

const EXACT_STATIC_PATHS = new Set(["/", "/404", "/500", "/cart", "/contact-us", "/cookie-policy", "/password-protection", "/payment-failed", "/privacy-policy", "/terms-and-condition", "/terms-and-conditions", "/search", "/thank-you", "/validate", "/wishlist", "/used-parents"]);

const PARTIAL_STATIC_PATH_PREFIXES = ["/account", "/brands", "/blog", "/cache", "/category", "/checkout", "/collection", "/company", "/feed", "/home", "/kit", "/lookbook", "/my-account", "/my-membership", "/my-store", "/page", "/payment-notification", "/preview", "/quote", "/search", "/sell-or-part-exchange", "/store-locator", "/used-parents"] as const;

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
