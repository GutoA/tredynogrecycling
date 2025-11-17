import React from 'react';
import { CollectionItem } from '../types';
import CollectionCard from './CollectionCard';
import { icons } from '../constants';

interface UpcomingCollectionsProps {
  todayCollections: CollectionItem[];
  tomorrowCollections: CollectionItem[];
}

const UpcomingCollections: React.FC<UpcomingCollectionsProps> = ({ todayCollections, tomorrowCollections }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <section>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Today</h2>
        <div className="bg-white rounded-lg p-6 shadow-sm min-h-[12rem] flex flex-col justify-center">
          {todayCollections.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {todayCollections.map(item => <CollectionCard key={item.id} item={item} largeIcon />)}
            </div>
          ) : (
            <div className="text-center text-slate-400 flex flex-col items-center justify-center space-y-2">
              {icons.noCollection}
              <p>No collections today.</p>
            </div>
          )}
        </div>
      </section>
      <section>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Tomorrow</h2>
        <div className="bg-white rounded-lg p-6 shadow-sm min-h-[12rem] flex flex-col justify-center">
          {tomorrowCollections.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tomorrowCollections.map(item => <CollectionCard key={item.id} item={item} largeIcon />)}
            </div>
          ) : (
            <div className="text-center text-slate-400 flex flex-col items-center justify-center space-y-2">
              {icons.noCollection}
              <p>No collections tomorrow.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default UpcomingCollections;