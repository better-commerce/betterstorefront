import { useEffect } from 'react'
import DataLayerInstance, { KEYS_MAP } from '@components/utils/dataLayer'
import { Layout } from '@components/common'
import { DataLayerSnippet } from './common/Content';
import { EVENTS_MAP } from './services/analytics/constants';

export const PAGE_TYPES = {
  Blog: 'Blog',
  Brand: 'Brand',
  Category: 'Category',
  Checkout: 'Checkout',
  Common: 'Common',
  Home: 'Home',
  Page: 'Page',
  Product: 'Product',
  Search: 'Search',
  Survey: 'Survey',
}
export default function withDataLayer(
  Component: any,
  pageType: string,
  entityType = undefined,
  showLayout = true,
) {
  function WrappedComponent(props: any) {
    //console.log(props);
    const { PageViewed } = EVENTS_MAP.EVENT_TYPES;
    useEffect(() => {
      DataLayerInstance.setItemInDataLayer('pageCategory', pageType)
    }, [])

    const setEntities = (entities: any) => {
      DataLayerInstance.setEntities(entities)
    }
    const recordEvent = (event: string) =>
      DataLayerInstance.setItemInDataLayer(KEYS_MAP.eventType, event)

    return (
      <>
        {/* Conditional rendering based on entity type */}
        {
          entityType && (
            <DataLayerSnippet entityObject={props?.slugs} entityName={pageType} entityType={entityType} eventType={PageViewed} />
          )
        }

        <Component
          {...props}
          setEntities={setEntities}
          recordEvent={recordEvent}
        />
      </>

    )
  }

  if (showLayout) {
    WrappedComponent.Layout = Layout
  }
  return WrappedComponent
}
