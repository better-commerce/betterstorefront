import { AnalyticsType } from "..";
import { GOOGLE_ANALYTICS_EVENTS } from "./googleAnalytics";
import { MAPP_ANALYTICS_EVENTS } from "./mapp";
import { OMNILYTICS_EVENTS } from "./omnilytics";
import { RAKUTEN_ANALYTICS_EVENTS } from "./rakuten";

export module Analytics {
    export const Events: any = {
        [AnalyticsType.GOOGLE_ANALYTICS]: GOOGLE_ANALYTICS_EVENTS,
        [AnalyticsType.OMNILYTICS]: OMNILYTICS_EVENTS,
        [AnalyticsType.RAKUTEN]: RAKUTEN_ANALYTICS_EVENTS,
        [AnalyticsType.MAPP]: MAPP_ANALYTICS_EVENTS,
    }
}