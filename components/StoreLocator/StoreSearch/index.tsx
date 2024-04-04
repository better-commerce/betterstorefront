import Cross from '@components/shared/icons/Cross'
import MyLocationIcon from '@components/shared/icons/MyLocationIcon'
import SearchIcon from '@components/shared/icons/SearchIcon'

export const StoreSearch = ({
  isDataLoading,
  isMobile,
  searchPincodeRef,
  inputValue,
  setInputValue,
  onSearchChangeDebounce,
  searchInputButton,
  autoCompleteList,
  selectPlace,
  currentTab,
  stores,
}: any) => {
  return (
    <>
      {isDataLoading ? (
        <>
          <div className="h-[55px] w-full my-[20px] bg-[#dbdbdb52]"></div>
        </>
      ) : (
        <>
          <div
            className={`w-full relative ${
              isMobile ? 'pb-4' : 'pt-0 pb-4'
            }`}
          >
            <div className="flex flex-row gap-2 items-center px-3 py-[18px] border border-[#dbdbdb52] rounded-2xl bg-[#dbdbdb52] text-primary">
              <label className="hidden" htmlFor={'search-bar'}>
                Search by City / Pincode / Location
              </label>
              <div className="relative left-0 py-0 text-gray-400">
                <SearchIcon />
              </div>
              <input
                id="search-bar"
                ref={searchPincodeRef}
                value={inputValue}
                className="w-full min-w-0 px-0 py-0 text-sm font-normal text-gray-700 placeholder-gray-500 bg-transparent appearance-none border-none focus:outline-none focus:ring-0 rounded-2xl"
                placeholder="Search by City / Pincode / Location"
                onChange={(e) => {
                  setInputValue(e.target.value)
                  onSearchChangeDebounce(e, stores)
                }}
              />
              <button
                type="button"
                className="text-[#251000A3] outline-none font-semibold text-xs hover:text-gray-500"
                onClick={() => {
                  searchInputButton()
                }}
              >
                {inputValue.length > 0 ? (
                  <Cross fill="#2510008F" width="20px" height="20px" />
                ) : (
                  <MyLocationIcon />
                )}
              </button>
            </div>

            {autoCompleteList.length ? (
              <div className="absolute border-1 z-10 w-full bg-white border-2">
                <ul>
                  {autoCompleteList.map((item: any) => {
                    return (
                      <li
                        className="p-[10px] text-gray-700 text-sm font-normal cursor-pointer"
                        key={item?.place_id}
                        onClick={() => {
                          selectPlace(item?.place_id)
                          setInputValue(item?.description)
                        }}
                      >
                        {item?.description}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ) : (
              ''
            )}
          </div>
        </>
      )}
    </>
  )
}
