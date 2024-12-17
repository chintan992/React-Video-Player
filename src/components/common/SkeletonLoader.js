import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const MediaItemSkeleton = () => {
  return (
    <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
      <Skeleton height="100%" />
      <div className="p-2">
        <Skeleton count={2} />
      </div>
    </div>
  );
};

export const FeaturedSkeleton = () => {
  return (
    <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
      <Skeleton height="100%" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <Skeleton height={32} width="60%" />
        <div className="mt-2">
          <Skeleton count={2} />
        </div>
      </div>
    </div>
  );
};

export const FiltersSkeleton = () => {
  return (
    <div className="flex gap-2 mb-6">
      <Skeleton width={100} height={40} count={5} inline />
    </div>
  );
};
