import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { UserIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { getCurrentPage } from '@framework/utils/app-util'
import { recordGA4Event } from '@components/services/analytics/ga4'

export default function Account({ config, title, deviceInfo }: any) {
  const { isMobile, isIPadorTablet } = deviceInfo

  let deviceCheck = ''
  if (isMobile || isIPadorTablet) {
    deviceCheck = 'Mobile'
  } else {
    deviceCheck = 'Desktop'
  }

  const setLoginAttempt = () => {
    let currentPage = getCurrentPage()
    if (currentPage) {
      if (typeof window !== 'undefined') {
        recordGA4Event(window, 'login_attempt', {
          device: deviceCheck,
          browser: 'Chrome',
          current_page: currentPage,
        })
      }
    }
  }

  return (
    <Menu as="div" className="relative flow-root w-10 px-1 text-left sm:w-16">
      <Menu.Button
        className="grid flex-col items-center justify-center grid-cols-1 mx-auto text-center group align-center"
        aria-label="My Account"
        onClick={() => setLoginAttempt()}
      >
        <UserIcon
          className="flex-shrink-0 block w-6 h-6 mx-auto text-black group-hover:text-gray-500"
          aria-hidden="true"
          aria-label="My Account"
        />
        <span className="hidden text-sm font-normal text-black sm:block text-header-clr">
          Profile
        </span>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-50 flex flex-col w-56 px-1 py-1 mt-2 text-gray-900 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <>
                {title ? (
                  <h4 className="p-2 font-bold text-left">{title}</h4>
                ) : null}
                {config.map((item: any, idx: number) => (
                  <Link
                    key={idx}
                    title={item.title}
                    passHref
                    href={item.href}
                    className={item.className}
                    onClick={item.onClick || false}
                  >
                    {item.title}
                  </Link>
                ))}
              </>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
