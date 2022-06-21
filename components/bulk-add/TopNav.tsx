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
        <div className="px-3 flow-root border-r mr-2">
            <button
                className="relative group items-center text-center align-center justify-center flex-col mx-auto"
                onClick={onClick}>
                <DocumentDuplicateIcon
                    className="flex-shrink-0 h-5 w-5 inline-block text-white group-hover:text-gray-300 mx-auto"
                    aria-hidden="true" aria-label="Bulk Add"
                />
                <span className='font-semibold text-sm text-white pl-1 hover:text-gray-300'>Quick Order</span>
            </button>
        </div>
    )
};

export default memo(TopNav);