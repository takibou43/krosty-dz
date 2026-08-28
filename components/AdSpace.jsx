export default function AdSpace({ position = 'default' }) {
  return (
    <div className={`
      bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-400 rounded-lg
      flex items-center justify-center text-gray-500 font-semibold
      ${position === 'banner' ? 'h-40 my-8' : 'h-64'}
    `}>
      <div className="text-center">
        <div className="text-4xl mb-2">📢</div>
        <p>مساحة إعلانية</p>
        <p className="text-sm text-gray-400">Google AdSense</p>
      </div>
    </div>
  );
}
