import Icon from './Icon';

export default function PageHeader({ icon, title, subtitle, action }) {
  return (
    <div className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 px-4 py-6">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2.5 text-xl font-bold text-ink md:text-2xl">
            {icon && <Icon name={icon} className="h-6 w-6 shrink-0 text-accent" strokeWidth={1.7} />}
            {title}
          </h1>
          {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}
