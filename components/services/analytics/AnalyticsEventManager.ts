
import { allEnumKeys } from '@framework/utils/app-util';
import { AnalyticsType } from '.';
import { Analytics } from './events';
import { mapObject } from '@framework/utils/translate-util';
import { CURRENT_THEME, EmptyObject } from '@components/utils/constants';
const featureToggle = require(`../../../public/theme/${CURRENT_THEME}/features.config.json`);

declare const window: any

/**
 * Manages the dispatching of analytics events to configured analytics providers
 */
class EventManager {
    /**
     * Holds the single instance of the class
     */
    private static _instance: EventManager

    /**
     * Private constructor to prevent instantiation from outside
     */
    private constructor() {
    }

    /**
     * Static method to control access to the instance
     * @returns {EventManager}
     */
    public static getInstance(): EventManager {
        if (!EventManager._instance) {
            EventManager._instance = new EventManager()
        }
        return EventManager._instance
    }

    /**
     * Dispatches an analytics event to all configured analytics providers
     * @param {string} eventType - The type of the event, which should match the key of an event config
     * in the Analytics.Events object
     * @param {Object} eventData - The data to be passed with the event, which will be transformed based on
     * the transformMap in the event config
     */
    public dispatch(eventType: string, eventData: any) {
        const analyticsProviders = allEnumKeys(AnalyticsType)
        analyticsProviders.forEach((provider: string) => {
            this.dispatchEvent(provider, eventType, eventData);
        })
    }

    /**
     * Dispatches an analytics event to a specific provider (e.g. Google Analytics, Dynamic Yield)
     * @param {string} providerKey - The key of the analytics provider in the Analytics.Events object
     * @param {string} eventType - The type of the event, which should match the key of an event config
     * in the Analytics.Events object
     * @param {Object} eventData - The data to be passed with the event, which will be transformed based on
     * the transformMap in the event config
     */
    private dispatchEvent(providerKey: string, eventType: string, eventData: any) {
        if (featureToggle?.features?.enableAnalytics) {
            const providerConfig = Analytics.Events[providerKey];
            if (!providerConfig || !providerConfig.events || !providerConfig.events[eventType]) {
                console.warn(`No event configuration found for ${eventType} on provider ${providerKey}`)
                return;
            }

            const eventConfig = providerConfig.events[eventType]
            const translatedEventData = (eventData && eventConfig?.transformMap) ? mapObject(eventData, eventConfig?.transformMap) : EmptyObject
            debugger

            // Dispatch the event to the analytics platform (customize based on provider)
            switch (providerKey) {
                case AnalyticsType.GOOGLE_ANALYTICS:

                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({
                        event: eventType,
                        page: translatedEventData
                    })
                    break;

                case AnalyticsType.GOOGLE_TAG:

                    window.gtag('event', eventType, translatedEventData)
                    break;
            }
        }
    }
}

const AnalyticsEventManager = EventManager.getInstance()
export default AnalyticsEventManager
