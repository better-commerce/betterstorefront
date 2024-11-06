import React, { useState, useEffect } from 'react';
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import withAuth from '@components/utils/withAuth'
import { useRouter } from 'next/router';
import { AlertType } from '@framework/utils/enums';
import Spinner from '@components/ui/Spinner';
import { useUI } from '@components/ui';
import axios from 'axios';
import { NEXT_GET_DETAILS_RFQ, NEXT_UPDATE_STATUS_RFQ } from '@components/utils/constants';
import LayoutAccount from '@components/Layout/LayoutAccount'
import RFQDetailsComponent from '@components/account/RequestForQuote/RFQDetailsComponent';
import { useTranslation } from '@commerce/utils/use-translation';
import { isB2BUser } from '@framework/utils/app-util';

interface RFQItem {
  productId : string,
  stockCode: string,
  productName : string,
  qty : number,
  price : number,
  targetPrice : number
} 

interface RFQData {
  RFQNumber: string;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  notes: string;
  lines: RFQItem[];
}


const RFQDetailsPage: any = ({}) => {
  const router = useRouter();
  const rfqId = router?.query?.rfqId?.[0];
  const translate = useTranslation();
  const { setAlert,user } = useUI();
  const [rfqData, setRfqData] = useState<RFQData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => { 
    if (!isB2BUser(user)){
      router.push('/');
    }
    else if (rfqId) { fetchRFQData(); }
   }, [rfqId,user]);

  const fetchRFQData = async () => {

    setIsLoading(true);
    try { 
      const response: any = await axios.post(NEXT_GET_DETAILS_RFQ, { rfqId });
      if (response?.data?.companyId !== user?.companyId){
        router.push('/my-account');
        return;
      }
      if (!response?.data){
        setAlert({ type: AlertType.ERROR, msg: translate('label.myAccount.rfq.requestCouldNotProcessErrorMsg') });
      }
      setRfqData(response?.data);
    } 
    catch (err) { setAlert({ type: AlertType.ERROR, msg: translate('label.myAccount.rfq.requestCouldNotProcessErrorMsg') }); } 
    finally { setIsLoading(false); }
  };

  if (isLoading) { return <Spinner />; }

  if (!rfqData) {
    return <>NO DATA</>;
  }

  return (
    <RFQDetailsComponent rfqId={rfqId} rfqData={rfqData} fetchRFQData={fetchRFQData} />
  );
};

RFQDetailsPage.LayoutAccount = LayoutAccount;
export default withDataLayer(withAuth(RFQDetailsPage), PAGE_TYPES.RequestQuote, true, LayoutAccount);
