
import React from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabSwitcherProps {
  tabs: Tab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  navClassName?: string;
  activeTabClassName?: string;
  inactiveTabClassName?: string;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({
  tabs,
  activeTabId,
  onTabChange,
  navClassName = "flex space-x-1 border-b border-gray-200 mb-6",
  activeTabClassName = "bg-teal-600 text-white",
  inactiveTabClassName = "bg-gray-200 text-gray-700 hover:bg-gray-300"
}) => {
  return (
    <div>
      <nav className={navClassName} aria-label="Tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-3 px-4 sm:px-6 font-medium text-sm rounded-t-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors duration-150 ${
              activeTabId === tab.id ? activeTabClassName : inactiveTabClassName
            }`}
            role="tab"
            aria-selected={activeTabId === tab.id}
            aria-controls={`tab-panel-${tab.id}`}
            id={`tab-button-${tab.id}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div>
        {tabs.map(tab => (
          <div
            key={tab.id}
            id={`tab-panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-button-${tab.id}`}
            className={activeTabId === tab.id ? '' : 'hidden'}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabSwitcher;
