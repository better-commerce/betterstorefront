// Base Imports
import React, { FC } from "react";
import { NextRouter } from "next/router";

// Other Imports
import { ErrorBoundary } from "@components/common/Error";
import StorefrontError from "./StorefrontError";

export interface IGlobalErrorHandlerProps {
    readonly router: NextRouter;
    readonly children: any;
}

export const GlobalErrorHandler: FC<IGlobalErrorHandlerProps> = (props: IGlobalErrorHandlerProps) => {
    const { router, children } = props;

    const reset = () => {
    };

    return (
        <ErrorBoundary
            fallback={<StorefrontError />}
            onError={(error, errorInfo) => console.error(error, errorInfo)}
            onReset={() => reset()}
            /**
             * Reset the error component when the route changes.
             */
            key={router.asPath}
        >
            {children}
        </ErrorBoundary>
    );
};