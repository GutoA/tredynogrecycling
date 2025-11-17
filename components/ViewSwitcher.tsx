import React from 'react';

type View = 'next' | 'calendar';

interface ViewSwitcherProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ currentView, onViewChange }) => {
  const baseClasses = "px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 focus:ring-green-500";
  const activeClasses = "bg-green-600 text-white shadow-md";
  const inactiveClasses = "bg-transparent text-slate-600 hover:bg-slate-200";

  return (
    <div className="bg-slate-200/75 p-1 rounded-full flex items-center space-x-1">
      <button
        onClick={() => onViewChange('next')}
        className={`${baseClasses} ${currentView === 'next' ? activeClasses : inactiveClasses}`}
        aria-pressed={currentView === 'next'}
      >
        Upcoming
      </button>
      <button
        onClick={() => onViewChange('calendar')}
        className={`${baseClasses} ${currentView === 'calendar' ? activeClasses : inactiveClasses}`}
        aria-pressed={currentView === 'calendar'}
      >
        Calendar
      </button>
    </div>
  );
};

export default ViewSwitcher;