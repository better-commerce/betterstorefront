import React from 'react';
import Layout from '@components/Layout/Layout';
import { INFRA_ENDPOINT, KEYWORDS_ENDPOINT, NAV_ENDPOINT, NEXT_PUBLIC_API_CACHING_LOG_ENABLED } from '@components/utils/constants';
import { GetServerSideProps } from 'next';
import commerce from '@lib/api/commerce';
import { resetRedisCache } from '@framework/utils/redis-util'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider';
import { getPagePropType, PagePropType } from '@framework/page-props';

export default function ResetCachePage() {
    return (
        <></>
    );
}
ResetCachePage.Layout = Layout
export const getServerSideProps: GetServerSideProps = async (context) => {
    const LOG_ENABLED = NEXT_PUBLIC_API_CACHING_LOG_ENABLED && NEXT_PUBLIC_API_CACHING_LOG_ENABLED === "true";
    const status = await commerce.resetCache([
        INFRA_ENDPOINT,
        KEYWORDS_ENDPOINT,
        NAV_ENDPOINT,
    ]);
    // clear all Redis data
    resetRedisCache()
    if (LOG_ENABLED) {
        console.log(status);
    }
    const props: IPagePropsProvider = getPagePropType({ type: PagePropType.COMMON })
    const pageProps = await props.getPageProps({ cookies: context?.req?.cookies })
    return {
        props: {
            ...pageProps,
        },
    }
};