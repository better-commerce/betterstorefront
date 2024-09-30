import { AnalyticsType } from "..";
import { GOOGLE_ANALYTICS_EVENTS } from "./googleAnalytics";
import { OMNILYTICS_EVENTS } from "./omnilytics";

export module Analytics {
    export const Events: any = {
        [AnalyticsType.GOOGLE_ANALYTICS]: GOOGLE_ANALYTICS_EVENTS,
        [AnalyticsType.OMNILYTICS]: OMNILYTICS_EVENTS,
    }
}