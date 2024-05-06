import { useMemo } from 'react'
import { useTranslation } from '@commerce/utils/use-translation'
import { roundToDecimalPlaces, stringFormat } from '@framework/utils/parse-util'
import { Logo } from '@components/ui'

const ProductMembershipOfferModal = ({ open, defaultDisplayMembership, price, isIncludeVAT, closeCallback }: any) => {
    if (!open) return null

    const translate = useTranslation()
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
            <div className="max-w-md p-2 bg-white rounded-lg z-100">
                <div className="flex justify-end">
                    <button onClick={() => closeCallback()} className="text-gray-500 hover:text-gray-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-center">
                        <Logo />
                    </div>
                    <div className="mt-6">
                        <p className="text-lg font-medium text-center">
                            <span className="justify-center">{stringFormat(translate('label.membership.membershipPromotionOfferDiscountText'), { membershipPromoDiscountPerc: defaultDisplayMembership?.membershipPromoDiscountPerc })}</span>
                        </p>
                        <p className="mt-4 text-sm font-normal text-center text-gray-600">
                            {stringFormat(translate('label.membership.membershipPromotionMemberDiscountText'), { discountedPrice })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductMembershipOfferModal