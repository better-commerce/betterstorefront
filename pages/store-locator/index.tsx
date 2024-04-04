import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Layout from '@components/Layout/Layout'
import {
  NEXT_GET_ALL_STORES,
  NEXT_GOOGLE_AUTOCOMPLETE_API,
  NEXT_PLACE_DETAILS_API,
  SITE_NAME,
  SITE_ORIGIN_URL,
} from '@components/utils/constants'
import NextHead from 'next/head'
import { useRouter } from 'next/router'
import { useTranslation } from '@commerce/utils/use-translation'
import MapWithMarkers from '@components/ui/Map/MultiMarker'
import UseMyLocationModal from '@components/StoreLocator/UseMyLocationModal'
import { StoreSearch } from '@components/StoreLocator/StoreSearch'
import { useDebounce } from 'hooks/useDebounce'
import { StoreList } from '@components/StoreLocator/StoreList'
import { removeQueryString } from '@commerce/utils/uri-util';

const DEBOUNCE_TIMER = 300

export default function StoreLocatorPage({ deviceInfo }: any) {
  const translate = useTranslation()
  let absPath = ''
  if (typeof window !== 'undefined') {
    absPath = window?.location?.href
  }
  const [stores, setStores] = useState([])
  const [filteredStores, setFilteredStores]: any = useState([])
  const router = useRouter()
  const [inputValue, setInputValue] = useState('')
  const [isLocationDialog, setLocationDialog] = useState(true)
  const [isDataLoading, setDataLoading] = useState(true)
  const [isSearchDataLoading, setSearchLoader] = useState(false)
  const [loadingDots, setLoadingDots] = useState('')
  const [autoCompleteList, setAutoCompleteList] = useState([])
  const [isErrorMsg, setErrorMsg] = useState(false)
  const searchPincodeRef = useRef(null)
  const [map, setMap]: any = useState(null)
  const { isMobile } = deviceInfo

  useEffect(() => {
    getAllStores()
  }, [])

  useEffect(() => {
    if (map && filteredStores?.length) {
      const bounds = new window.google.maps.LatLngBounds()
      for (let i = 0; i < filteredStores.length; i++) {
        const marker: any = new window.google.maps.Marker({
          position: {
            lat: parseFloat(filteredStores[i]?.lat),
            lng: parseFloat(filteredStores[i]?.lng),
          },
          map: map,
          title: filteredStores[i]?.name + ' Branch',
        })
        bounds.extend(marker.getPosition())
      }
      map.fitBounds(bounds)
      const findZoom = isMobile ? 10 : 12
      if (map.getZoom() > findZoom) {
        map.setZoom(findZoom)
      }
    }
  }, [filteredStores, map, isMobile])

  const getAllStores = async () => {
    try {
      const { data }: any = await axios.get(NEXT_GET_ALL_STORES)
      let stores = data?.map((store: any) => {
        return {
          ...store,
          lat: Number(store?.latitude),
          lng: Number(store?.longitude),
        }
      })
      setFilteredStores(stores)
      setDataLoading(false)
      setStores(stores)
    } catch (error) {
      console.error('err in fetching stores', error)
    }
  }

  const onSearchChange = async (e: any) => {
    try {
      const {
        data: { predictions },
      }: any = await axios.get(NEXT_GOOGLE_AUTOCOMPLETE_API, {
        params: { input: e.target.value },
      })
      if (predictions) {
        setAutoCompleteList(predictions)
      }
    } catch (e) {
      console.error(e)
    }

    if (e?.target?.value?.length == 0) {
      setAutoCompleteList([])
    }
  }

  const onSearchChangeDebounce = useCallback(
    useDebounce((e: any) => {
      onSearchChange(e)
    }, DEBOUNCE_TIMER),
    []
  )

  const searchInputButton = () => {
    if (inputValue.length) {
      searchPincodeRef.current = null
      setInputValue('')
      let filteredStore = stores
      setFilteredStores(filteredStore)
      setAutoCompleteList([])
    } else {
      setLocationDialog(true)
    }
  }

  const selectPlace = async (placeId: string) => {
    try {
      const {
        data: {
          result: {
            geometry: { location },
          },
        },
      }: any = await axios.get(NEXT_PLACE_DETAILS_API, {
        params: { placeId },
      })
      setSearchLoader(true)
      mapNearestStore(location?.lat, location?.lng)
    } catch (error) {
      setSearchLoader(false)
      console.error(error)
    }
  }

  const getDistanceTwoLatLng = (
    lat2: number,
    lng2: number,
    lat1: number,
    lng1: number
  ) => {
    const r = 6371 // km
    const p = Math.PI / 180
    if (lat1 && lng1) {
      const a =
        0.5 -
        Math.cos((lat2 - lat1) * p) / 2 +
        (Math.cos(lat1 * p) *
          Math.cos(lat2 * p) *
          (1 - Math.cos((lng2 - lng1) * p))) /
          2
      return (2 * r * Math.asin(Math.sqrt(a))).toFixed(1)
    }
    return
  }

  const mapNearestStore = (lat1: number, lng1: number) => {
    stores?.map((store: any) => {
      const distance = getDistanceTwoLatLng(
        store?.latitude,
        store?.longitude,
        lat1,
        lng1
      )
      let getStore: any | any = stores.find(({ id }: any) => id == store?.id)
      if (getStore) {
        getStore['distance'] = distance
      }
    })
    let filterStore = stores
      .filter((store: any) => store?.distance < 30)
      ?.sort(
        (a: any, b: any) => parseFloat(a?.distance) - parseFloat(b?.distance)
      )
    setFilteredStores(filterStore)
    setSearchLoader(false)
    setAutoCompleteList([])
  }

  const setDistanceAndSortStore = (
    lat1: number,
    lng1: number,
    filteredStore: any[],
    updateCount: boolean
  ) => {
    filteredStore?.map((store: any) => {
      const distance = getDistanceTwoLatLng(
        store?.latitude,
        store?.longitude,
        lat1,
        lng1
      )
      let getStore: any | undefined = filteredStore.find(
        ({ id }: any) => id == store?.id
      )
      if (getStore) {
        getStore['distance'] = distance
      }
    })
    filteredStore = filteredStore
      .filter((store: any) => store?.distance < 30)
      ?.sort(
        (a: any, b: any) => parseFloat(a?.distance) - parseFloat(b?.distance)
      )
    setFilteredStores(filteredStore)
  }

  const successCallback = (position: any) => {
    const latlng: google.maps.LatLng = new google.maps.LatLng(
      position.coords.latitude,
      position.coords.longitude
    )
    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ location: latlng }, function (results: any, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          results.forEach((addressComponent: any) => {
            if (addressComponent.types[0] == 'locality') {
              const itemLocality =
                addressComponent.address_components[0].long_name
              setInputValue(itemLocality)
              setLoadingDots('')
              setLocationDialog(false)
              setDistanceAndSortStore(
                position.coords.latitude,
                position.coords.longitude,
                stores,
                true
              )
            }
          })
        }
      }
    })
  }

  const errorCallback = (error: any) => {
    setLoadingDots('')
    setErrorMsg(true)
    console.error(error)
  }

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback)
    }
  }

  const cleanPath = removeQueryString(router.asPath)

  return (
    <>
      <NextHead>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <link rel="canonical" href={SITE_ORIGIN_URL + cleanPath} />
        <title>Stores</title>
        <meta name="title" content="Stores" />
        <meta name="description" content="Stores" />
        <meta name="keywords" content="Stores" />
        <meta property="og:image" content="" />
        <meta property="og:title" content="Stores" key="ogtitle" />
        <meta property="og:description" content="Stores" key="ogdesc" />
        <meta property="og:site_name" content={SITE_NAME} key="ogsitename" />
        <meta property="og:url" content={SITE_ORIGIN_URL + cleanPath} key="ogurl" />
      </NextHead>
      <div className="container py-4 mx-auto sm:py-10">
        <h1 className="pb-6 text-2xl font-semibold text-left text-gray-900 sm:pb-8 sm:text-3xl">
          Find a Store near you
        </h1>
        <div className="grid grid-cols-1 mt-0 sm:gap-4 sm:grid-cols-12">
          <div className="sm:col-span-4">
            <StoreSearch
              isDataLoading={false}
              isMobile={false}
              searchPincodeRef={searchPincodeRef}
              inputValue={inputValue}
              setInputValue={setInputValue}
              onSearchChangeDebounce={onSearchChangeDebounce}
              searchInputButton={searchInputButton}
              autoCompleteList={autoCompleteList}
              selectPlace={selectPlace}
              stores={stores}
            />
            <div className="grid grid-cols-1 mt-0 sm:gap-2 sm:grid-cols-1">
              <StoreList
                isDataLoading={isDataLoading}
                filteredStores={filteredStores}
              />
            </div>
          </div>
          <div className="sm:col-span-8">
            <MapWithMarkers locations={stores} setMap={setMap} />
          </div>

          <UseMyLocationModal
            isLocationDialog={isLocationDialog}
            setLocationDialog={setLocationDialog}
            getUserLocation={getUserLocation}
            setLoadingDots={setLoadingDots}
            loadingDots={loadingDots}
            isErrorMsg={isErrorMsg}
            setErrorMsg={setErrorMsg}
            deviceInfo={deviceInfo}
          />
        </div>
      </div>
      <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA1v3pkeBrwwbC-0KPCK5Uuhn77iHg2AjY&libraries=places"></script>
    </>
  )
}

StoreLocatorPage.Layout = Layout
