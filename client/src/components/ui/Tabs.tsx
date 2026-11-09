import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  badge?: number | string;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ items, activeId, onChange, className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-1.5 p-1 bg-ui-surface-sunken border-1.5 border-ui-border-default rounded-xl ${className}`}>
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-body-sm font-bold transition-all select-none cursor-pointer flex items-center gap-1.5 ${
              isActive
                ? 'bg-ui-surface text-ui-text-primary border-1.5 border-ui-border-default shadow-hard-xs'
                : 'text-ui-text-secondary hover:text-ui-text-primary'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="px-1.5 py-0.2 bg-brand-primary text-white text-caption rounded-full">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
