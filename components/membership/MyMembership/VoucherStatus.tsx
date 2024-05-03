const VoucherStatus = ({ voucherLeft, voucherCount }: any) => {
  const renderCircles = () => {
    return Array.from({ length: voucherCount }, (_, i) => {
      const isAvailable = i < voucherLeft;
      const circleColor = isAvailable ? 'bg-emerald-500' : 'bg-gray-400';

      return (
        <div key={i} className={`relative flex items-center justify-center w-6 h-6 rounded-full ${circleColor} mr-1`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="white">
            {isAvailable ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
            )}
          </svg>
        </div>
      );
    });
  };

  return (
    <div>
      <p className="mb-2">{voucherLeft} of {voucherCount} vouchers available</p>
      <div className="flex items-center mb-4">
        {renderCircles()}
      </div>
    </div>
  );
};

export default VoucherStatus;
