import { useMemo } from 'react'
import { roundToDecimalPlaces } from '@framework/utils/parse-util'

const ProductMembershipOfferModal = ({ open, defaultDisplayMembership, price, isIncludeVAT, closeCallback }: any) => {
    if (!open) return null

    const discountPerc = defaultDisplayMembership?.membershipPromoDiscountPerc || 0
    const discountedPrice = useMemo(() => {
        if (isIncludeVAT) {
            const discountedPrice = (price?.raw?.withTax * ((discountPerc) * 1.0 / 100.0))
            return `${price?.currencySymbol}${roundToDecimalPlaces(discountedPrice)}`
        }

        const discountedPrice = (price?.raw?.withoutTax * ((discountPerc) * 1.0 / 100.0))
        return `${price?.currencySymbol}${roundToDecimalPlaces(discountedPrice)}`
    }, [price, isIncludeVAT])
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-2 max-w-md z-100">
                <div className="flex justify-end">
                    <button onClick={() => closeCallback()} className="text-gray-500 hover:text-gray-700">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    </button>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-center">
                        <img src="/theme/blue/image/logo.png?fm=webp&amp;h=200" width="60" height="60" alt="Store" className="brand-logo" />
                    </div>
                    <div className="mt-4">
                        <p className="font-bold text-lg">
                            <span className="justify-center">{`Get ${defaultDisplayMembership?.membershipPromoDiscountPerc}% OFF, unlimited FREE delivery and unique offers all year round!*`}</span>
                        </p>
                        <p className="text-gray-600 mt-2">
                        {`That's a saving of ${discountedPrice} if you order today and become a My TFS member.`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductMembershipOfferModal