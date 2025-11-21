function FeatureItem({ icon: Icon, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mb-2 shadow-lg">
        <Icon className="text-gray-300 text-base" />
      </div>
      <p className="text-gray-300">{label}</p>
    </div>
  );
}

export default FeatureItem;