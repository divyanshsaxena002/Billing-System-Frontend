function IconBell() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

export default function Header() {
  return (
    <header className="header">
      <div>
        <h1 className="header__title">Billing Dashboard</h1>
        <p className="header__subtitle">Operations &amp; invoicing</p>
      </div>
      <div className="header__actions">
        <button type="button" className="header__icon-btn" aria-label="Notifications">
          <IconBell />
        </button>
        <button type="button" className="header__icon-btn" aria-label="Account">
          <IconUser />
        </button>
      </div>
    </header>
  );
}
