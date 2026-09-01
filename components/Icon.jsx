// مجموعة أيقونات SVG موحّدة للموقع — تحل محل الإيموجي
// الاستخدام: <Icon name="car" className="h-4 w-4" />

const PATHS = {
  van: (
    <>
      <path d="M3 16V8a1 1 0 0 1 1-1h9v9M13 11h4.2a2 2 0 0 1 1.6.8L21 15v1M3 16h1.5M10 16h5m4.5 0H21" />
      <circle cx="7" cy="17" r="1.8" />
      <circle cx="17" cy="17" r="1.8" />
    </>
  ),
  motorcycle: (
    <>
      <circle cx="5.5" cy="16.5" r="3.2" />
      <circle cx="18.5" cy="16.5" r="3.2" />
      <path d="M5.5 16.5h4l4-7.5h3M15 9h3.5l1.5 4.5M9 9h4" />
    </>
  ),
  quad: (
    <>
      <circle cx="5" cy="16.5" r="3" />
      <circle cx="19" cy="16.5" r="3" />
      <path d="M5 16.5h3l2-6h6l2 6h1M9 10.5V8h4" />
    </>
  ),
  truck: (
    <>
      <path d="M2.5 16V7a1 1 0 0 1 1-1h9.5v10M13 10h3.6a2 2 0 0 1 1.7 1l2 3.2V16M2.5 16H4m5.5 0h5.5m4 0h1.5" />
      <circle cx="6.8" cy="17.2" r="1.9" />
      <circle cx="17.2" cy="17.2" r="1.9" />
    </>
  ),
  bus: (
    <>
      <rect x="3.5" y="4" width="17" height="13" rx="2" />
      <path d="M3.5 9.5h17M3.5 13h17M8 4v5.5M16 4v5.5M7 17v2M17 17v2" />
    </>
  ),
  machinery: (
    <>
      <path d="M3 18h11v-4H3zM6 14V9h4l3 5M13 9l5-4v9" />
      <circle cx="6" cy="19.5" r="1.6" />
      <circle cx="11.5" cy="19.5" r="1.6" />
    </>
  ),
  tractor: (
    <>
      <circle cx="7" cy="16" r="4" />
      <circle cx="18" cy="17" r="2.8" />
      <path d="M7 12V7h4l2 5h5M11 7h4" />
    </>
  ),
  trailer: (
    <>
      <path d="M2.5 15V7.5a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1V15M2.5 15h3m4 0h11M17.5 15h4" />
      <circle cx="7.2" cy="16.5" r="1.7" />
    </>
  ),
  cart: (
    <>
      <path d="M3 4h2.2l2.3 10.4a1.5 1.5 0 0 0 1.5 1.2h7.6a1.5 1.5 0 0 0 1.5-1.2L20 8H6" />
      <circle cx="9.5" cy="19" r="1.4" />
      <circle cx="17" cy="19" r="1.4" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />
      <path d="M14.5 6.5l3 3" />
    </>
  ),
  car: (
    <>
      <path d="M5 17h14M6.5 17a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm14 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
      <path d="M3 17v-4.2a2 2 0 0 1 .4-1.2l2.2-3A2 2 0 0 1 7.2 8h7.9a2 2 0 0 1 1.5.7l3 3.4a2 2 0 0 1 .4 1.3V17" />
      <path d="M3 13h18" />
    </>
  ),
  phone: (
    <path d="M15.5 21a13.5 13.5 0 0 1-12.5-12.5 2.5 2.5 0 0 1 2.5-2.5h1.8a1 1 0 0 1 1 .8l.7 3a1 1 0 0 1-.3 1l-1.3 1.2a11 11 0 0 0 4.6 4.6l1.2-1.3a1 1 0 0 1 1-.3l3 .7a1 1 0 0 1 .8 1V18.5a2.5 2.5 0 0 1-2.5 2.5Z" />
  ),
  fuel: (
    <>
      <path d="M4 20h9M4 20V5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v15" />
      <path d="M4 11h9" />
      <path d="M16 8.5 18.2 7a1 1 0 0 1 1.6.8V16a1.7 1.7 0 0 1-3.4 0v-3.5H13" />
    </>
  ),
  gearbox: (
    <>
      <path d="M6 4v16M12 4v16M18 4v10" />
      <path d="M6 8h12" />
      <circle cx="6" cy="4" r="1.4" />
      <circle cx="12" cy="4" r="1.4" />
      <circle cx="18" cy="4" r="1.4" />
      <circle cx="6" cy="20" r="1.4" />
      <circle cx="12" cy="20" r="1.4" />
    </>
  ),
  gauge: (
    <>
      <path d="M12 15.5 16 10" />
      <path d="M3.5 18a9.5 9.5 0 1 1 17 0" />
      <circle cx="12" cy="17" r="1.6" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  tag: (
    <>
      <path d="M20 12.5 12.7 19.8a2 2 0 0 1-2.8 0l-5.7-5.7a2 2 0 0 1 0-2.8L11.5 4H19a1 1 0 0 1 1 1v7.5Z" />
      <circle cx="16" cy="8" r="1.3" />
    </>
  ),
  mapPin: (
    <>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  heart: (
    <path d="M12 20.3 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 1 1 19.4 13L12 20.3Z" />
  ),
  star: (
    <path d="m12 3.8 2.5 5.1 5.6.8-4 4 .9 5.6-5-2.7-5 2.7 1-5.6-4.1-4 5.6-.8L12 3.8Z" />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.4-4.4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.8" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  trash: (
    <>
      <path d="M4.5 7h15M9.5 7V5.2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V7" />
      <path d="M6.5 7l.8 12a2 2 0 0 0 2 1.9h5.4a2 2 0 0 0 2-1.9l.8-12" />
      <path d="M10.5 11v6M13.5 11v6" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.2" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.2" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.2" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.2" />
    </>
  ),
  list: (
    <>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <circle cx="5" cy="6" r="1.2" />
      <circle cx="5" cy="12" r="1.2" />
      <circle cx="5" cy="18" r="1.2" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  camera: (
    <>
      <path d="M3.5 8.5h3.2l1.6-2.4h7.4l1.6 2.4h3.2a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H3.5a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13.5" r="3.5" />
    </>
  ),
  chevronDown: <path d="m6 9.5 6 6 6-6" />,
  chevronLeft: <path d="m14.5 6-6 6 6 6" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  shield: (
    <>
      <path d="M12 3.2 5 6v6c0 4.4 3 7.6 7 8.8 4-1.2 7-4.4 7-8.8V6l-7-2.8Z" />
      <path d="m9.2 12 2 2 3.6-3.6" />
    </>
  ),
  bolt: <path d="M12.8 3 5.5 13.2h5l-1.3 7.8 7.3-10.2h-5L12.8 3Z" />,
  trending: (
    <>
      <path d="m4 16 4.8-5 3.4 3.2L20 7" />
      <path d="M15 7h5v5" />
    </>
  ),
  bell: (
    <>
      <path d="M18 15.5V11a6 6 0 0 0-12 0v4.5L4.5 18h15L18 15.5Z" />
      <path d="M10 21h4" />
    </>
  ),
  facebook: (
    <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.5-1.5h1.7V3.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V10H7.5v3h2.8v8h3.2Z" />
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="16.9" cy="7.1" r="1" />
    </>
  ),
  logout: (
    <>
      <path d="M14 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2" />
      <path d="M18 12H9m9 0-3-3m3 3-3 3" />
    </>
  ),
  inbox: (
    <>
      <path d="M3.5 13h4l1.3 2.5h6.4L16.5 13h4" />
      <path d="M5.6 5.5h12.8l2.1 7.5v4.5a2 2 0 0 1-2 2H5.5a2 2 0 0 1-2-2V13l2.1-7.5Z" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5M12 7.8v.2" />
    </>
  ),
  megaphone: (
    <>
      <path d="M4 10.5v3a2 2 0 0 0 2 2h1.5l8.5 4V4.5l-8.5 4H6a2 2 0 0 0-2 2Z" />
      <path d="M19.5 9.5a3.5 3.5 0 0 1 0 5M7.5 15.5V20" />
    </>
  ),
  flag: (
    <>
      <path d="M5 21V4" />
      <path d="M5 5h9l-1.2 3L14 11H5" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3.2" />
    </>
  ),
};

export default function Icon({ name, className = 'h-4 w-4', strokeWidth = 1.75, filled = false }) {
  const path = PATHS[name];
  if (!path) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {path}
    </svg>
  );
}
