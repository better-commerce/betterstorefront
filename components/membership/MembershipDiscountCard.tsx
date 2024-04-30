import React from 'react';

const MembershipDiscountCard = ({ moneySaved, defaultDisplayMembership, currencySymbol, discountLeft, setOpenOMM }:any) => {
  const handleApplyDiscount = () => {
    // Handle apply discount logic here
  };

  return (
    <div className="bg-indigo-800 p-6 rounded-lg mt-2 text-center">
      <div className="flex items-center justify-center text-white text-2xl font-bold mb-4">
        <img
          src="/theme/blue/image/logo.png?fm=webp&amp;h=200"
          width="60"
          height="60"
          alt="Store"
          className="brand-logo"
        />
      </div>
      <p className="text-yellow-300 font-semibold mb-6">
        {!!moneySaved && `Apply your ${defaultDisplayMembership?.membershipPromoDiscountPerc}% OFF discount to save ${moneySaved}`}
      </p>
      <button onClick={handleApplyDiscount} className="bg-white text-indigo-900 font-semibold py-2 px-4 rounded-md mb-4">
        APPLY DISCOUNT
      </button>
      <p className="text-white">
        {!!(discountLeft >= 0) && `You have ${discountLeft} discounts remaining`}
      </p>
    </div>
  );
};

export default MembershipDiscountCard;
