import React from 'react';
import moment from 'moment';

const MembershipDetails = ({ membership, ButtonText, onButtonClick}: any) => {
    const formatDate = (dateString: string) => {
        return moment(dateString).format('MMMM Do YYYY');
    };

    const handleButtonClick = () => {
      onButtonClick()
    }

  return (
    <div className="bg-gray-700 text-white py-4 px-6 rounded-md shadow-md my-4">
      <div className='my-4'>
        <p className="text-2xl font-semibold">Current Plan: {membership?.membershipName}</p>
      </div>
      <div className="mt-2">
        <span>Your next billing date will be : </span>
        <span>{formatDate(membership?.endDate)}</span>
      </div>
      <div className="mt-2">
        <span>You've been a member since : </span>
        <span className="text-sm">{formatDate(membership?.startDate)}</span>
      </div>
      <div className="mt-6 mb-4 lg:w-3/ md:w-1/2">
        <button className="w-full text-white bg-emerald-500 py-2 px-4 rounded" onClick={handleButtonClick} style={{ maxWidth: "300px" }}>
         {ButtonText}
        </button>
      </div>

    </div>
  );
};

export default MembershipDetails;
