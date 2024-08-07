import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from '@commerce/utils/use-translation'
import axios from 'axios'
import { DATE_TIME_FORMAT, NEXT_DOWNLOAD_DATA_PACK, NEXT_GET_DATA_PACK } from '@components/utils/constants'
import { useUI } from '@components/ui/context'
import { downloadBase64AsFile } from 'framework/utils/app-util'
import { ArrowDownIcon } from '@heroicons/react/24/outline'
import Loader from '@components/Loader'
import Spinner from '@components/ui/Spinner'
import moment from 'moment'

export default function DataPack() {
  const { user } = useUI()
  const translate = useTranslation()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data packs 
  const fetchDataPacks = async () => {
    setIsLoading(true); 
    try {
      const response: any = await axios.post(NEXT_GET_DATA_PACK, {
        companyId: user?.companyId,
      })
      setIsLoading(false); 
      if (response?.data) {
        setData(response.data);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };
  
  useEffect(() => {
    fetchDataPacks();
  }, [user?.companyId]);

  
  // Function to download products CSV
  const onDownloadProductsCSV = useCallback(async (companyId: string, id: string) => {
    setLoading(true); 
    try {
      const { data: downloadResult }: any = await axios.post(NEXT_DOWNLOAD_DATA_PACK, { companyId, id });
      setLoading(false); 
      if (downloadResult?.productDataPack) {
        downloadBase64AsFile(downloadResult?.productDataPack, `${id}-products.csv`, 'application/csv');
      }
    } catch (error) {
      setLoading(false); 
      console.error(error);
    }
  }, []);

  // Function to download images CSV
  const onDownloadImagesCSV = useCallback(async (companyId: string, id: string) => {
    setLoading(true); 
    try {
      const { data: downloadResult }: any = await axios.post(NEXT_DOWNLOAD_DATA_PACK, { companyId, id });
      setLoading(false); 
      if (downloadResult?.imageDataPack) {
        downloadBase64AsFile(downloadResult?.imageDataPack, `${id}-images.csv`, 'application/csv');
      }
    } catch (error) {
      setLoading(false); 
      console.error(error);
    }
  }, []);

  return (
    <>
      {isLoading ? (
        <Spinner /> 
      ) : (
        (data?.length) ? (
          <div className="inline-block min-w-full align-middle">
            {loading && <Loader />} 
            <DataPackDetailTable rows={data} onDownloadProductsCSV={onDownloadProductsCSV} onDownloadImagesCSV={onDownloadImagesCSV} />
          </div>
         ) : (
          <div className="py-20 font-medium text-center font-24 text-slate-300">{translate('common.label.noResultDatapackText')}</div>
         )
      )}
    </>
  )
}

const DataPackDetailTable = ({ rows, onDownloadProductsCSV, onDownloadImagesCSV }: any) => {
  const translate = useTranslation()
  return (
      <table className="min-w-full divide-y divide-gray-300">
          <thead className='bg-slate-100'>
              <tr>
                  <th scope="col" className="py-3.5 p-4 pr-3 text-left text-sm font-semibold text-gray-900">{translate('common.label.nameText')}</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{translate('common.label.generatedOnText')}</th>
                  <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">{translate('common.label.productsText')}</th>
                  <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">{translate('common.label.imagesText')}</th>
              </tr>
          </thead>
          {(rows?.length > 0) && <tbody className="divide-y divide-gray-200">
              {rows?.map((data: any) => (
                  <tr key={data?.dataPackId}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-base font-semibold text-gray-900">{data?.dataPackName}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{moment(new Date(data?.created)).format(DATE_TIME_FORMAT)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-right justify-end text-gray-500">
                          {
                            data?.productDataPackUrl && (
                              <>
                                <ArrowDownIcon className='w-5 h-5 text-gray-400 hover:text-black inline-block mr-4' onClick={async () => await onDownloadProductsCSV(data?.companyId, data?.id)} />
                              </>
                            )
                          }
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-right justify-end text-gray-500">
                          {
                            data?.imageDataPackUrl && (
                                <>
                                  <ArrowDownIcon className='w-5 h-5 text-gray-400 hover:text-black inline-block mr-4' onClick={async () => await onDownloadImagesCSV(data?.companyId, data?.id)} />
                                </>
                            )
                          }
                      </td>
                  </tr>
              ))}
          </tbody>}
      </table>
  )
}
