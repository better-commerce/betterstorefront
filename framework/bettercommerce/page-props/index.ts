import { HomePageProps } from "./HomePageProps"; 
import { CommonPageProps } from "./CommonPageProps"; 
import { IPagePropsProvider } from "@framework/contracts/page-props/IPagePropsProvider";
import { EmptyObject, } from "@components/utils/constants";
import { TermsAndConditionsPageProps } from "./TermsAndConditionsPageProps";
import { SearchPageProps } from "./SearchPageProps";
import { PrivacyPolicyPageProps } from "./PrivacyPolicyPageProps";
import { CookiePolicyPageProps } from "./CookiePolicyPageProps";
import { ContactUsPageProps } from "./ContactUsPageProps";
import { CartPageProps } from "./CartPageProps";
import { PDPPreviewPageProps } from "./PDPPreviewPageProps";
import { MembershipPageProps } from "./MembershipPageProps";
import { WishlistPageProps } from "./WishlistPageProps";
import { AccountMembershipPageProps } from "./AccountMembershipPageProps";
import { CollectionPLPPageProps } from "./CollectionPLPPageProps";
import { CheckoutPageProps } from "./CheckoutPageProps";
import { BrandPLPPageProps } from "./BrandPLPPageProps";
import { PDPPageProps } from "./PDPPageProps";

export enum PagePropType {
    HOME = 'home',
    SEARCH = 'search',
    COLLECTION_PLP = 'collection_plp',
    BRAND_PLP = 'brand_plp',
    PDP = 'pdp',
    PDP_PREVIEW = 'pdp_preview',
    CART = 'cart',
    CHECKOUT = 'checkout',
    MEMBERSHIP = 'membership',
    ACCOUNT_MEMBERSHIP = 'account_membership',
    WISHLIST = 'wishlist',
    CONTACT_US = 'contact_us',
    COOKIE_POLICY = 'cookie_policy',
    PRIVACY_POLICY = 'privacy_policy',
    TERMS_AND_CONDITIONS = 'terms_and_conditions',
    COMMON = 'common'
}

/**
 * Factory helper method returning {IPagePropsProvider} object. Returns the factory object for rendering PageProp values.
 * @param data 
 * @returns 
 */
export const getPagePropType = (data: any) => {
    const obj = getObject(data?.type)
    if (obj) {
        return obj
    }
    return EmptyObject
}

/**
 * Evaluates the {PagePropType} and returns {IPagePropsProvider} factory object.
 * @param type 
 * @returns 
 */
const getObject = (type: PagePropType): IPagePropsProvider | undefined => {
    let obj
    switch(type) {
        case PagePropType.HOME:
            obj = new HomePageProps()
            break

        case PagePropType.SEARCH:
            obj = new SearchPageProps()
            break
        
        case PagePropType.CART:
            obj = new CartPageProps()
            break

        case PagePropType.CHECKOUT:
            obj = new CheckoutPageProps()
            break

        case PagePropType.WISHLIST:
            obj = new WishlistPageProps()
            break

        case PagePropType.MEMBERSHIP:
            obj = new MembershipPageProps()
            break

        case PagePropType.ACCOUNT_MEMBERSHIP:
            obj = new AccountMembershipPageProps()
            break

        case PagePropType.COLLECTION_PLP:
            obj = new CollectionPLPPageProps()
            break
        
        case PagePropType.BRAND_PLP:
            obj = new BrandPLPPageProps()
            break

        case PagePropType.PDP:
            obj = new PDPPageProps()
            break

        case PagePropType.PDP_PREVIEW:
            obj = new PDPPreviewPageProps()
            break
        
        case PagePropType.CONTACT_US:
            obj = new ContactUsPageProps()
            break

        case PagePropType.COOKIE_POLICY:
            obj = new CookiePolicyPageProps()
            break

        case PagePropType.PRIVACY_POLICY:
            obj = new PrivacyPolicyPageProps()
            break

        case PagePropType.TERMS_AND_CONDITIONS:
            obj = new TermsAndConditionsPageProps()
            break

        case PagePropType.COMMON:
            obj = new CommonPageProps()
            break
    }
    return obj
}