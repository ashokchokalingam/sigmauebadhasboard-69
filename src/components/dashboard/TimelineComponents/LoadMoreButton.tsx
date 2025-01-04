interface LoadMoreButtonProps {
  show: boolean;
  onLoadMore: () => void;
}

const LoadMoreButton = ({ show, onLoadMore }: LoadMoreButtonProps) => {
  if (!show) return null;

  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={onLoadMore}
        className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-colors"
      >
        Load More
      </button>
    </div>
  );
};

export default LoadMoreButton;