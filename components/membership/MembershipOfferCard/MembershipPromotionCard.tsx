import { useTranslation } from "@commerce/utils/use-translation";
import { stringFormat } from "@framework/utils/parse-util";

const MembershipPromotionCard = ({ moneySaved, defaultDisplayMembership, lowestMemberShipPrice, currencySymbol, setOpenOMM }:any) => {
  const translate = useTranslation()
  const handleOptMembershipModal = () => {
    setOpenOMM(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-2 text-center">
      <div className="flex items-center justify-center">
        <img src="/theme/blue/image/logo.png?fm=webp&amp;h=200" width="60" height="60" alt="Store" className="brand-logo" />
      </div>
      <div className="mt-4">
        <p className="font-bold text-lg">
          <span className="text-red-700"> {!!moneySaved && stringFormat(translate('label.membership.membershipPromotionMoneySavedText'), { moneySaved })} </span>
          <span className="text-indigo-900">{stringFormat(translate('label.membership.membershipPromotionDiscountOnThisOrderText'), { membershipPromoDiscountPerc: defaultDisplayMembership?.membershipPromoDiscountPerc })}</span>
        </p>
        <p className="text-gray-600 mt-2">
          {stringFormat(translate('label.membership.membershipPromotionOfferDiscountText'), { membershipPromoDiscountPerc: defaultDisplayMembership?.membershipPromoDiscountPerc })}
        </p>
        <p className="text-gray-600 mt-2">
          {!!(lowestMemberShipPrice >= 0) && stringFormat(translate('label.membership.membershipPromotionStartsFromText'), { lowestMemberShipPrice: `${currencySymbol}${lowestMemberShipPrice}` })}
        </p>
      </div>
      <div className="flex justify-center mt-6">
        <button onClick={handleOptMembershipModal} className="flex items-center justify-center btn btn-secondary w-full !font-medium">
          {translate('label.membership.membershipPromotionJoinNowText')}
        </button>
      </div>
    </div>
  );
};

export default MembershipPromotionCard;
