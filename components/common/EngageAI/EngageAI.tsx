// Base Imports
import React, { memo } from "react";

// Other Imports
import { useEngageAI } from "@framework";

const EngageAI: React.FC = (props: any) => {
    //debugger;
    const { snippets } = props;
    useEngageAI(snippets);
    return (
        <></>
    );
};

export default memo(EngageAI);