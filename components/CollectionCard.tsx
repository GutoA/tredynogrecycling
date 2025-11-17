import React from 'react';
import { CollectionItem } from '../types';

interface CollectionCardProps {
  item: CollectionItem;
  largeIcon?: boolean;
}

const colorVariants: { [key: string]: string } = {
  red: 'border-red-500 text-red-600',
  purple: 'border-purple-500 text-purple-600',
  gray: 'border-gray-500 text-gray-600',
  cyan: 'border-cyan-500 text-cyan-600',
  brown: 'border-stone-600 text-stone-700',
};

const CollectionCard: React.FC<CollectionCardProps> = ({ item, largeIcon = false }) => {
  const colorClass = colorVariants[item.color] || 'border-slate-500 text-slate-600';

  return (
    <div className={`bg-white border-l-4 ${colorClass} rounded-r-lg p-4 flex items-center space-x-4 shadow-md transition-transform hover:scale-105 hover:bg-slate-50`}>
      <div className="flex-shrink-0">
        {largeIcon ? React.cloneElement(item.icon as React.ReactElement, { className: 'h-12 w-12' }) : item.icon}
      </div>
      <div>
        <h4 className="font-bold text-slate-900">{item.name}</h4>
        <p className="text-sm text-slate-500">{item.description}</p>
      </div>
    </div>
  );
};

export default CollectionCard;