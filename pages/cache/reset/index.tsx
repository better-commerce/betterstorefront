import React from 'react';
import { Layout } from '@components/common';
import { INFRA_ENDPOINT, KEYWORDS_ENDPOINT, NAV_ENDPOINT, NEXT_PUBLIC_API_CACHING_LOG_ENABLED } from '@components/utils/constants';
import { GetServerSideProps } from 'next';
import commerce from '@lib/api/commerce';
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
    if (LOG_ENABLED) {
        console.log(status);
    }
    return {
        props: {
        },
    }
};