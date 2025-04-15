import React, { useState } from 'react';
import cn from 'classnames';

type TabItem = {
  id: string;
  label: string;
  content: React.ReactNode;
};

interface TabComponentProps {
  tabs: TabItem[];
  defaultActiveTab?: string;
}

const TabComponent = ({ tabs, defaultActiveTab }: TabComponentProps) => {
  const [activeTab, setActiveTab] = useState<string>(defaultActiveTab || (tabs?.length > 0 ? tabs[0]?.id : ''));

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="w-full py-4 px-4 sm:px-0 scroll-mt-32" id="bottomtabs">
      <div className="bg-gray-100 border border-gray-400">
        <div className="flex overflow-x-auto no-scrollbar">
          {tabs?.map((tab: any) => (
            <button
              key={tab?.id}
              onClick={() => handleTabClick(tab?.id)}
              className={cn(
                "py-2 px-4 text-sm font-medium focus:outline-none whitespace-nowrap",
                activeTab === tab?.id
                  ? "bg-[#2D4D9C] text-white"
                  : "bg-gray-100 text-gray-700 hover:text-white hover:bg-[#2D4D9C]"
              )}
            >
              {tab?.label}
            </button>
          ))}
        </div>
      </div>
      <div className="px-0 py-8">
        {tabs?.find((tab) => tab?.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default TabComponent;