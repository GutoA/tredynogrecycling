
import React, { useMemo } from 'react';
import { CollectionItem, CollectionItemId } from '../types';

const getDayColor = (collections: CollectionItem[]): string => {
  if (collections.length === 0) return '';
  
  const ids = new Set(collections.map(c => c.id));
  if (ids.has(CollectionItemId.BLACK_BAGS) || ids.has(CollectionItemId.GLASS_BOX)) {
    return 'bg-slate-800 text-white'; // All Collections (Fortnightly)
  }
  if (ids.has(CollectionItemId.RED_BAGS) || ids.has(CollectionItemId.PURPLE_BAGS)) {
    return 'bg-purple-100 border border-purple-300'; // Weekly bags only
  }
  if (ids.has(CollectionItemId.FOOD_CADDIES)) {
    return 'bg-green-100 border border-green-300'; // Food only
  }
  return '';
};

const Legend: React.FC = () => (
  <div className="mb-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
      <span>Food Caddies</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded bg-purple-100 border border-purple-300"></div>
      <span>Weekly Bags</span>
    </div>
     <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded bg-slate-800"></div>
      <span>Recycling + Rubbish</span>
    </div>
  </div>
);

interface MonthCalendarProps {
  year: number;
  month: number; // 0-11
  schedule: Map<string, { collections: CollectionItem[], isHolidayShift: boolean }>;
  currentRealYear: number;
}

const MonthCalendar: React.FC<MonthCalendarProps> = ({ year, month, schedule, currentRealYear }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
  const monthTitle = year !== currentRealYear ? `${monthName} ${year}` : monthName;
  
  const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  
  const days = [];
  const date = new Date(year, month, 1);
  const firstDay = (date.getDay() + 6) % 7; // 0=Mon, 6=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-start-${i}`} className="h-8"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const dateString = currentDate.toISOString().split('T')[0];
    const collections = schedule.get(dateString)?.collections || [];
    const colorClass = getDayColor(collections);
    const isToday = currentDate.getTime() === today.getTime();
    
    days.push(
      <div key={day} className={`h-8 flex items-center justify-center rounded-full text-sm ${colorClass} ${isToday ? 'ring-2 ring-green-500' : ''}`}>
        {day}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="font-bold text-lg text-center text-slate-800 mb-2">{monthTitle}</h3>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500">
        {daysOfWeek.map(day => <div key={day}>{day}</div>)}
        {days}
      </div>
    </div>
  );
};

interface CalendarViewProps {
  schedule: Map<string, { collections: CollectionItem[], isHolidayShift: boolean }>;
}

const CalendarView: React.FC<CalendarViewProps> = ({ schedule }) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const monthsToDisplay = useMemo(() => {
    const months = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date(currentYear, currentMonth + i, 1);
      months.push({ year: date.getFullYear(), month: date.getMonth() });
    }
    return months;
  }, [currentYear, currentMonth]);

  return (
    <div className="mt-8">
      <Legend />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {monthsToDisplay.map(({ year, month }) => (
          <MonthCalendar
            key={`${year}-${month}`}
            year={year}
            month={month}
            schedule={schedule}
            currentRealYear={currentYear}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
