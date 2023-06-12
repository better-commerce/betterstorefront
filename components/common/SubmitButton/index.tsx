// Base Imports
import React from "react";

// Component Imports
import SubmittingLoader from "../SubmitingLoader";

// Other Imports
import { submittingClassName } from "@framework/utils/app-util";
import { ISubmitStateInterface } from "@commerce/utils/use-data-submit";

interface ISubmitButtonProps {
    readonly formId?: string;
    readonly loaderId?: string;
    readonly cssClass: string;
    readonly submitState: ISubmitStateInterface;
    readonly source: number;
    readonly children: any;
    readonly disabled?: boolean;
    onClick?: Function;
}

const SubmitButton = (props: ISubmitButtonProps) => {

    const { formId = "", cssClass, submitState, source, children, loaderId, onClick = null, disabled = false } = props;
    const eventInitiated = submitState && submitState?.isSubmitting && submitState?.submitSource === source && (!submitState?.id || (submitState && submitState?.id && submitState?.id === (loaderId ?? "")));

    return (
        <>
            {
                formId ? (
                    <button
                        form={formId}
                        type="submit"
                        className={`${cssClass} ${disabled ? "opacity-50 cursor-not-allowed" : submittingClassName(submitState, source)}`}
                        disabled={disabled}
                        onClick={(ev: any) => {
                            if (eventInitiated) {
                                ev.preventDefault();
                                ev.stopPropagation();
                            }
                        }}
                    >
                        <SubmittingLoader
                            id={loaderId}
                            submitState={submitState}
                            source={source}
                        >
                            <>
                                {children}
                            </>
                        </SubmittingLoader>
                    </button>
                ) : (
                    <button
                        type="submit"
                        className={`${cssClass} ${disabled ? "opacity-50 cursor-not-allowed" : submittingClassName(submitState, source)}`}
                        disabled={disabled}
                        onClick={(ev: any) => {
                            if (eventInitiated) {
                                ev.preventDefault();
                                ev.stopPropagation();
                            } else {
                                if (onClick) {
                                    onClick(ev);
                                }
                            }
                        }}
                    >
                        <SubmittingLoader
                            id={loaderId}
                            submitState={submitState}
                            source={source}>
                            <>
                                {children}
                            </>
                        </SubmittingLoader>
                    </button>
                )
            }
        </>
    );

};

export default SubmitButton;