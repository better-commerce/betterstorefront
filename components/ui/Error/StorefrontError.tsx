// Base Imports
import React from "react";

// Other Imports
import { Text } from '@components/ui'
import { ERROR_GENERIC_HEADING, ERROR_GENERIC_MESSAGE } from "@components/utils/textVariables";
import { Layout } from '@components/common'
import { useError } from "@components/common/Error/ErrorBoundary";

// export async function getStaticProps({
//     preview,
//     locale,
//     locales,
// }: GetStaticPropsContext) {
//     const config = { locale, locales }
//     const { pages } = await commerce.getAllPages({ config, preview })
//     const { categories, brands } = await commerce.getSiteInfo({ config, preview })
//     return {
//         props: {
//             pages,
//             categories,
//             brands,
//         },
//         revalidate: 200,
//     }
// }

export default function StorefrontError() {
    const { error, onReset } = useError();

    console.log(error);
    
    // TODO: Add error logging.

    return (
        <div className="max-w-2xl mx-8 sm:mx-auto py-20 flex flex-col items-center justify-center fit">
            <Text variant="heading">{ERROR_GENERIC_HEADING}</Text>
            <Text className="">
                {ERROR_GENERIC_MESSAGE}
            </Text>
        </div>
    )
}

StorefrontError.Layout = Layout;