import { Button } from '@components/ui'
import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import React, { useEffect, useMemo, useState } from 'react'
import { AssessmentSteps } from '.'
import { NEXT_TRADE_IN_UPDATE_PRODUCT_ACCESSORIES, NEXT_TRADE_IN_UPDATE_PRODUCT_CONDITION, NEXT_TRADE_IN_UPDATE_PRODUCT_NOTES } from '@components/utils/constants'
import { AxiosRequestConfig } from 'axios'
import { RequestMethod } from 'bc-payments-sdk/dist/constants'
import { callApi } from '@framework/utils/api-util'
import { logError } from '@framework/utils/app-util'

const statusValueMap: { [key: string]: number } = { Yes: 1, No: 0, NA: 2, };
export default function ProductAccessories({ product, setCurrentStep, currentStep, setCompletedSteps, assessmentId, assessmentData, onCloseAmendProduct }: any) {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [assessmentNotes, setAssessmentNotes] = useState<string>('');
  
  const accessories = useMemo(() => assessmentData?.assessmentAccessories || [], [])

  const handleChange = (id: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [id]: value }));
    setErrors((prev: any) => ({ ...prev, [id]: false }));
  };

  const handleSubmit = async () => {
    const newErrors: { [key: string]: boolean } = {};
    accessories?.forEach(({ accessoryId }: any) => { if (!formData[accessoryId]) { newErrors[accessoryId] = true; } });
    if (!formData['condition']) { newErrors['condition'] = true; }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = accessories.map((item: any) => ({ accessoryId: item.accessoryId, accessoryName: item.accessoryName, checkStatus: statusValueMap[formData[item.accessoryId]], }));

    try {
      const config: AxiosRequestConfig = { url: NEXT_TRADE_IN_UPDATE_PRODUCT_ACCESSORIES, method: RequestMethod.PUT, data: { payload, id: assessmentId  }, }
      const assessmentResult = await callApi(config)
      if (assessmentResult?.data) {
        const config: AxiosRequestConfig = { url: NEXT_TRADE_IN_UPDATE_PRODUCT_CONDITION, method: RequestMethod.PUT, data: { condition:formData?.condition, id: assessmentId  }, }
        const assessmentConditionResult = await callApi(config)
        if (assessmentConditionResult?.data && formData?.assessmentNotes && formData?.assessmentNotes !== assessmentNotes) {
          const notesPayload = [{stage: 1, notes: formData?.assessmentNotes}]
          const config: AxiosRequestConfig = { url: NEXT_TRADE_IN_UPDATE_PRODUCT_NOTES, method: RequestMethod.PUT, data: { notes: notesPayload, id: assessmentId  }, }
          await callApi(config)
        }
        setCompletedSteps(null)
        setCurrentStep(AssessmentSteps.PRODUCT_VALIDATION)
        onCloseAmendProduct();
      }
    } catch (error) {
        logError(error)
    }
  };

  useEffect(() => {
    const idToStatusMap = Object.entries(statusValueMap).reduce((acc, [key, value]) => { acc[value] = key; return acc; }, {} as Record<number, string>);
    assessmentData?.assessmentAccessories?.forEach((item: any) => {
      const statusValue = idToStatusMap[item.accessoryStatusId] ?? 'NA';
      setFormData((prev) => ({ ...prev, [item.accessoryId]: statusValue }));
    });
    const notes = (assessmentData?.assessmentNotes || []).filter((n: any) => n.stageId === 1).map((n: any) => n.notes || '').join('\n').trim();
    setAssessmentNotes(notes);
    setFormData((prev) => ({ ...prev, condition: assessmentData?.condition, assessmentNotes: notes }));
  }, [assessmentData]);

  return (
    <div className="w-full">
      <div className="mx-auto w-full bg-white py-2 border border-slate-800">
        <Disclosure defaultOpen={currentStep === AssessmentSteps.PRODUCT_ACCESSORIES} as="div" className="w-full">
          {({ open, close }) => (
            <>
              <Disclosure.Button className="flex w-full text-[#212530] justify-between py-2 text-left text-sm font-medium  focus:outline-none border-b-2 border-black p-2">
                <span className="uppercase">Product Accessories</span>
                <ChevronDownIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 `} />
              </Disclosure.Button>
              <Disclosure.Panel className="p-2 text-sm text-gray-500">
                <div className="p-4 border rounded-md space-y-4">
                  <div className="grid grid-cols-5 font-semibold pb-2">
                      <div></div>
                      <div className="text-start">Yes</div>
                      <div className="text-start">N/A</div>
                      <div className="text-start">No</div>
                      <div className="text-start">CA</div>
                  </div>

                  {accessories?.map((item: any) => (
                      <div key={item.accessoryId} className="grid grid-cols-5 py-2">
                      <div className="font-medium text-start">{item.accessoryName}</div>

                      {['Yes', 'NA', 'No'].map((option) => (
                          <div className="text-start" key={option}>
                          <input type="radio" name={item.accessoryId} value={option} onChange={() => handleChange(item.accessoryId, option)} checked={formData[item.accessoryId] === option} className={`accent-blue-600 ${errors[item.accessoryId] ? 'ring-2 ring-red-500' : ''}`} />
                          </div>
                      ))}

                      <div className="text-start text-sm text-green-700">{item.customerAccessoryStatus === 'OK' ? 'Yes' : 'No'}</div>
                      </div>
                  ))}

                  <div className="text-start">
                      <p className="text-sm font-semibold">Condition<span className="text-red-600">*</span></p>
                  <select className="p-2 h-10 text-xs border rounded w-full" value={formData?.condition} onChange={(event) => {handleChange('condition', event.target.value)}} >
                    <option value="">--Select Condition--</option>
                    {assessmentData?.conditionsList?.map((item: any) => ( <option key={item.conditionId} value={item.itemCondition}>{item.conditionName}</option> ))}
                  </select>
                  </div>
                  {errors && Object.keys(errors).length > 0 && <p className='text-red-600 text-start'>Please select all fields.</p>}
                  <textarea placeholder="Assessment Notes" className="w-full border rounded-md p-2 text-sm mt-4" rows={3} value={formData?.assessmentNotes} onChange={(event) => { handleChange('assessmentNotes', event.target.value) }} />

                  <div className="text-center"> <Button onClick={handleSubmit} className="btn btn-primary" > Submit </Button> </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  )
}
