import { useTranslation } from "@commerce/utils/use-translation";
import { Logo } from "@components/ui";
import { stringFormat } from "@framework/utils/parse-util";

const MembershipPromotionCard = ({ moneySaved, defaultDisplayMembership, lowestMemberShipPrice, currencySymbol, setOpenOMM }: any) => {
  const translate = useTranslation()
  const handleOptMembershipModal = () => {
    setOpenOMM(true);
  };

  return (
    <div className="p-6 mt-2 text-center bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-center">
        <Logo />
      </div>
      <div className="mt-4">
        <p className="text-lg font-bold">
          <span className="text-red-700"> {!!moneySaved && stringFormat(translate('label.membership.membershipPromotionMoneySavedText'), { moneySaved: `${currencySymbol}${moneySaved}` })} </span>
          <span className="font-semibold text-indigo-900">{translate('label.membership.membershipPromotionDiscountOnThisOrderText')}</span>
        </p>
        <p className="mt-2 text-gray-600">
          {stringFormat(translate('label.membership.membershipPromotionOfferDiscountText'), { membershipPromoDiscountPerc: defaultDisplayMembership?.membershipPromoDiscountPerc })}
        </p>
        <p className="mt-2 text-gray-600">
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
