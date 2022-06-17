// Base Imports
import React, { memo } from "react";

// Package Imports
import { DocumentDuplicateIcon } from "@heroicons/react/outline";

// Other Imports
import { GENERAL_BULK_ORDER_PAD } from "@components/utils/textVariables";

interface ITopNavProps {
    readonly b2bSettings: Array<{ key: string, value: string }>;
    readonly onClick: any;
}

const TopNav: React.FC<ITopNavProps> = (props: ITopNavProps) => {

    const { b2bSettings, onClick } = props;

    return (
        <div className="px-1 w-10 sm:w-16 flow-root">
            <button
                className="relative group grid grid-cols-1 items-center text-center align-center justify-center flex-col mx-auto"
                onClick={onClick}>
                <DocumentDuplicateIcon
                    className="flex-shrink-0 h-6 w-6 block text-black group-hover:text-red-600 mx-auto"
                    aria-hidden="true" aria-label="Bulk Add"
                />
                <span className='font-normal hidden text-sm text-black sm:block'>Quick Order</span>
            </button>
        </div>
    )
};

export default memo(TopNav);