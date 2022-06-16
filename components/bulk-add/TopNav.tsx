// Base Imports
import React, { memo } from "react";

// Package Imports
import { DocumentDuplicateIcon } from '@heroicons/react/outline'

interface ITopNavProps {
    readonly b2bSettings: Array<{ key: string, value: string }>;
    readonly onClick: any;
}

const TopNav: React.FC<ITopNavProps> = (props: ITopNavProps) => {

    const { b2bSettings, onClick } = props;

    return (
        <div className="flex flex-row">
            <button onClick={onClick}
                className="p-2 text-gray-400 hover:text-gray-500" aria-label="BulkAdd"
            >
                <DocumentDuplicateIcon className="w-6 h-6" aria-hidden="true" aria-label="BulkAdd" />
            </button>
        </div>
    )
};

export default memo(TopNav);