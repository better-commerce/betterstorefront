import React, { useEffect } from 'react';

interface Plan {
  recordId: string;
  name: string;
  noOfVouchers: any;
  price: {
    formatted: {
      withTax: string;
    };
  };
}

interface MembershipPlanListProps {
  readonly membershipPlans: Plan[];
  readonly defaultDisplayMembership: {
    membershipPromoDiscountPerc: number;
  };
  readonly selectedPlan: Plan | null;
  readonly firstMembershipSelectedAsDefault: boolean
  handlePlanSelection: (plan: Plan) => void;
}

const MembershipPlanList: React.FC<MembershipPlanListProps> = ({ membershipPlans, defaultDisplayMembership, selectedPlan, handlePlanSelection, firstMembershipSelectedAsDefault = false }) => {

  return (
    <div className="grid grid-cols-1 gap-4 mb-4">
      {membershipPlans?.map((membershipPlan: any, index: number) => (
        <div key={membershipPlan.recordId} className="flex items-center bg-gray-100 p-2 rounded" onClick={() => handlePlanSelection(membershipPlan)}>
          <input
            id={`plan-${membershipPlan.recordId}`}
            type="radio"
            name="plan"
            value={membershipPlan.recordId}
            checked={(firstMembershipSelectedAsDefault && index === 0) || selectedPlan?.recordId === membershipPlan.recordId}
            defaultChecked={(firstMembershipSelectedAsDefault && index === 0)}
            onChange={() => handlePlanSelection(membershipPlan)}
            className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-600"
          />
          <label htmlFor={`plan-${membershipPlan.recordId}`} className="ml-3 block text-sm font-medium text-gray-700">
            <h4 className="text-lg font-semibold mb-2">{membershipPlan?.name}</h4>
            <p className="text-gray-600 mb-2">{`${membershipPlan?.noOfVouchers} x ${defaultDisplayMembership?.membershipPromoDiscountPerc}% discounts anytime`}</p>
            <p className="text-gray-800 font-bold">{`${membershipPlan?.price?.formatted?.withTax} per year`}</p>
          </label>
        </div>
      ))}
    </div>
  );
};

export default MembershipPlanList;
