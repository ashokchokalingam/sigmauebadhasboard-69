import { forwardRef } from "react";

interface InfiniteScrollLoaderProps {
  hasMore: boolean;
  onLoadMore: () => void;
}

const InfiniteScrollLoader = forwardRef<HTMLDivElement, InfiniteScrollLoaderProps>(
  ({ hasMore, onLoadMore }, ref) => {
    return (
      <div 
        ref={ref}
        className="h-10 flex items-center justify-center text-blue-400/60 text-sm"
        onClick={onLoadMore}
      >
        {hasMore ? "Loading more..." : "No more alerts to load"}
      </div>
    );
  }
);

InfiniteScrollLoader.displayName = "InfiniteScrollLoader";

export default InfiniteScrollLoader;