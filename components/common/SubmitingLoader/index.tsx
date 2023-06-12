// Base Imports
import React from "react";

// Component Imports
import { LoadingDots } from "@components/ui";

// Other Imports
import { ISubmitStateInterface } from "@commerce/utils/use-data-submit";

interface ISubmittingLoaderProps {
    readonly submitState: ISubmitStateInterface;
    readonly source: number;
    readonly children: any;
    readonly id?: string;
}

const SubmittingLoader = (props: ISubmittingLoaderProps) => {
    const { id, submitState, source, children } = props;
    return (
        <>
            {
                submitState && submitState?.isSubmitting && submitState?.submitSource === source && (!submitState?.id || (submitState && submitState?.id && submitState?.id === (id ?? ""))) ? (
                    <LoadingDots />
                ) : (
                    <>
                        {children}
                    </>
                )
            }
        </>
    )
};

export default SubmittingLoader;