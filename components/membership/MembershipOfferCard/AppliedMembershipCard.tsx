const AppliedMembershipCard = ({ promo, currencySymbol, moneySaved }:any) => {
  return (
    <div className="bg-gray-200 p-6 rounded-lg mt-2 text-center">
      <div className="flex items-center justify-center text-white text-2xl font-bold mb-4">
        <img src="/theme/blue/image/logo.png?fm=webp&h=200" width="60" height="60" alt="Store" className="brand-logo" />
      </div>
      <p className="text-white font-semibold mb-4">{promo?.promoName}</p>
      <p className="text-yellow-300 font-semibold mb-6">{`Saved ${currencySymbol}${moneySaved} in you current Basket`}</p>
      <button  className="bg-white text-indigo-900 font-semibold py-2 px-4 rounded-md mb-4">
        DISCOUNT APPLIED
      </button>
      
    </div>
  );
};

export default AppliedMembershipCard;