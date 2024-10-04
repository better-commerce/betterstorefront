
import { allEnumKeys } from '@framework/utils/app-util';
import { AnalyticsType } from '.';
import { Analytics } from './events';
import { mapObject } from '@framework/utils/translate-util';
import { CURRENT_THEME, EmptyObject } from '@components/utils/constants';
import { eventDispatcher } from './eventDispatcher';
const featureToggle = require(`/public/theme/${CURRENT_THEME}/features.config.json`);

declare const window: any
const ALL_EVENTS: any = Analytics.Events

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

        if (featureToggle?.features?.enableGoogleAnalytics || featureToggle?.features?.enableOmnilytics) {
            const providerConfig = ALL_EVENTS[providerKey];
            if (!providerConfig || !providerConfig.events || !providerConfig.events[eventType]) {
                //console.warn(`No event configuration found for ${eventType} on provider ${providerKey}`)
                return
            }

            const eventTypeName = providerConfig?.eventTypes[eventType]
            const eventConfig = providerConfig?.events[eventType]
            const translatedEventData = mapObject(eventData, eventConfig?.transformMap || EmptyObject)

            // Dispatch the event to the analytics platform (customize based on provider)
            switch (providerKey) {
                case AnalyticsType.GOOGLE_ANALYTICS:

                    if (featureToggle?.features?.enableGoogleAnalytics) {
                        window.dataLayer = window.dataLayer || [];
                        window.dataLayer.push({
                            event: eventTypeName,
                            page: translatedEventData
                        })
                    }
                    break;

                case AnalyticsType.GOOGLE_TAG:

                    if (featureToggle?.features?.enableGoogleAnalytics) {
                        window.gtag('event', eventType, translatedEventData)
                    }
                    break;

                case AnalyticsType.OMNILYTICS:

                    if (featureToggle?.features?.enableOmnilytics) {
                        debugger
                        const dataLayer = typeof window !== 'undefined' && (<any>window).dataLayer && (<any>window).dataLayer[0].ipAddress
                        if (dataLayer) {
                            eventDispatcher(eventTypeName, translatedEventData)
                        }
                    }
                    break;
            }
        }
    }
}

const AnalyticsEventManager = EventManager.getInstance()
export default AnalyticsEventManager
