import { generateUri } from "@commerce/utils/uri-util";
import { IMG_PLACEHOLDER } from "@components/utils/textVariables";
import { sanitizeRelativeUrl } from "@framework/utils/app-util";
import Link from "next/link";

export default function LandingFeaturedCategory({ featuredCategory, categoryName, deviceInfo }: any) {
  return (
    <section className="pt-8">
      <div className="container px-4 mx-auto">
        <h2 className="pt-4 mb-6 font-semibold text-gray-800 border-t border-gray-400 heading">Shop {categoryName} by Category</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {featuredCategory?.filter((featured: any) => featured?.isFeatured === true).map((featured: any, featuredIdx: number) => (
            <div className="w-full text-center" key={featuredIdx}>
              <Link href={sanitizeRelativeUrl(featured?.link)} className="group" >
                <div className="bg-white border-[#B8B8B8] border p-3 rounded-xl flex flex-col items-center transition-all hover:shadow-md">
                  <div className="flex items-center justify-center w-9/12 mb-2">
                    {featured?.image ? (
                      <img src={generateUri(featured?.image, 'h=500&fm=webp') || IMG_PLACEHOLDER} className="object-contain max-w-full max-h-full" alt="Image" />
                    ) : (
                      <img src={IMG_PLACEHOLDER} className="object-contain max-w-full max-h-full" alt="Image" />
                    )}
                  </div>
                </div>
              </Link>
              <span className="block mt-2 text-xs font-medium text-center text-gray-700 group-hover:text-blue-600">
                {featured?.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
