import React from 'react';
import { CollectionItemId, CollectionItem } from './types';

export const icons = {
  bag: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  blackBag: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.5C10.7 2.5 9.5 3.6 9.5 5s1.2 2.5 2.5 2.5 2.5-1.2 2.5-2.5S13.3 2.5 12 2.5zM17.5 8c-1.1 0-2.1.6-2.6 1.5C14.3 9.2 13.2 9 12 9s-2.3.2-2.9.5C8.6 8.6 7.6 8 6.5 8C4 8 2 10.3 2 13v6c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-6c0-2.7-2-5-4.5-5z"/>
    </svg>
  ),
  glassBox: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9h18l-2.5 10H5.5L3 9z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 9h20" />
    </svg>
  ),
  foodCaddy: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 21l2-10h8l2 10H6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V9h10v2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 9V8h2v1" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 14C4.5 7, 19.5 7, 19.5 14" />
    </svg>
  ),
  noCollection: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export const COLLECTION_ITEMS: Record<CollectionItemId, CollectionItem> = {
  [CollectionItemId.RED_BAGS]: {
    id: CollectionItemId.RED_BAGS,
    name: "Red Bags",
    description: "Cardboard",
    color: "red",
    icon: icons.bag,
  },
  [CollectionItemId.PURPLE_BAGS]: {
    id: CollectionItemId.PURPLE_BAGS,
    name: "Purple Bags",
    description: "Metal & Plastic",
    color: "purple",
    icon: icons.bag,
  },
  [CollectionItemId.BLACK_BAGS]: {
    id: CollectionItemId.BLACK_BAGS,
    name: "Black Bags",
    description: "General Rubbish",
    color: "gray",
    icon: icons.blackBag,
  },
  [CollectionItemId.GLASS_BOX]: {
    id: CollectionItemId.GLASS_BOX,
    name: "Glass Box",
    description: "Glass Bottles & Jars",
    color: "cyan",
    icon: icons.glassBox,
  },
  [CollectionItemId.FOOD_CADDIES]: {
    id: CollectionItemId.FOOD_CADDIES,
    name: "Food Caddies",
    description: "Food Waste",
    color: "brown",
    icon: icons.foodCaddy,
  },
};

// The first "Week 2" collection Thursday in 2025, used as a reference point
// to calculate all subsequent fortnightly collections.
export const FORTNIGHTLY_REFERENCE_DATE = new Date('2025-01-09T00:00:00');
FORTNIGHTLY_REFERENCE_DATE.setHours(0, 0, 0, 0);