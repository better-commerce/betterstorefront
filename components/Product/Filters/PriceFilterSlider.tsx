import { useState, useCallback, useMemo } from 'react'
import Range from 'rc-slider'
import Tooltip from 'rc-tooltip'
import 'rc-slider/assets/index.css'
import debounce from 'lodash/debounce'
import { useTranslation } from '@commerce/utils/use-translation'

interface PriceFilterSliderProps {
  handleFilters: (filters: any, type: string) => void
  sectionKey: string
  items: any[]
  routerFilters: any
}

const PriceFilterSlider: React.FC<PriceFilterSliderProps> = ({
  handleFilters,
  sectionKey,
  items = [],
  routerFilters,
}) => {
  const translate = useTranslation()
  const priceFilter = routerFilters?.find((filter: any) => { return filter?.Key === sectionKey })
  const step = 10
  const prices = [
    ...items?.filter((item) => item?.to !== null).map((item) => item?.to),
    ...items?.filter((item) => item?.from !== null).map((item) => item?.from),
  ]
  const maxPrice = Math.max(...prices)
  const minPrice = Math.min(...prices)
  const limits = useMemo(() => { return { minFrom: minPrice, maxTo: maxPrice }; }, [minPrice, maxPrice]);
  const marks = useMemo(() => {
    const validMin = !isNaN(limits?.minFrom) ? limits?.minFrom : 0;
    const validMax = !isNaN(limits?.maxTo) ? limits?.maxTo : 100;

    return {
      [validMin]: `${validMin}`,
      [validMax]: `${validMax}`,
    };
  }, [limits?.minFrom, limits?.maxTo]);

  const [selectedRange, setSelectedRange] = useState<[number, any]>([
    priceFilter ? parseInt(priceFilter?.Value?.split('-')[0]) : limits?.minFrom,
    priceFilter ? (priceFilter?.Value?.split('-')[1]) === '*' ? limits?.maxTo + step : (parseInt(priceFilter?.Value?.split('-')[1])) : limits?.maxTo + step,
  ])

  // Debounce the entire slider change function
  const debouncedSetRange = useCallback(debounce((range: any) => {
    routerFilters?.forEach((filter: any) => {
      if (filter?.Key === sectionKey) {
        handleFilters(filter, 'REMOVE_FILTERS');
      }
    });
    handleFilters(range, 'ADD_FILTERS');
  }, 500), [])

  function onSliderChange(value: any) {
    setSelectedRange(value);

    const upperRange = value[1] > limits?.maxTo ? '*' : value[1];
    const resultRange = {
      Key: sectionKey,
      Value: `${value[0]}-${upperRange}`,
      IsSelected: true,
    };

    debouncedSetRange(resultRange);
  }

  return (
    limits && (
      <div>
        <div className="w-full px-4">
          <Range
            min={limits?.minFrom}
            max={limits?.maxTo}
            marks={marks}
            step={step}
            range
            defaultValue={selectedRange}
            onChange={onSliderChange}
            allowCross={false}
            trackStyle={{ backgroundColor: '#345662' }}
            handleStyle={{
              backgroundColor: '#345662',
              borderColor: '#345662',
              opacity: 'step0%',
            }}
            style={{ width: '', marginTop: '20px' }}
            handleRender={(node, handleProps) => {
              return (
                <Tooltip overlayInnerStyle={{ minHeight: 'auto' }} overlay={handleProps.value} placement="top" mouseLeaveDelay={0} >
                  {node}
                </Tooltip>
              )
            }}
          />
        </div>
        <p className="relative flex justify-between px-2 mt-6 ml-0 text-sm text-gray-500 cursor-pointer filter-label dark:text-black">
          <span className='text-sm font-bold text-black'>{translate('label.product.priceFilterSlider.minText')}:
            <span className='font-medium text-gray-600'>{selectedRange[0]}</span>
          </span>
          <span className='text-sm font-bold text-black'>
            {translate('label.product.priceFilterSlider.maxText')}:{' '}
            <span className='font-medium text-gray-600'>{selectedRange[1] > limits?.maxTo || selectedRange[1] === '*' ? translate('label.product.priceFilterSlider.noLimitText') : selectedRange[1]}</span>
          </span>

        </p>
      </div>
    )
  )
}

export default PriceFilterSlider
