
import { COLLECTION_ITEMS, FORTNIGHTLY_REFERENCE_DATE } from './constants';
import { CollectionItem, CollectionItemId } from './types';

// Memoization cache for generated yearly schedules to avoid re-computation.
const scheduleCache = new Map<number, Map<string, { collections: CollectionItem[], isHolidayShift: boolean }>>();

const isFortnightlyThursday = (date: Date): boolean => {
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  if (targetDate < FORTNIGHTLY_REFERENCE_DATE) {
    return false;
  }

  const diffTime = targetDate.getTime() - FORTNIGHTLY_REFERENCE_DATE.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  return (diffDays % 14) === 0;
};

// Calculates the standard collection schedule for a given date, without considering holidays.
const getNormalCollectionsFor = (date: Date): CollectionItem[] => {
  const collections: CollectionItem[] = [];
  const dayOfWeek = date.getDay();

  if (dayOfWeek === 2) { // Tuesday
    collections.push(COLLECTION_ITEMS[CollectionItemId.FOOD_CADDIES]);
  }

  if (dayOfWeek === 4) { // Thursday
    collections.push(COLLECTION_ITEMS[CollectionItemId.RED_BAGS]);
    collections.push(COLLECTION_ITEMS[CollectionItemId.PURPLE_BAGS]);

    if (isFortnightlyThursday(date)) {
      collections.push(COLLECTION_ITEMS[CollectionItemId.BLACK_BAGS]);
      collections.push(COLLECTION_ITEMS[CollectionItemId.GLASS_BOX]);
    }
  }
  return collections;
};

/**
 * Returns the start (Monday) and end (Sunday) of the week for a given date.
 * @param {Date} date The date to get the week range for.
 * @returns {{start: Date, end: Date}} The start and end dates of the week.
 */
const getWeekRange = (date: Date): { start: Date; end: Date } => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const dayOfWeek = (d.getDay() + 6) % 7; // Monday = 0, Sunday = 6
    
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - dayOfWeek);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    return { start: weekStart, end: weekEnd };
};

/**
 * Generates a complete, holiday-aware collection schedule for an entire year.
 * @param {number} year The year to generate the schedule for.
 * @returns {Map<string, { collections: CollectionItem[], isHolidayShift: boolean }>} A map where keys are date strings (YYYY-MM-DD)
 * and values are the collections for that day and a flag indicating if it was holiday-shifted.
 */
export const generateYearSchedule = (year: number): Map<string, { collections: CollectionItem[], isHolidayShift: boolean }> => {
  if (scheduleCache.has(year)) {
    return scheduleCache.get(year)!;
  }

  const schedule = new Map<string, { collections: CollectionItem[], isHolidayShift: boolean }>();

  // Define holiday dates
  const newYearsDay = new Date(year, 0, 1);
  const christmasDay = new Date(year, 11, 25);

  // Determine the affected weeks
  const newYearsWeek = getWeekRange(newYearsDay);
  const christmasWeek = getWeekRange(christmasDay);
  
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const normalCollections = getNormalCollectionsFor(d);
      
      if (normalCollections.length === 0) {
          continue;
      }

      const currentDate = new Date(d);
      currentDate.setHours(0, 0, 0, 0);
      let actualCollectionDate = new Date(currentDate);
      let isHolidayShift = false;

      // Check for New Year's holiday shift (1-day delay)
      if (currentDate.getTime() >= newYearsDay.getTime() && currentDate.getTime() <= newYearsWeek.end.getTime()) {
          actualCollectionDate.setDate(currentDate.getDate() + 1);
          isHolidayShift = true;
      }
      // Check for Christmas holiday shift (2-day delay)
      else if (currentDate.getTime() >= christmasDay.getTime() && currentDate.getTime() <= christmasWeek.end.getTime()) {
          actualCollectionDate.setDate(currentDate.getDate() + 2);
          isHolidayShift = true;
      }
      
      const dateString = actualCollectionDate.toISOString().split('T')[0];
      const existingEntry = schedule.get(dateString) || { collections: [], isHolidayShift: false };
      
      // Combine collections from the holiday with any existing ones on the rescheduled day.
      const combined = [...existingEntry.collections, ...normalCollections];
      // Remove duplicates based on item id to be safe.
      const uniqueItems = Array.from(new Map(combined.map(item => [item.id, item])).values());

      schedule.set(dateString, {
        collections: uniqueItems,
        isHolidayShift: existingEntry.isHolidayShift || isHolidayShift,
      });
  }
  
  scheduleCache.set(year, schedule);
  return schedule;
};
