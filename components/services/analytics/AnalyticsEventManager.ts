
import { allEnumKeys } from '@framework/utils/app-util';
import { AnalyticsType } from '.';
import { Analytics } from './events';
import { mapObject } from '@framework/utils/translate-util';
import { CURRENT_THEME, EmptyObject } from '@components/utils/constants';
import { eventDispatcher } from './eventDispatcher';
import { AnalyticsEventStrategyType } from '@framework/utils/enums';
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
     * Determines whether a Google Analytics event should be sent based on the configured event strategy
     * @param {string} eventType - The type of the event, which should match the key of an event config
     * in the Analytics.Events object
     * @returns {boolean} - Whether the event should be sent
     */
    private shouldSendGAEvent(eventType: string): boolean {
        const config = featureToggle?.features?.googleAnalyticsEvents || {};

        switch (config?.strategy) {
            case AnalyticsEventStrategyType.INCLUDE_ALL:
                return true;

            case AnalyticsEventStrategyType.EXCLUDE_ALL:
                return false;

            case AnalyticsEventStrategyType.INCLUDE_SPECIFIC:
                return config.events?.includes(eventType) ?? false;

            case AnalyticsEventStrategyType.EXCLUDE_SPECIFIC:
                return !config.events?.includes(eventType);

            default:
                return false; // Safe default
        }
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
        const processAnalyticsEvent = (featureToggle?.features?.enableGoogleAnalytics || featureToggle?.features?.enableOmnilytics || featureToggle?.features?.enableRakutenAnalytics || featureToggle?.features?.enableMappAnalytics)
        if (processAnalyticsEvent) {
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

                    /**
                     * Based on configuration, allow which events to send to GA, Governed by {@link AnalyticsEventStrategyType}
                     */
                    if (!this.shouldSendGAEvent(eventType)) return;

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
                        const dataLayer = typeof window !== 'undefined' && (<any>window).dataLayer && (<any>window).dataLayer[0].ipAddress
                        if (dataLayer) {
                            eventDispatcher(eventTypeName, translatedEventData)
                        }
                    }
                    break;

                case AnalyticsType.RAKUTEN:
                    if (featureToggle?.features?.enableOmnilytics) {
                        console.log("checkoutConfirmation", translatedEventData)

                        if (eventConfig?.postProcess) {
                            eventConfig.postProcess(translatedEventData)
                        }
                    }
                    break;

                case AnalyticsType.MAPP:
                    if (featureToggle?.features?.enableMappAnalytics) {
                        window.dataLayer = window.dataLayer || [];
                        window.dataLayer.push({
                            event: eventTypeName,
                            page: translatedEventData
                        })
                    }
                    break;
            }
        }
    }
}

const AnalyticsEventManager = EventManager.getInstance()
export default AnalyticsEventManager
