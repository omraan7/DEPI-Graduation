export default function Card({ children, style = {}, onClick, hover = false, padding = '24px' }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        border: '1px solid var(--gray-200)',
        borderRadius: 'var(--radius-lg)',
        padding,
        boxShadow: 'var(--shadow-sm)',
        cursor: onClick ? 'pointer' : 'default',
        transition: hover ? 'all .2s ease' : undefined,
        ...style,
      }}
      onMouseEnter={e => { if (hover || onClick) { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}}
      onMouseLeave={e => { if (hover || onClick) { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'none'; }}}
    >
      {children}
    </div>
  );
}
