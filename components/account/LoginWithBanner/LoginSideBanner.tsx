import Link from "next/link";
import { Logo } from "@components/ui";
export default function LoginSideBanner() {
  return (
    <>
   <div className="relative h-full park-bg-clr login-side-banner-img overflow-hidden flex flex-col justify-center items-center">
      {/* Background dot pattern */}
      <div className="absolute bottom-0 left-0 right-0 w-full grid grid-cols-12 gap-4 gap-y-8">
        {Array(72)?.fill(0)?.map((_, i) => (
          <div key={i} className="w-1 h-1 rounded-full bg-white/20" />
        ))}
      </div>
          
      {/* Content */}
      <div className="relative z-10 text-white text-center px-10 text-none-d">
        <div className="font-bold mb-16 flex justify-center">
        <Link href="/" passHref>
          <Logo className="flex-shrink-0" />
        </Link>
        </div>
        <h2 className="text-4xl font-bold mb-6">Big Rewards Await!</h2>
        
        <p className="mb-8 max-w-md">
          Sign up now and get rewarded! Enjoy a special welcome offer and 
          unlock bonus features for your first month.
        </p>
        
        <a 
          href="#" 
          className="inline-block text-white hover:text-gray-200 transition-colors"
        >
          Find out more &gt;
        </a>
      </div>
    </div>
    </>
  )
}
