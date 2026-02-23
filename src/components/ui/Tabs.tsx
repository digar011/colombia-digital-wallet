'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'underline' | 'pills' | 'enclosed';
  size?: 'sm' | 'md';
  fullWidth?: boolean;
  className?: string;
}

export interface TabPanelProps {
  tabId: string;
  activeTab: string;
  children: React.ReactNode;
  className?: string;
}

function Tabs({
  tabs,
  activeTab: controlledActive,
  onChange,
  variant = 'underline',
  size = 'md',
  fullWidth = false,
  className,
}: TabsProps) {
  const [internalActive, setInternalActive] = useState(tabs[0]?.id || '');
  const activeTab = controlledActive ?? internalActive;
  const indicatorRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const handleTabClick = (tabId: string) => {
    if (!controlledActive) {
      setInternalActive(tabId);
    }
    onChange?.(tabId);
  };

  const updateIndicator = useCallback(() => {
    if (variant !== 'underline' || !indicatorRef.current) return;
    const activeEl = tabRefs.current.get(activeTab);
    if (activeEl && tabsContainerRef.current) {
      const containerRect = tabsContainerRef.current.getBoundingClientRect();
      const tabRect = activeEl.getBoundingClientRect();
      indicatorRef.current.style.left = `${tabRect.left - containerRect.left}px`;
      indicatorRef.current.style.width = `${tabRect.width}px`;
    }
  }, [activeTab, variant]);

  useEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  const sizeStyles = {
    sm: 'text-xs py-2 px-3',
    md: 'text-sm py-2.5 px-4',
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        ref={tabsContainerRef}
        role="tablist"
        className={cn(
          'relative flex',
          variant === 'underline' && 'border-b border-gray-200 dark:border-gray-700',
          variant === 'pills' && 'bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1',
          variant === 'enclosed' && 'gap-0',
          fullWidth && '[&>button]:flex-1'
        )}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) tabRefs.current.set(tab.id, el);
              }}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              disabled={tab.disabled}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 whitespace-nowrap',
                'disabled:opacity-40 disabled:cursor-not-allowed',
                sizeStyles[size],

                // Underline variant
                variant === 'underline' && [
                  'relative pb-2.5 border-b-2 -mb-px',
                  isActive
                    ? 'text-colombia-blue dark:text-colombia-yellow border-colombia-blue dark:border-colombia-yellow'
                    : 'text-text-secondary dark:text-text-secondary-dark border-transparent hover:text-text-primary dark:hover:text-text-primary-dark hover:border-gray-300 dark:hover:border-gray-500',
                ],

                // Pills variant
                variant === 'pills' && [
                  'rounded-md',
                  isActive
                    ? 'bg-white dark:bg-gray-700 text-colombia-blue dark:text-colombia-yellow shadow-sm'
                    : 'text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark',
                ],

                // Enclosed variant
                variant === 'enclosed' && [
                  'border border-transparent rounded-t-lg -mb-px',
                  isActive
                    ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 border-b-white dark:border-b-gray-800 text-colombia-blue dark:text-colombia-yellow'
                    : 'text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark hover:bg-gray-50 dark:hover:bg-gray-700/50',
                ]
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'inline-flex items-center justify-center rounded-full text-[10px] font-bold min-w-[18px] h-[18px] px-1',
                    isActive
                      ? 'bg-colombia-blue/10 text-colombia-blue dark:bg-colombia-yellow/10 dark:text-colombia-yellow'
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Animated underline indicator */}
        {variant === 'underline' && (
          <div
            ref={indicatorRef}
            className="absolute bottom-0 h-0.5 bg-colombia-blue dark:bg-colombia-yellow transition-all duration-300 ease-out"
          />
        )}
      </div>
    </div>
  );
}

function TabPanel({ tabId, activeTab, children, className }: TabPanelProps) {
  if (activeTab !== tabId) return null;

  return (
    <div
      id={`tabpanel-${tabId}`}
      role="tabpanel"
      aria-labelledby={tabId}
      className={cn('animate-fade-in pt-4', className)}
    >
      {children}
    </div>
  );
}

export { Tabs, TabPanel };
