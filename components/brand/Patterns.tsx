import React from 'react'
import Image from 'next/image'

const Patterns = () => {
  return (
    <div>
        {/* DESKTOP FFX PATTERN */}
        <div className='hidden xl:block'>
            <span className='absolute 2xl:right-96 lg:-top-20 2xl:top-0 lg:right-72'>
            <img
                alt='pattern'
                src="/assets/images/tiled_Pattern1.svg"
                width={370}
                height={300}
                
                className='2xl:h-[180px] 2xl:w-[370px] lg:h-[350px] lg:w-[270px]'
            />
            </span>
            <span className='absolute 2xl:right-[5.5rem] lg:-top-6 2xl:top-0 md:right-[4.3rem]'>
            <img
                alt='pattern'
                src='/assets/images/tiled_Pattern2.svg'
                width={240}
                height={300}
                
                className='lg:h-[260px] lg:w-[180px] 2xl:w-[240px] 2xl:h-[220px]'
            />
            </span>
            <span className='absolute 2xl:right-[18.7rem] lg:-bottom-16 2xl:bottom-0 lg:right-[9.2rem]'>
            <img
                alt='pattern'
                src='/assets/images/tiled_Pattern3.svg'
                width={245}
                height={300}
                
                className='lg:h-[260px] lg:w-[180px] 2xl:h-[160px] 2xl:w-[245px]'
            />
            </span>
        </div>

        {/* MOBILE FFX PATTERN */}
        <div className='xl:hidden'>
            <span className='absolute right-0 -bottom-10'>
            <img
                alt='mobile_pattern'
                src='/assets/images/tiled_Pattern4.svg'
                width={240}
                height={300}
                
                className=' h-[120px] w-[100px] sm:h-[220px] sm:w-[200px]'
            />
            </span>
        </div>
    </div>
  )
}

export default Patterns