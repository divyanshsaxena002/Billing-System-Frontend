import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const masterPaths = new Set(['/', '/customers', '/add-customer', '/items', '/add-item']);

function IconDashboard({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
    </svg>
  );
}

function IconStorage({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z" />
    </svg>
  );
}

function IconReceipt({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
    </svg>
  );
}

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const masterActive = masterPaths.has(pathname);

  return (
    <nav className="sidebar" aria-label="Main navigation">
      <div className="sidebar__brand">LogiEdge</div>
      <div className="sidebar__tag">Billing Dashboard</div>
      <ul className="sidebar__nav">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              ['sidebar__link', isActive && 'sidebar__link--active'].filter(Boolean).join(' ')
            }
          >
            <IconDashboard className="sidebar__icon" />
            Dashboard
          </NavLink>
        </li>
        <li>
          <button
            type="button"
            className={['sidebar__link', masterActive && 'sidebar__link--active'].filter(Boolean).join(' ')}
            onClick={() => navigate('/')}
          >
            <IconStorage className="sidebar__icon" />
            Master
          </button>
        </li>
        <li>
          <NavLink
            to="/billing"
            className={({ isActive }) => ['sidebar__link', isActive && 'sidebar__link--active'].filter(Boolean).join(' ')}
          >
            <IconReceipt className="sidebar__icon" />
            Billing
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
