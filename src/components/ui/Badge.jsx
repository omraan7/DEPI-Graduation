export default function Badge({ children, color = 'var(--primary)', bg, size = 'sm' }) {
  const bg_ = bg || color + '18';
  const sizes = { xs: { fontSize:10, padding:'2px 7px' }, sm: { fontSize:12, padding:'3px 10px' }, md: { fontSize:13, padding:'4px 12px' } };
  const s = sizes[size] || sizes.sm;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: bg_, color,
      borderRadius: 'var(--radius-full)',
      fontSize: s.fontSize, padding: s.padding, fontWeight: 600,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}
