/**
 * Shared card shell: rounded corners, soft shadow, optional click.
 */
export default function Card({ children, onClick, className = '', contentClassName = '' }) {
  const cardClass = ['card', onClick ? 'card--clickable' : '', className].filter(Boolean).join(' ');
  const bodyClass = ['card__body', contentClassName].filter(Boolean).join(' ');
  return (
    <div className={cardClass} onClick={onClick} role={onClick ? 'button' : undefined}>
      <div className={bodyClass}>{children}</div>
    </div>
  );
}
