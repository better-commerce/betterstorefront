import { roundToDecimalPlaces } from '@framework/utils/parse-util';
import MembershipDiscountCard from './MembershipDiscountCard';
import MembershipPromotionCard from './MembershipPromotionCard';

const MembershipCard = ({ basket, setOpenOMM, defaultDisplayMembership }: any) => {
  const currencySymbol = basket?.grandTotal?.currencySymbol;
  let moneySaved = null;
  if (defaultDisplayMembership?.membershipPromoDiscountPerc) {
    let grandTotal = basket?.grandTotal?.raw?.withTax;
    if (basket?.lineItems?.find((x:any) => x?.isMembership)?.isMembership) {
      grandTotal = basket?.lineItems?.filter((x:any) => !x?.isMembership).reduce((accumulator:any, lineItem:any) => {
        console.log(accumulator , lineItem?.price?.raw?.withTax)
        return accumulator + lineItem?.price?.raw?.withTax;
      }, 0);
    }
    grandTotal = (grandTotal * defaultDisplayMembership?.membershipPromoDiscountPerc * 1.0 / 100.00)
    moneySaved = `${currencySymbol} ${roundToDecimalPlaces(grandTotal)}`;
  }
  const discountLeft = 0;
  const lowestMemberShipPrice = defaultDisplayMembership?.membershipPrice;

  if (basket?.hasMembership) {
    return <MembershipDiscountCard moneySaved={moneySaved} defaultDisplayMembership={defaultDisplayMembership} currencySymbol={currencySymbol} discountLeft={discountLeft} setOpenOMM={setOpenOMM} />;
  } else {
    return <MembershipPromotionCard moneySaved={moneySaved} defaultDisplayMembership={defaultDisplayMembership} lowestMemberShipPrice={lowestMemberShipPrice} currencySymbol={currencySymbol} setOpenOMM={setOpenOMM} />;
  }
};

export default MembershipCard;
