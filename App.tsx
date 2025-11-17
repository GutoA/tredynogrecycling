import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CollectionItem } from './types';
import { COLLECTION_ITEMS } from './constants';
import UpcomingCollections from './components/UpcomingCollections';
import CollectionCard from './components/CollectionCard';
import ViewSwitcher from './components/ViewSwitcher';
import CalendarView from './components/CalendarView';
import { generateYearSchedule } from './utils';

type View = 'next' | 'calendar';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>('next');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const currentYear = currentDate.getFullYear();
  const schedule = useMemo(() => generateYearSchedule(currentYear), [currentYear]);
  const nextYearSchedule = useMemo(() => generateYearSchedule(currentYear + 1), [currentYear]);
  const combinedSchedule = useMemo(() => new Map([...schedule, ...nextYearSchedule]), [schedule, nextYearSchedule]);

  const getCollections = useCallback((date: Date): CollectionItem[] => {
    const dateString = date.toISOString().split('T')[0];
    return combinedSchedule.get(dateString)?.collections || [];
  }, [combinedSchedule]);

  const isDateHolidayShifted = useCallback((date: Date): boolean => {
    const dateString = date.toISOString().split('T')[0];
    return combinedSchedule.get(dateString)?.isHolidayShift || false;
  }, [combinedSchedule]);

  const today = new Date(currentDate);
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const todayCollections = getCollections(today);
  const tomorrowCollections = getCollections(tomorrow);

  const laterItems = useMemo(() => {
    const collectedSoonIds = new Set([
      ...todayCollections.map(c => c.id),
      ...tomorrowCollections.map(c => c.id)
    ]);

    const itemsToFind = Object.values(COLLECTION_ITEMS).filter(
      item => !collectedSoonIds.has(item.id)
    );

    const foundItems: { item: CollectionItem, date: Date }[] = [];

    for (const item of itemsToFind) {
      const searchDate = new Date(tomorrow);
      searchDate.setDate(searchDate.getDate() + 1); // Start from the day after tomorrow

      // Search for up to a year
      for (let i = 0; i < 365; i++) {
        const collectionsOnDate = getCollections(searchDate);
        if (collectionsOnDate.some(c => c.id === item.id)) {
          foundItems.push({ item, date: new Date(searchDate) });
          break; // Found it, move to the next item type
        }
        searchDate.setDate(searchDate.getDate() + 1);
      }
    }
    
    // Sort by date, then by name
    foundItems.sort((a, b) => {
      const dateDiff = a.date.getTime() - b.date.getTime();
      if (dateDiff !== 0) return dateDiff;
      return a.item.name.localeCompare(b.item.name);
    });

    return foundItems;
  }, [todayCollections, tomorrowCollections, getCollections, tomorrow]);

  const laterGrouped = useMemo(() => {
    const groups = new Map<string, { date: Date, items: CollectionItem[] }>();
    laterItems.forEach(({ item, date }) => {
      const dateString = date.toISOString().split('T')[0];
      if (!groups.has(dateString)) {
        groups.set(dateString, { date, items: [] });
      }
      groups.get(dateString)!.items.push(item);
    });
    return Array.from(groups.values());
  }, [laterItems]);

  const showHolidayNote = useMemo(() => {
    if (view === 'calendar') {
      const months = [];
      const date = new Date(currentDate);
      const year = date.getFullYear();
      const month = date.getMonth();
      for (let i = 0; i < 3; i++) {
          const d = new Date(year, month + i, 1);
          months.push(d.getMonth());
      }
      return months.includes(0) || months.includes(11); // 0=Jan, 11=Dec
    } else { // 'next' view
      if (isDateHolidayShifted(today) || isDateHolidayShifted(tomorrow)) {
        return true;
      }
      for (const group of laterGrouped) {
        if (isDateHolidayShifted(group.date)) {
          return true;
        }
      }
      return false;
    }
  }, [view, currentDate, isDateHolidayShifted, today, tomorrow, laterGrouped]);


  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-green-600">
            Recycling Collection
          </h1>
          <p className="text-lg text-slate-600 mt-2">Tredynog (Tredunnock)</p>
          <p className="text-md text-slate-500 mt-1">
            {currentDate.toLocaleString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </header>

        <main>
          {view === 'next' ? (
            <>
              <UpcomingCollections
                todayCollections={todayCollections}
                tomorrowCollections={tomorrowCollections}
              />
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-slate-900 border-b-2 border-slate-300 pb-2 mb-4">
                  Other items
                </h2>
                {laterGrouped.length > 0 ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {laterGrouped.map(({ date, items }) => (
                      <div key={date.toISOString()}>
                        <h3 className="text-xl font-semibold text-green-600 mb-3">
                          {date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                        </h3>
                        <div className="space-y-4">
                          {items.map((item) => (
                            <CollectionCard key={item.id} item={item} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-slate-500 py-8">All items are scheduled for collection soon.</p>
                )}
              </div>
            </>
          ) : (
            <CalendarView schedule={combinedSchedule} />
          )}
        </main>
        
        <footer className="mt-12 flex flex-col items-center space-y-4">
            <ViewSwitcher currentView={view} onViewChange={setView} />
            {showHolidayNote && (
              <p className="text-center text-slate-500 text-sm">
                  Holiday schedule: In Christmas week, collections from Dec 25 onwards are delayed by 2 days. In New Year's week, collections from Jan 1 onwards are delayed by 1 day. Normal service resumes the following Monday.
              </p>
            )}
        </footer>
      </div>
    </div>
  );
};

export default App;