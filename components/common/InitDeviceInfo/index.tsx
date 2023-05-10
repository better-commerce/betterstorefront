// Base Imports
import React, { useEffect } from "react";

// Other Imports
import { IDeviceInfo, useUI } from "@components/ui/context";
import { tryParseJson } from "@framework/utils/parse-util";

const InitDeviceInfo = ({ setDeviceInfo }: any) => {

    const { setupDeviceInfo, }: any = useUI();

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (setupDeviceInfo) {
                setupDeviceInfo();

                const deviceInfo = localStorage.getItem("deviceInfo");
                if (deviceInfo) {
                    setDeviceInfo(tryParseJson(deviceInfo) as IDeviceInfo);
                }
            }
        }
    }, []);

    return null;
};

export default InitDeviceInfo;