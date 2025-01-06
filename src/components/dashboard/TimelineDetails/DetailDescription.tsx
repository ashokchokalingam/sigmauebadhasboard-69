interface DetailDescriptionProps {
  description: string;
}

const DetailDescription = ({ description }: DetailDescriptionProps) => (
  <div className="bg-purple-400/5 rounded-lg p-6 border border-purple-400/20 backdrop-blur-sm">
    <h3 className="text-sm font-medium text-purple-200 mb-3">Description</h3>
    <p className="text-base text-purple-100/90 leading-relaxed">
      {description || 'No description available'}
    </p>
  </div>
);

export default DetailDescription;