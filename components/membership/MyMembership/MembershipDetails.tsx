import React from 'react';
import moment from 'moment';
import { DATE_FORMAT } from '@components/utils/constants';
import { useTranslation } from '@commerce/utils/use-translation';

const MembershipDetails = ({ membership, ButtonText, onButtonClick}: any) => {
  const translate = useTranslation()
    const formatDate = (dateString: string) => {
        return moment(dateString).format(DATE_FORMAT);
    };

    const handleButtonClick = () => {
      onButtonClick()
    }

  return (
    <div className={`border text-black py-4 px-6 rounded-md shadow-md my-4 bg-${membership?.membershipName}`}>
      <div className='my-4'>
        <p className="text-2xl font-semibold">{translate('label.membership.currentPlanText')} <span className='text-member-name'>{membership?.membershipName}</span></p>
      </div>
      <div className="mt-2">
        <span>{translate('label.membership.nextBillingDateText')}</span>
        <span>{formatDate(membership?.endDate)}</span>
      </div>
      {/* <div className="mt-2">
        <span>{translate('label.membership.memberSinceText')}</span>
        <span className="text-sm">{formatDate(membership?.startDate)}</span>
      </div> */}
      <div className="mt-6 mb-4 lg:w-3/ md:w-1/2">
        <button className="w-full text-white btn-secondary py-2 px-4 rounded" onClick={handleButtonClick} style={{ maxWidth: "300px" }}>
         {ButtonText}
        </button>
      </div>

    </div>
  );
};

export default MembershipDetails;
