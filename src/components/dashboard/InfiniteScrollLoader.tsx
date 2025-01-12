import { forwardRef } from "react";

export interface InfiniteScrollLoaderProps {
  hasMore: boolean;
  onLoadMore: () => void;
}

const InfiniteScrollLoader = forwardRef<HTMLDivElement, InfiniteScrollLoaderProps>(
  ({ hasMore, onLoadMore }, ref) => {
    return (
      <div 
        ref={ref}
        className="h-10 flex items-center justify-center text-blue-400/60 text-sm"
      >
        {hasMore ? (
          <button 
            onClick={onLoadMore}
            className="hover:text-blue-400 transition-colors"
          >
            Load more...
          </button>
        ) : (
          "No more alerts to load"
        )}
      </div>
    );
  }
);

InfiniteScrollLoader.displayName = "InfiniteScrollLoader";

export default InfiniteScrollLoader;