export default function AdSpace({ position = 'default' }) {
  return (
    <div
      className={`flex items-center justify-center rounded-card border border-dashed border-line bg-white ${
        position === 'banner' ? 'my-6 h-28' : 'h-56'
      }`}
    >
      <span className="text-2xs font-medium uppercase tracking-widest text-slate-300">
        مساحة إعلانية
      </span>
    </div>
  );
}
