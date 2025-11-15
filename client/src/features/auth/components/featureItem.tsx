function FeatureItem({ icon: Icon, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-2 shadow-sm">
        <Icon className="text-gray-700 text-base" />
      </div>
      <p>{label}</p>
    </div>
  );
}

export default FeatureItem;
