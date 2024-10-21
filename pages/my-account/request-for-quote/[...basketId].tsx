import { useEffect, useState } from 'react';
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer';
import { useUI } from '@components/ui/context';
import withAuth from '@components/utils/withAuth';
import { getBrowserSessionId, isB2BUser } from '@framework/utils/app-util';
import { useTranslation } from '@commerce/utils/use-translation';
import { SaveRFQForm } from '@components/account/RequestForQuote/Form';
import { useRouter } from 'next/router';
import { NEXT_SAVE_RFQ } from '@components/utils/constants';
import axios from 'axios';
import LayoutAccountWithoutNav from '@components/Layout/LayoutAccountWithoutNav';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import useCart from '@components/services/cart';

function SaveRFQ() {
  const router = useRouter();
  const { user, changeMyAccountTab, setAlert } = useUI();
  const basketId = router?.query?.basketId?.[0];
  const translate = useTranslation();
  const { getCart } = useCart();
  const [cartItems, setCartItems] = useState({});
  const [previousUrl, setPreviousUrl] = useState('/my-account/my-company/buying-list'); // Fallback value

  useEffect(() => {
    changeMyAccountTab(translate('label.myAccount.myCompanyMenus.requestQuote'));
  }, []);

  useEffect(() => {
    async function getCartItems() {
      const items = await getCart({ basketId });
      setCartItems(items);
    }
    getCartItems();
  }, []);

  // Track route changes and update the previous URL in localStorage
  useEffect(() => {
    const sessionId = getBrowserSessionId()
    const currentUrl = router.asPath;

    // Function to update the navigation stack in localStorage
    const updateNavStack = () => {
      const nvsData = JSON.parse(localStorage.getItem('nvs') || '{}');
      const navStack = nvsData[sessionId] || [];

      // Add the current URL to the navStack if it's not already present
      if (!navStack.includes(currentUrl)) {
        navStack.push(currentUrl);
      }

      // Update localStorage with the new navStack
      nvsData[sessionId] = navStack;
      localStorage.setItem('nvs', JSON.stringify(nvsData));

      // Set the previous URL based on the updated navStack
      const currentUrlIndex = navStack.indexOf(currentUrl);
      if (currentUrlIndex > 0) {
        setPreviousUrl(navStack[currentUrlIndex - 1]);
      }
    };

    // Listen to route change events
    router.events.on('routeChangeComplete', updateNavStack);

    // Update the navStack when the component mounts for the first time
    updateNavStack();

    // Clean up the event listener when the component unmounts
    return () => {
      router.events.off('routeChangeComplete', updateNavStack);
    };
  }, [router.asPath, user]);

  const calculateValidDays = (validUntilDate: any) => {
    const today: any = new Date();
    const validUntil: any = new Date(validUntilDate);
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.ceil((validUntil - today) / msPerDay);
  };

  const formatToISO8601 = (dateStr: any) => new Date(dateStr).toISOString();

  const handleFormSubmit = async (data: any) => {
    const { products, ...values } = data;
    const validUntilISO = formatToISO8601(values.validUntil);
    const validDays = calculateValidDays(values.validUntil);

    const sanitizedData = {
      ...values,
      BasketId: basketId,
      UserId: user?.userId,
      validDays: validDays,
      validUntil: validUntilISO,
      status: 'Received',
    };

    const result = await axios.post(NEXT_SAVE_RFQ, { data: sanitizedData });
    if (!result?.data) {
      setAlert({ type: 'error', msg: 'Something went wrong' });
      return;
    } else {
      setAlert({ type: 'success', msg: result?.data?.message });
      const rfqId = result?.data?.recordId;
      router.push('/my-account/request-for-quote/rfq/' + rfqId);
    }
  };

  useEffect(() => {
    if (!isB2BUser(user)) {
      router.push('/');
    }
  }, []);

  return (
    <div className="flex flex-col">
      <ol role="list" className="flex items-center space-x-0 sm:space-x-0 sm:px-0 md:px-0 lg:px-0 2xl:px-0">
        <li className="flex items-center text-10-mob sm:text-[12px]">
          {/* Dynamically set the breadcrumb link from the previous URL */}
          <Link href={previousUrl} passHref>
            <span className="font-light hover:text-gray-900 dark:text-slate-500 text-slate-500">{previousUrl === "/my-account/request-for-quote" ? 'RFQ List' : 'Buying List'}</span>
          </Link>
        </li>
        <li className="flex items-center text-10-mob sm:text-[12px]">
          <span className="inline-block mx-1 font-normal hover:text-gray-900 dark:text-black">
            <ChevronRightIcon className="w-3 h-3" />
          </span>
        </li>
        <li className="flex items-center text-10-mob sm:text-[12px]">
          <span className="font-semibold capitalize hover:text-gray-900 dark:text-black">Request For Quote</span>
        </li>
      </ol>
      <SaveRFQForm handleFormSubmit={handleFormSubmit} cartItems={cartItems} basketId={basketId} />
    </div>
  );
}

SaveRFQ.LayoutAccountWithoutNav = LayoutAccountWithoutNav;
export default withDataLayer(withAuth(SaveRFQ), PAGE_TYPES.RequestQuote, true, LayoutAccountWithoutNav);
