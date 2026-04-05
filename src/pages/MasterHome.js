import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';

function IconPeople() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  );
}

function IconBox() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21 16V8c0-1.1-.9-2-2-2h-1V4c0-1.1-.9-2-2-2H8C6.9 2 6 2.9 6 4v2H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8 4h8v2H8V4zm0 11V8h8v7H8z" />
    </svg>
  );
}

const tiles = [
  {
    title: 'Customer',
    description: 'Manage customer profiles, tax IDs, and status.',
    to: '/customers',
    Icon: IconPeople,
    accent: '#4f46e5',
    bgTint: 'rgba(79, 70, 229, 0.08)',
  },
  {
    title: 'Items',
    description: 'Define billable items and selling prices.',
    to: '/items',
    Icon: IconBox,
    accent: '#0d9488',
    bgTint: 'rgba(13, 148, 136, 0.08)',
  },
];

export default function MasterHome() {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="page-title">Master</h2>
      <p className="page-desc">Choose a master to manage records.</p>
      <div className="grid grid--master">
        {tiles.map((tile) => {
          const { Icon } = tile;
          return (
            <Card key={tile.title} onClick={() => navigate(tile.to)} className="card--full-height">
              <div className="tile-row">
                <div className="tile-icon" style={{ background: tile.bgTint, color: tile.accent }}>
                  <Icon />
                </div>
                <div>
                  <h3 className="tile-title">{tile.title}</h3>
                  <p className="text-muted" style={{ margin: 0, lineHeight: 1.5 }}>
                    {tile.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
