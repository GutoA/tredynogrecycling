import React from 'react';

export enum CollectionItemId {
  RED_BAGS = 'RED_BAGS',
  PURPLE_BAGS = 'PURPLE_BAGS',
  BLACK_BAGS = 'BLACK_BAGS',
  GLASS_BOX = 'GLASS_BOX',
  FOOD_CADDIES = 'FOOD_CADDIES',
}

export interface CollectionItem {
  id: CollectionItemId;
  name: string;
  description: string;
  color: string;
  // Fix: Changed type to React.ReactNode to resolve JSX namespace error in a .ts file.
  icon: React.ReactNode;
}
