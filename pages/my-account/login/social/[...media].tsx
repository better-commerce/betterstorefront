// Base Imports
import React, { useEffect } from "react";

// Package Imports
import { GetServerSideProps } from 'next'
import { useSession, signIn, signOut } from 'next-auth/react';

// Component Imports
import Spinner from '@components/ui/Spinner'

// Other Imports
import { SocialMediaType } from "@components/utils/constants";

interface ISocialLoginPageProps {
  readonly medium: SocialMediaType
}

const SocialLoginPage = (props: ISocialLoginPageProps) => {
  const { medium } = props
  const { data: userData, status } = useSession();


  useEffect(() => {

    const asyncHandler = async (media: string) => {
      switch (media) {
        case SocialMediaType.GOOGLE:
          const googleSocialLoginResult = await signIn('google')
          debugger
          break;

        case SocialMediaType.FACEBOOK:
          break;
      }
    }

    if (!userData) {
      asyncHandler(medium)
    }

  }, [medium]);

  useEffect(() => {
    if (status === 'authenticated') {
      debugger;
    }
  }, [status])

  return (
    <>
      <Spinner />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const params: any = context?.query
  const media = params?.media?.length ? params?.media[0] : ''
  return {
    props: {
      medium: media, // Generic
    }, // will be passed to the page component as props
  }
}

export default SocialLoginPage