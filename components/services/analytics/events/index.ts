import { AnalyticsType } from "..";
import { GOOGLE_ANALYTICS_EVENTS } from "./googleAnalytics";

export module Analytics {
    export const Events: any = {
        [AnalyticsType.GOOGLE_ANALYTICS]: GOOGLE_ANALYTICS_EVENTS,
        //[AnalyticsType.GOOGLE_TAG]: GOOGLE_TAG_EVENTS,
    }
}