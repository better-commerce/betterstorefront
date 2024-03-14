// Base Imports
import React from 'react'

// Package Imports
import Link from 'next/link'

// Other Imports
import { SocialMediaType } from '@components/utils/constants'
import { SOCIAL_REGISTER_APPLE, SOCIAL_REGISTER_FACEBOOK, SOCIAL_REGISTER_GOOGLE } from '@components/utils/textVariables'
import { getEnabledSocialLogins } from '@framework/utils/app-util'

interface SocialSignInLinksProps {
  containerCss?: string;
  isLoginSidebarOpen?: boolean;
  pluginSettings: any;
  redirectUrl?: any
}

const SocialSignInLinks = ({ containerCss, isLoginSidebarOpen = false, pluginSettings = []  }: SocialSignInLinksProps) => {
  const SOCIAL_LOGINS_ENABLED = getEnabledSocialLogins(pluginSettings)
  const socialLogins: Array<string> = SOCIAL_LOGINS_ENABLED.split(',')
  return (
    <div className={containerCss}>
  {
    socialLogins?.includes(SocialMediaType.GOOGLE) && (
      <Link
        legacyBehavior
        href={`/my-account/login/social/${SocialMediaType.GOOGLE}`}
      >
        <a className={`btn w-full px-6 py-2 text-sm font-medium text-center text-white bg-red-500 ${isLoginSidebarOpen ? `!px-0 !py-2` : '' }`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="inline-block w-4 h-4 mr-1 rounded google-plus-logo"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M7 11v2.4h3.97c-.16 1.029-1.2 3.02-3.97 3.02-2.39 0-4.34-1.979-4.34-4.42 0-2.44 1.95-4.42 4.34-4.42 1.36 0 2.27.58 2.79 1.08l1.9-1.83c-1.22-1.14-2.8-1.83-4.69-1.83-3.87 0-7 3.13-7 7s3.13 7 7 7c4.04 0 6.721-2.84 6.721-6.84 0-.46-.051-.81-.111-1.16h-6.61zm0 0 17 2h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
          {SOCIAL_REGISTER_GOOGLE}
        </a>
      </Link>
    )
  }
  {
  socialLogins?.includes(SocialMediaType.FACEBOOK) && (
      <Link
        legacyBehavior
        href={`/my-account/login/social/${SocialMediaType.FACEBOOK}`}
      >
        <a className={`btn w-full px-6 py-2 text-sm font-medium text-center text-white bg-sky-600 ${isLoginSidebarOpen ? `!px-0 !py-2 !pl-1 !pr-1` : ''}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="inline-block w-4 h-4 mr-1 rounded fb-logo"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
          </svg>
          {SOCIAL_REGISTER_FACEBOOK}
        </a>
      </Link>
        )
      }

      {
        socialLogins?.includes(SocialMediaType.APPLE) && (
      <Link
        legacyBehavior
        href={`/my-account/login/social/${SocialMediaType.APPLE}`}
      >
        <a className={`btn w-full px-6 py-2 text-sm font-medium text-center text-white bg-black ${isLoginSidebarOpen ? `!px-0 !py-2` : '' }`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="inline-block w-4 h-4 mr-1 rounded apple-logo"
            width="4"
            height="4"
            viewBox="0 0 496.255 608.728"
          >
            <path d="M273.81 52.973C313.806.257 369.41 0 369.41 0s8.271 49.562-31.463 97.306c-42.426 50.98-90.649 42.638-90.649 42.638s-9.055-40.094 26.512-86.971zM252.385 174.662c20.576 0 58.764-28.284 108.471-28.284 85.562 0 119.222 60.883 119.222 60.883s-65.833 33.659-65.833 115.331c0 92.133 82.01 123.885 82.01 123.885s-57.328 161.357-134.762 161.357c-35.565 0-63.215-23.967-100.688-23.967-38.188 0-76.084 24.861-100.766 24.861C89.33 608.73 0 455.666 0 332.628c0-121.052 75.612-184.554 146.533-184.554 46.105 0 81.883 26.588 105.852 26.588z" />
          </svg>
          {SOCIAL_REGISTER_APPLE}
        </a>
      </Link>
        )
      }
    </div>
  )
}

export default SocialSignInLinks
