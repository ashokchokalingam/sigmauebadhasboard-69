import { forwardRef } from "react";

interface InfiniteScrollLoaderProps {
  hasMore: boolean;
}

const InfiniteScrollLoader = forwardRef<HTMLDivElement, InfiniteScrollLoaderProps>(
  ({ hasMore }, ref) => {
    return (
      <div 
        ref={ref}
        className="h-10 flex items-center justify-center text-blue-400/60 text-sm"
      >
        {hasMore ? "Loading more..." : "No more alerts to load"}
      </div>
    );
  }
);

InfiniteScrollLoader.displayName = "InfiniteScrollLoader";

export default InfiniteScrollLoader;