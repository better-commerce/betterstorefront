import { AnalyticsType } from "..";
import { GOOGLE_ANALYTICS_EVENTS } from "./googleAnalytics";
import { OMNILYTICS_EVENTS } from "./omnilytics";
import { RAKUTEN_ANALYTICS_EVENTS } from "./rakuten";

export module Analytics {
    export const Events: any = {
        [AnalyticsType.GOOGLE_ANALYTICS]: GOOGLE_ANALYTICS_EVENTS,
        [AnalyticsType.OMNILYTICS]: OMNILYTICS_EVENTS,
        [AnalyticsType.RAKUTEN]: RAKUTEN_ANALYTICS_EVENTS,
    }
}