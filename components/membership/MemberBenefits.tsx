import { GiftIcon, PlusIcon, StarIcon, TruckIcon, } from '@heroicons/react/24/outline'
import { useTranslation } from '@commerce/utils/use-translation'

const MemberBenefits = (props: any) => {
  const translate = useTranslation()
  const MEMBER_BENEFITS = [
    {
      name: translate('label.membership.benefits.name1'),
      description: translate('label.membership.benefits.desc1'),
      icon: <GiftIcon className="w-16 h-16 mx-auto mb-4 text-sky-600" />,
    },
    {
      name: translate('label.membership.benefits.name2'),
      description: translate('label.membership.benefits.desc2'),
      icon: <TruckIcon className="w-16 h-16 mx-auto mb-4 text-sky-600" />,
    },
    {
      name: translate('label.membership.benefits.name3'),
      description: translate('label.membership.benefits.desc3'),
      icon: (
        <StarIcon className="w-16 h-16 p-2 mx-auto mb-4 border-2 rounded-full text-sky-600 border-sky-600" />
      ),
    },
    {
      name: translate('label.membership.benefits.name4'),
      description: translate('label.membership.benefits.desc4'),
      icon: (
        <PlusIcon className="w-16 h-16 p-2 mx-auto mb-4 border-2 rounded-full text-sky-600 border-sky-600" />
      ),
    },
  ]

  return MEMBER_BENEFITS?.map((benefit: any, bIdx: number) => (
    <div key={`b-${bIdx}`} className="flex flex-col justify-center w-full">
      {benefit?.icon}
      <h2 className="mb-4 text-lg font-semibold text-slate-800">
        {benefit?.name}
      </h2>
      <h5 className="text-sm font-normal text-slate-600">
        {benefit?.description}
      </h5>
    </div>
  ))
}

export default MemberBenefits
